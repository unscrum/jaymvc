/*
* jquery.ondata plugin
* Copyright 2011- 2018 Jay Brummels & Jonathan Sharp
* Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
*/

(function ($) {
    $.extend({
        triggerDataEvent: function (event, data) {
            if (typeof event == 'object') {
                $.each(event, function (k, v) {
                    $.triggerDataEvent(k, v);
                });
            } else {
                $(document)
                    .trigger('data' + jay.camelToPascal(event), [data]);

            }
        },
        /*
        * This method takes an event name (such as totalRecordCount), a selector to execute when that event occurs
        * (such as .data-total-record-count), and finally a callback method to execute when the event is triggered.
        */
        onDataEvent: function (event, selector, callback) {
            if ($.isFunction(selector)) {
                callback = selector;
                selector = document;
            }
            $(document).on('data' + jay.camelToPascal(event), function () {
                // Strip off the 'native' jQuery event object
                var args = Array.prototype.slice.call(arguments, 1);
                $(selector).each(function () {
                    callback.apply(this, args);
                });
            });
        },

        /*
        * A generic method for binding a data event callback handler without specifying a DOM node.
        * This allows for non DOM specific operations to take place.
        */
        onData: function (event, callback) {
            $(document).on('data' + jay.camelToPascal(event), function () {
                callback.apply({}, Array.prototype.slice.call(arguments, 1));
            });
        }
    });
})(jQuery);