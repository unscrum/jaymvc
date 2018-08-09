/*
* jquery.datafilter plugin
* Copyright 2011- 2018 Jay Brummels & Jonathan Sharp
* Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
*/
(function ($) {

    function encodeName(name) {
        return 'data-' + name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    function encodeValue(value) {
        if (value) {
            value = value.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
        }
        return value || '';
    }

    function decodeName(name) {
        name = name.replace(/^data-/ig, '').toLowerCase();
        return $.map(name.split('-'), function (n, i) {
            return (i > 0 ? n.substr(0, 1).toUpperCase() + n.substr(1) : n);
        }).join('');
    }

    function generateSelector(attr, value, comparison) {
        if (arguments.length === 0) {
            attr = value = '';
            comparison = '*=';
        } else if (arguments.length === 1) {
            value = '';
            comparison = '*=';
        } else if (arguments.length === 2) {
            comparison = '=';
        }
        var name = encodeName(decodeName(attr));
        var val = encodeValue(value);
        var selector = name + comparison + '"' + val + '"';
        return '[' + selector + ']';
    }

    function executeFindOfFilter(type, args) {
        // Multiple attribute seletions
        var selector;
        if (typeof args[0] == 'object') {
            selector = '';
            for (var i = 0; i < args.length; i++) {
                selector += generateSelector.apply({}, args[i]);
            }
            if (selector === '') {
                return this.pushStack([]);
            }
            return this[type](selector);
        }
        selector = generateSelector.apply({}, args);
        if (selector === '') {
            return this.pushStack([]);
        }
        return this[type](selector);
    }

    /*
    $('body').dataFilter('criteria', 'MTA', '$=');
	
    $('body').dataFilter(['criteria', 'MTA'], ['foo'], []);	
    */
    $.fn.dataFilter = function (/*attr, value, comparison*/) {
        return executeFindOfFilter.call(this, 'filter', arguments.length === 1 ? arguments[0] : arguments);
    };

    // $().datasetFind('criteria', 'MTA');
    $.fn.dataFind = function (/*attr, value, comparison*/) {
        return executeFindOfFilter.call(this, 'find', arguments.length === 1 ? arguments[0] : arguments);
    };
})(jQuery);