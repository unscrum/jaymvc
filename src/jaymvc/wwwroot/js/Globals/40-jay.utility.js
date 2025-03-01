/*!
 * jay.utility (https://github.com/unscrum/jaymvc)
 * Copyright 2018 Jay Brummels
 * Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
 */

/**
* This file contains jQuery utility methods. These are small distinct functions
* that are more than likely not tied to the UI.
*/
(function($) {
    // Debugging methods
    $.fn.dumpStack = function(title, content) {
        if (this.length === 0) {
            log('dumpStack ' + (title ? '(' + title + ') ' : '') + 'empty');
        } else {
            log('dumpStack ' + (title ? '(' + title + ') ' : '') + this.length);
            this.each(function(i) {
                log(i +
                    ': ' +
                    this.tagName +
                    (this.id ? '#' + this.id : '') +
                    (this.className !== '' ? '.' + this.className.replace(/\s/g, '.') : '') +
                    ($(this).is(':input') ? ' VAL[' + $(this).val() + ']' : '') +
                    (title === true || content ? ' HTML[' + $(this).html().substr(0, 45) + '...]' : ''));
            });
            log('dumpStack (end)');
        }
        return this;
    };


    // Given two classes, will replace one with the second
    // Third argument specifies if the first class is required for
    // the second to be added
    $.fn.swapClass = function(c1, c2, requireFirst) {
        return this.each(function() {
            if (requireFirst === false || $(this).hasClass(c1)) {
                var c = $(this).attr('class');
                c = c.replace(new RegExp('(^|\\\s+)' + c1 + '(\\\s+|$)'), '$1' + c2 + '$2');
                $(this).attr('class', c);
            }
        });
    };

    // Returns a new jQuery collection with all unique elements
    $.fn.unique = function() {
        return this.pushStack($.unique(this));
    };

    /*
    * This method is similar to clone with the exception that
    * it will return an array of all of the clones of the element.
    */
    $.fn.duplicate = function(count, cloneEvents) {
        var tmp = [];
        for (var i = 0; i < count; i++) {
            $.merge(tmp, this.clone(cloneEvents).get());
        }
        return this.pushStack(tmp);
    };

    // Returns an array of values
    $.fn.values = function() {
        var values = [];
        this.each(function() {
            values.push($(this).val());
        });
        return values;
    };

    // Returns a string of joined values
    $.fn.joinValues = function(delim) {
        return this.values().join(arguments.length === 0 ? ',' : delim);
    };

    // Returns the value of the first element that contains the specified attribute
    // otherwise returns an empty string
    $.fn.firstAttr = function(attr) {
        var ret = '';
        this.each(function() {
            var r = $(this).attr(attr);
            if (r !== '') {
                ret = r;
                return false;
            }
// ReSharper disable NotAllPathsReturnValue
        });
// ReSharper restore NotAllPathsReturnValue
        return ret;
    };

    // Usage:
    // $('a').wait(5000, ['hello', 'world'], function(a, b) {
    //   alert( a + ' ' + b );
    //   $(this).addClass('highlight-links');
    // });
    $.fn.wait = function(timeout, data, fn) {
        if ($.isFunction(data)) {
            fn = data;
            data = [];
        }
// ReSharper disable InconsistentNaming
        var _this = this;
// ReSharper restore InconsistentNaming
        setTimeout(function() {
                _this.each(function() {
                    fn.call(this, data);
                });
            },
            timeout);
        return this;
    };

    $.fn.selectRange = function (start, end) {
        var e = this[0];
        var $this = $(e);
        if($this.is('[type="number"]'))
            return this;
        
        if (arguments.length === 0) {
            start = 0;
            end = $this.val().length;
        } else if (arguments.length === 1) {
            end = start;
            start = 0;
        }
        if (document.activeElement !== e) {
            $this.focus();
        }
        if (e.setSelectionRange) { /* WebKit */
            setTimeout(function(){
                e.setSelectionRange(start, end);
            }, 1);
        }
        else if (e.createTextRange) { /* IE */
            var range = e.createTextRange();
            range.collapse(true); range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
        else if (e.selectionStart && e.selectionEnd) {
            e.selectionStart = start;
            e.selectionEnd = end;
        }
        return this;
    };

    $.fn.selectRangeOnFocus = function () {
        return this.each(function () {
            $(this).on('focusin', function () {
                $(this).selectRange();
            });
        });

    };

    $.fn.selectRangeOnFocusDestroy = function () {
        return this.each(function () {
            $(this).off('focusin');
        });

    };


    // This method connects one dom event to another
    /*
    * This method is used to cross bind events. For example you can bind the click event of #element1
    * to the updateList custom event of #element2 by doing:
    * $('#element1').connect('click', '#element2', 'updateList');
    */
    $.fn.connect = function(/*[propagation, ]sourceEvent, target, targetEvent [, argsArray]*/) {
        var sourceHandling = false;
        var i = 0;
        if (typeof arguments[0] === 'boolean' || typeof arguments[0] === 'object') {
            sourceHandling = arguments[0];
            i++;
        }
        var sourceEvent = arguments[i++],
            target = arguments[i++],
            targetEvent = arguments[i++] || null,
            args = arguments[i] || null;

        return this.on(sourceEvent,
            function(evt) {
// ReSharper disable InconsistentNaming
                var _args = args;
// ReSharper restore InconsistentNaming
                // If the user didn't specify any arguments, pass through the events args
                // (very useful for custom events)
                if (_args === null) {
                    _args = Array.prototype.slice.call(arguments, 1);
                }
                $(target || this).trigger(targetEvent || sourceEvent, _args || []);
                if (typeof sourceHandling === 'object') {
                    if (sourceHandling.stopPropagation === true) {
                        evt.stopPropagation();
                    }
                    if (sourceHandling.preventDefault === true) {
                        evt.preventDefault();
                    }
                    if (sourceHandling.stopImmediatePropagation === true) {
                        evt.stopImmediatePropagation();
                    }
                }
                return sourceEvent;
            });
    };
    /*
    * Clears all form inputs
    */
    $.fn.clearForm = function() {
        return this.each(function() {
            var $t = $(this);
            var type = $t.attr('type');
            var tag = this.tagName.toLowerCase(); // normalize case
            // it's ok to reset the value attr of text inputs,
            // password inputs, and textareas
            if (type === 'text' || type === 'password' || tag === 'textarea' || tag === 'select') {
                if (tag === 'select') {
                    $t.attr('selectedIndex', -1);
                }
                $t.val('');
                // checkboxes and radios need to have their checked state cleared
                // but should *not* have their 'value' changed
            } else if (type === 'checkbox' || type === 'radio') {
                $t.attr('checked', false);
            }
        });
    };

    /*
    *  This is the preferred method for gathering form input.
    */
    $.fn.getInputValues = function(extra, allFields) {
        if (arguments.length === 1 && typeof extra === 'boolean') {
            allFields = extra;
            extra = null;
        }
        var data = {};
        var elements = this;
        if (this.is('form') || !this.is(':input')) {
            elements = $(this).find(':input');
        }
        elements.each(function() {
            var $t = $(this);
            var $e = $t.is(':hidden') ? $t.parent() : $t;
            if (allFields === true || $e.is(':visible')) {
                // Find the closest element that has either a name attribute or an id attribute
                var tmp = $t.closest('[name],[id]');
                var id = tmp.attr('name') || tmp.attr('id');
                if (($t.is(':checkbox,:radio') && !$t.is(':checked')) || ($t.is(':text') && $t.val() === '')) {
                    return;
                }

                var val = $t.is(':checkbox') ? ($t.attr('value') !== 'on' ? $t.val() : $t.is(':checked')) : $t.val();
                if (data[id] === undefined) {
                    data[id] = val;
                } else {
                    data[id] = $.makeArray(data[id]);
                    data[id].push(val);
                }
            }
        });
        if (extra) {
            $.extend(data, extra);
        }
        return data;
    };

    $.fn.isTextType = function () {
        var $t = $(this).first();
        return $t.is('textarea') ||
            $t.is(':text, :password') ||
            $t.is(':input[type="color"]') ||
            $t.is(':input[type="date"]') ||
            $t.is(':input[type="datetime"]') ||
            $t.is(':input[type="datetime-local"]') ||
            $t.is(':input[type="email"]') ||
            $t.is(':input[type="month"]') ||
            $t.is(':input[type="number"]') ||
            $t.is(':input[type="range"]') ||
            $t.is(':input[type="search"]') ||
            $t.is(':input[type="tel"]') ||
            $t.is(':input[type="time"]') ||
            $t.is(':input[type="url"]') ||
            $t.is(':input[type="week"]');
    };

    $.fn.clearJsonValidation = function(){
        $('span.form-text.text-danger', this).remove();
        $('.form-control.is-invalid',this).removeClass('is-invalid');
        return this.messageRemove();
    };

    $.fn.applyJsonValidation = function(dict){

        if ($.isPlainObject(dict)) {
            for (var key in dict) {
                if( $(':input[name="' + key + '"]', this).length ){
                    $(':input[name="' + key + '"]', this).addClass('is-invalid').closest('div.form-group')
                        .append($('<span/>').addClass('form-text text-danger')
                        .html(dict[key]));
                } else if( $('#'+key, this).length ){
                    $('#'+key, this).addClass('is-invalid').closest('div.form-group')
                        .append($('<span/>').addClass('form-text text-danger')
                        .html(dict[key]));
                }
            }
        } else {
            this.message('error', dict);
        }
        return this;
    };

    $.fn.filterTextType = function() {
        var ret = [];
        this.each(function () {
            if ($(this).isTextType() === true) {
                ret.push(this);
            }
        });
        return $(ret);
    };

    $.fn.isEmpty = function () {
        var $t = $(this[0]);
        return $t.has('*').length === 0 && $t.text().trim().length === 0;
    };
})(jQuery);
