/*!
* jay.message jQuery plugin
* Copyright 2011-2018 Jay Brummels
* Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
*/
(function ($) {
    var stateClasses = {
        success: { state: 'alert alert-success', icon: 'fa fa-thumbs-o-up' },
        error: { state: 'alert alert-danger', icon: 'fa fa-exclamation-triangle' },
        warning: { state: 'alert alert-warning', icon: 'fa fa-exclamation-triangle' },
        loading: { state: 'alert alert-info', icon: 'fa fa-spinner fa-pulse' },
        info: { state: 'alert alert-info', icon: 'fa fa-info-circle' }
    };

    /*
    * call $(elm).message('message'), or $(elm).message('success', 'message');
    * Types are error, success
    * it will prepend the message to the elmement used
    */
    $.fn.message = function (type, message, timeout) {
        if (arguments.length === 1) {
            message = type;
            type = 'info';
        };
        if (!stateClasses[type])
            type = 'info';


        var $i = $('<i></i>').addClass(stateClasses[type].icon);
        var $p = $('<p></p>').addClass('mb-0').append($i).append('&nbsp;&nbsp;').append(message);

        return this.messageRemove().each(function () {
            $('<div></div>')
                .addClass('message')
                .addClass(stateClasses[type].state)
                .html($p)
                .prependTo($(this))
                .one('click.message', function () {
                    $(this).slideUp('slow', function () {
                        $(this).remove();
                    });
                }).wait(timeout, function () {
                    if ((parseInt(timeout, 10) || 0) > 0) {
                        $(this).slideUp('fast', function () {
                            $(this).messageRemove();
                        });
                    }
                });
        });
    };

    $.fn.messageRemove = function () {
        return this.each(function () {
            //Get rid
            $('div.message', this).off('.message').remove();
        });
    };
})(jQuery);
