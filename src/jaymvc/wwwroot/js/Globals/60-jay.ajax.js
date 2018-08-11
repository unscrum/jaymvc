/*!
* jay.ajax plugin
* Copyright 2011- 2018 Jay Brummels & Jonathan Sharp
* Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
*/
/*
* This is the main Ajax handling component for the entire project. It wraps all Ajax calls to and from the server
* expecting a common envelope format that it unpacks and passes back the enclosed data.
*/
(function ($, jay) {
    jay.ajaxPostHtml = function(options) {
        var ajaxOptions = $.extend({
            // Default values (overwriteable)
            async: true,
            cache: false,
            dataType: 'html',
            global: true,
            type: 'POST',
            target: this[0],
            traditional: true
        },
        // Optional user options
		options.ajax || {}, {
		    url: options.url,
		    data: options.data || {}
		});

		var failedAbortErrorDeferred = $.Deferred();
        var jqXhr = $.ajax(ajaxOptions);

        jqXhr.fail(function (xhr, status, error) {
            if (xhr.status !== 0) {
                if (xhr.status === 401) {
                    self.location.replace(window.location.pathname);
                } else {
                    if (xhr.status === 403) {
                        jay.alert('Access Denied.');
                    }
                    failedAbortErrorDeferred.reject(xhr, status, error);
                }
            }
        });


        failedAbortErrorDeferred.promise();

        return $.extend(jqXhr, {
            fail: failedAbortErrorDeferred.fail
        });
    };

    jay.ajax = function (options) {
        var ajaxOptions = $.extend({
            // Default values (overwriteable)
            async: true,
            cache: false,
            dataType: 'json',
            global: true,
            type: 'POST',
            target: this[0],
            traditional:true
        },
        // Optional user options
		options.ajax || {}, {
		    url: options.url,
		    data: options.data || {}
		});
        var successErrorDeferred = $.Deferred();
        var failedAbortErrorDeferred = $.Deferred();
        var jqXhr = $.ajax(ajaxOptions);

        jqXhr.done(function (json, status, xhr) {
            if (json && json.status && json.status === 'success') {
                successErrorDeferred.resolve(json.data, status, xhr);
            } else {
                successErrorDeferred.reject(json.data, 'error', xhr);
            }
        }).fail(function (xhr, status, error) {
            if (xhr.status !== 0) {
                if (xhr.status === 401) {
                    self.location.replace(window.location.pathname);
                } else {
                    if (xhr.status === 403) {
                            jay.alert('Access Denied.');
                    }
                    failedAbortErrorDeferred.reject(xhr, status, error);
                }
            }
        });

        successErrorDeferred.promise();
        failedAbortErrorDeferred.promise();

        return $.extend(jqXhr, {
            fail: failedAbortErrorDeferred.fail
        }, {
            done: successErrorDeferred.done,
            error: successErrorDeferred.fail
        });
    };

    $.fn.jayLoad = function(url, data, func) {
        var $t = $(this);
        if (arguments.length === 2) {
            func = data;
            data = {};
        }
        jay.ajaxPostHtml({
            url: url,
            data: data
        }).done(function(html) {
            $t.html(html);
            if (func && $.isFunction(func)) {
                func.call($t);
            }
        });
    };

})(jQuery, jay);
