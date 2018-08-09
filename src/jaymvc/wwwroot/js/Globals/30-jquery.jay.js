/**
* This file contains jQuery methods specific to Jay. These are smaller functions 
* tied to the UI. (Also see jquery.utility.js)
*/

(function ($) {

    $.fn.selectRange = function (start, end) {
        var e = this[0];
        var $this = $(e);
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

    $.fn.showContentLoading = function (size, zindex) {
        var sizes = {
            sm: '<h5/>',
            md: '<h4/>',
            lg: '<h3/>',
            xl: '<h2/>'
        };
        var $spinner = $('<i/>').addClass('fa fa-spin fa-spinner');
        var $wrap = $(sizes[size] || sizes['lg']).addClass('m-1').html($spinner);
        var $col = $('<div/>').addClass('col-12').html($wrap);
        var $row = $('<div/>').addClass('row').html($col);
        var $loading = $('<div/>').addClass('jay-loading p-5 position-absolute text-center').css({
            'z-index': 103,
            background:'rgba(167,167,167,0.65)'
        }).html($row);

        return this.hideContentLoading().each(function () {
            var over = $loading.clone();
            var zIndex = parseInt(zindex, 10) || 0;
            if (zIndex) {
                over.css('z-index', zindex);
            }

            var $element = $(this);
            var target = $element.closest('div.modal');
            if (target.length === 0) {
                target = 'body';
            } else {
                over.css('z-index', zIndex > 1060 ? zIndex : 1060);
            }
            over
                .on('reposition', function () {
                    $(this)
                        .css({
                            width: $element.outerWidth(),
                            height: $element.outerHeight()
                        })
                        .position({
                            my: 'top left',
                            at: 'top left',
                            of: $element
                        });
                })
                .appendTo(target)
                .trigger('reposition') //trigger it twice for webkit, first time always has negative top.
                .trigger('reposition');

            var data = $element.data('loadingElements') || [];
            data.push(over[0]);
            $element.data('loadingElements', data);
        });
    };
    $.fn.hideContentLoading = function () {
        return this.each(function () {
            var loading = $(this).data('loadingElements') || [];
            var ln = loading.length;
            while (ln >= 0) {
                $(loading[--ln]).fadeOut('fast', function () {
                    $(this).remove();
                });
            }
        });
    };
    $.extend({
        hideAllContentLoading: function() {
            $('div.jay-loading').remove();
        }
    });

    $(window).on('resize', function () {
        $('div.jay-loading').trigger('reposition');
    });

    $.fn.addInlineLoading = function (txt) {
        var $spinner = $('<i/>').addClass('fa fa-spin fa-spinner');
        var $col = $('<span/>').addClass('col-12 m-2').html($spinner);
        var $loading = $('<span/>').addClass('row').html($col);
        if (txt) {
            $spinner.addClass('float-left');
            $col.append($('<span/>').html(txt).addClass('float-left mx-2'));
        }
        return this.html($loading);
    };
    
})(jQuery);