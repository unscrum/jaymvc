/*!
* jay.onaction plugin
* Copyright 2011- 2018 Jay Brummels & Jonathan Sharp
* Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
*/


/*
* This is the main event handling pattern for these sites. All event handling is processed through event delegation
* with the following pattern. Event handlers are defined but not bound to individual elements (decoupled) by calling
* $.onAction('someAction', function() { ... }); Elements are then tagged for specific events by adding a css
* class that starts with action- followed by the action name, so in our example above, the associated action would be
* action-some-action. Multiple action handlers may be registered for a single action. If only one action handler should
* be registered at a give time, you may setup that action by using $.singleOnAction(...) which will remove any
* existing action handlers for that action. This is useful if a script is loaded or included multiple times on a page.
*/
(function ($) {

// ReSharper disable InconsistentNaming
    var ACTION = {
// ReSharper restore InconsistentNaming
        dataMap: {},
        handlers: {}
    };

    // Given an action, execute all of the action handlers in the context of the target element
    function handleAction(target, action, data) {
        log('onAction:handleAction: ' + action);
        var act = action.toLowerCase();
        if (ACTION.handlers[act] && ACTION.handlers[act].length > 0) {
            var handlers = ACTION.handlers[act];

            // Has an actionData callback has been implemented to extract an elements data prior to event handling?
            var dataMap = ACTION.dataMap[ACTION.dataMap[act] ? act : '*'];
            data = $.extend(dataMap.call(target, { type: action, target: target }, data), data || {});

            // Iterate over the action handlers and execute each one.
            for (var i = 0, il = handlers.length; i < il; i++) {
                if (handlers[i] !== null) {
                    var settings = handlers[i][0];
                    var ret = handlers[i][1].call(target, settings, { type: action, target: target }, $.extend(settings.data, data));
                    // This handler is only executed once
                    if (settings.one === true) {
                        handlers[i] = null;
                    }
                    if (ret === false) {
                        break;
                    }
                }
            }
        }
        if(target !== document)
            if ($(target).isTextType())
                $( target ).data( 'onactionblur', false );
    }

    $.extend({
        actionCssClass: function (klass) {
            return klass.replace(/([a-z])([A-Z])/g, '$1-$2')
						.replace(/([a-z])([0-9])/gi, '$1-$2')
						.replace(/([0-9])([a-z])/g, '$1-$2')
						.toLowerCase();
        },
        actionData: function (action, handler) {
            var actions = action.split(/\s+/);
            for (var i = 0, il = actions.length; i < il; i++) {
                action = actions[i].toLowerCase();
                ACTION.dataMap[action] = handler;
            }
        },
// ReSharper disable InconsistentNaming
        onAction: function (_action, callback, data) {
// ReSharper restore InconsistentNaming
            var settings = {
                unique: false,
                one: false,
                action: '',
                handler: null,
                data: null
            };
            if (arguments.length === 1) {
                settings = $.extend(settings, arguments[0]);
            } else if (arguments.length >= 2) {
                settings.action = _action;
                settings.handler = callback;
                settings.data = data;
            }
            var actions = settings.action.split(/\s+/);
            for (var i = 0, il = actions.length; i < il; i++) {
                settings.action = actions[i];
                settings.actionClass = this.actionCssClass(settings.action);

                var action = settings.action.toLowerCase();
                if (!ACTION.handlers[action] || settings.unique === true) {
                    ACTION.handlers[action] = [];
                }
                ACTION.handlers[action].push([settings, function (settings, evt, data) {
                    return settings.handler.call(evt.target, evt, data);
                } ]);
            }
        },
        singleOnAction: function (action, callback, data) {
            this.onAction({
                action: action,
                handler: callback,
                data: data,
                unique: true
            });
        },
        doAction: function (action, data, target) {
            handleAction(target || document, action, data);
        }
    });

    // Our default datamap handler
    $.actionData('*', function (evt, data) {
        if (typeof data !== 'object') {
            if (this.nodeType && this.nodeType === 1) {
                return $(this).data();
            } else {
                return {};
            }
        }
        return data;
    });

    $.fn.doAction = function (action, data) {
        return this.each(function () {
            handleAction(this, action, data);
        });
    };

    $(document)
// ReSharper disable InconsistentNaming
		.on('focusin', function (evt, _target) {
// ReSharper restore InconsistentNaming
		    var target = _target || evt.target;
		    // log('focus on ' + target);
		    if ($(target).is(document))
		        return;
		    // Bind to change event for SELECT elements and syntetically bubble it
		    if ($(target).is('select') && $(target).data('onactionchange') !== true) {
		        log('onAction:binding change');
		        $(target)
					.data('onactionchange', true)
					.change(function () {
					    log('change event triggered');
					    $(this).trigger('actionchange');
					});
		    }
		    else if ($(target).isTextType() && $(target).data('onactionblur') !== true) {
		        var onEnter = $(target).data('onEnter');
		        if (onEnter === true){
                    $(target).on('keypress', function (e) {
                        if (e.which === 13){
                            $(this).trigger('blur').off('keypress');
                        }
                    });
                }
		        $(target)
                    .data('onactionblur', true)
                    .one('blur', function () {
                        $(this).trigger('actionblur');
                    });
		    }
		})
		.on('click actionchange actionblur', function (evt) {
		    var ret = true;
            var $target = $(evt.target);
            if ( evt.type === 'click' && ( $target.isTextType() || $target.is('select') || $target.is('option') ) )
// ReSharper disable InconsistentFunctionReturns
		        return;
// ReSharper restore InconsistentFunctionReturns
		    // Construct a group of elements (target, parents) and walk
		    // through the elements looking for the first action-* class
            $target
				.add($target.parents())
				.each(function () {
		            if (this.className && this.className.match) {
				        var action = this.className.match(/(^|\s)action-([^\s]+)(\s|$)/);
				        if (action) {
				            action = action[2].replace(/[^a-z0-9]/gi, '').toLowerCase();
				            var $t = $(this);
				            if (!($t.attr('disabled') === 'disabled'))
				            {
                                log('onAction:actionCaptured: (' + evt.type + ')' + action + ' ' + this.tagName.toLowerCase() + '#' + ($t.attr('id') || '') + '');
                                handleAction(this, action, $t.data());
				            }
				            ret = false;
				            return false;
				        }
		            }
// ReSharper disable NotAllPathsReturnValue
		        });
// ReSharper restore NotAllPathsReturnValue

		    // Do not cancel click events on a checkbox or radio button
            if (!$target.is(':checkbox,:radio,select')) {
		        log(evt.type + ' returning ' + ret);
		        if (ret === false) {
		            evt.preventDefault();
		        }
		        return ret;
		    }
		});
})(jQuery);
