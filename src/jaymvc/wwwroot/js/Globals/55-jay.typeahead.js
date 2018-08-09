!function ($) {
    
    /* TYPEAHEAD PUBLIC CLASS DEFINITION
     * ================================= */

    var Typeahead = function (element, options) {

        var that = this;
        that.$element = $(element).attr('autocomplete', 'off');
        that.options = $.extend({}, {
            items: 10,
            alignWidth: true,
            menu: '<ul class="typeahead dropdown-menu"></ul>',
            item: '<li class="dropdown-item"><a href="#" class="text-dark"></a></li>',
            valueField: 'id',
            displayField: 'val',
            postParam: 'q',
            ajax: {
                url: null,
                timeout: 300,
                triggerLength: 2
            }
        }, options);
        that.$menu = $(that.options.menu).insertAfter(that.$element);
        that.ajax = $.extend({}, that.options.ajax);
        that.query = '';
        that.shown = false;
        that.listen();
    };

    Typeahead.prototype = {
        constructor: Typeahead,
        //=============================================================================================================
        //  Utils
        //  Check if an event is supported by the browser eg. 'keypress'
        //  * This was included to handle the "exhaustive deprecation" of jQuery.browser in jQuery 1.8
        //=============================================================================================================
        select: function () {
            var $selectedItem = this.$menu.find('.active');
            if ($selectedItem.length) {
                var data = $selectedItem.data();
                var text = this.$menu.find('.active a').text();

                this.$element
                    .val(this.updater(text))
                    .trigger('typeaheadsuccess', [data.value, text, data.all])
                    .change();
            }
            return this.hide();
        },
        updater: function (item) {
            return item;
        },
        show: function () {
            var pos = $.extend({}, this.$element.position(), {
                height: this.$element[0].offsetHeight
            });

            this.$menu.css({
                top: pos.top + pos.height,
                left: pos.left
            });

            if (this.options.alignWidth) {
                var width = $(this.$element[0]).outerWidth();
                this.$menu.css({
                    'min-width': width
                });
            }

            this.$menu.show();
            this.shown = true;
            return this;
        },
        hide: function () {
            this.$menu.hide();
            this.shown = false;
            return this;
        },
        ajaxLookup: function () {

            var query = $.trim(this.$element.val());

            if (query === this.query) {
                return this;
            }

            // Query changed
            this.query = query;

            // Cancel last timer if set
            if (this.ajax.timerId) {
                clearTimeout(this.ajax.timerId);
                this.ajax.timerId = null;
            }

            if (!query || query.length < this.ajax.triggerLength) {
                // cancel the ajax callback if in progress
                if (this.ajax.xhr) {
                    this.ajax.xhr.abort();
                    this.ajax.xhr = null;
                }

                return this.shown ? this.hide() : this;
            }

            function execute() {
                var that = this;

                // Cancel last call if already in progress
                if (that.ajax.xhr)
                    that.ajax.xhr.abort();

                var postData = {};
                postData[that.options.postParam] = query;

                that.$element.trigger('typeaheadstartingsearch', arguments);
                this.ajax.xhr = jay.ajax({
                    url: this.ajax.url,
                    data: postData
                }).done(function () {
                    that.$element.trigger('typeaheadsearchdone', arguments);
                    that.ajaxSource.apply(that, arguments);
                }).error(function() {
                    if (that.shown) {
                         that.hide();
                    }
                    that.$element.trigger('typeaheadnoresults', arguments);
                }).fail(function () {
                    that.$element.trigger('typeaheadfail', arguments);                    
                });
                this.ajax.timerId = null;
            }

            // Query is good to send, set a timer
            this.ajax.timerId = setTimeout($.proxy(execute, this), this.ajax.timeout);

            return this;
        },
        ajaxSource: function (data) {
            var that = this;
            if (!that.ajax.xhr)
                return null;

            // Save for selection retreival
            that.ajax.data = data;

            // Manipulate objects
            var items = that.grepper(that.ajax.data) || [];
            that.ajax.xhr = null;
            return that.render(items.slice(0, that.options.items)).show();
        },
        matcher: function (item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase());
        },
        highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
            });
        },
        render: function (items) {
            var that = this, display, isString = typeof that.options.displayField === 'string';

            items = $(items).map(function (i, item) {
                if (typeof item === 'object') {
                    display = isString ? item[that.options.displayField] : that.options.displayField(item);
                    i = $(that.options.item).attr('data-value', item[that.options.valueField]).data('all', item);
                } else {
                    display = item;
                    i = $(that.options.item).attr('data-value', item).data('all', item);
                }
                i.find('a').html(that.highlighter(display));
                return i[0];
            });
            items.first().addClass('active');

            this.$menu.html(items);
            return this;
        },
        //------------------------------------------------------------------
        //  Filters relevent results
        //
        grepper: function (data) {
            var that = this, items, display, isString = typeof that.options.displayField === 'string';

            if (isString && data && data.length) {
                if (data[0].hasOwnProperty(that.options.displayField)) {
                    items = $.grep(data, function (item) {
                        display = isString ? item[that.options.displayField] : that.options.displayField(item);
                        return that.matcher(display);
                    });
                } else if (typeof data[0] === 'string') {
                    items = $.grep(data, function (item) {
                        return that.matcher(item);
                    });
                } else {
                    log('null inner');
                    return null;
                }
            } else {
                return null;
            }
            return items;
        },
        next: function () {
            var active = this.$menu.find('.active').removeClass('active'),
                next = active.next();

            if (!next.length) {
                next = $(this.$menu.find('li')[0]);
            }
            
            next.addClass('active');
        },
        prev: function () {
            var active = this.$menu.find('.active').removeClass('active'),
                prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }

            prev.addClass('active');

        },
        listen: function () {
            this.$element
                .on('focus.typeahead', $.proxy(this.focus, this))
                .on('blur.typeahead', $.proxy(this.blur, this))
                .on('keypress.typeahead', $.proxy(this.keypress, this))
                .on('keyup.typeahead', $.proxy(this.keyup, this))
                .on('keydown.typeahead', $.proxy(this.keydown, this));
            
            this.$menu
                .on('click.typeahead', $.proxy(this.click, this))
                .on('mouseenter.typeahead', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave.typeahead', 'li', $.proxy(this.mouseleave, this));
        },
        move: function (e) {
            if (!this.shown)
                return;

            switch (e.keyCode) {
            case 9: // tab
            case 13: // enter
            case 27: // escape
                e.preventDefault();
                break;

            case 38: // up arrow
                e.preventDefault();
                this.prev();
                break;

            case 40: // down arrow
                e.preventDefault();
                this.next();
                break;
            }

            e.stopPropagation();
        },
        keydown: function (e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
            this.move(e);
        },
        keypress: function (e) {
            if (this.suppressKeyPressRepeat)
                return;
            this.move(e);
        },
        keyup: function (e) {
            switch (e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
                break;

            case 9: // tab
            case 13: // enter
                if (!this.shown)
                    return;
                this.select();
                break;

            case 27: // escape
                if (!this.shown)
                    return;
                this.hide();
                break;

            default:
                this.ajaxLookup();
            }
            e.stopPropagation();
            e.preventDefault();
        },
        focus: function () {
            this.focused = true;
        },
        blur: function () {
            this.focused = false;
            if (!this.mousedover && this.shown)
                this.hide();
        },
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
            this.$element.focus();
        },
        mouseenter: function (e) {
            this.mousedover = true;
            this.$menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        },
        mouseleave: function () {
            this.mousedover = false;
            if (!this.focused && this.shown)
                this.hide();
        },
        destroy: function () {
            this.$element.off('.typeahead');
            this.$menu.off('.typeahead').remove();
            this.$element.removeData('typeahead');
        }
    };


    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */

    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('typeahead'),
                options = typeof option === 'object' && option;
            if (!data)
                $this.data('typeahead', (data = new Typeahead(this, options)));
            if (typeof option === 'string')
                data[option]();
        });
    };
    
    $.fn.typeahead.Constructor = Typeahead;

}(window.jQuery);