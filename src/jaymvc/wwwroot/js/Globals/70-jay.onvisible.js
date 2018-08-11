/*!
* jay.onvisible jQuery plugin
* Copyright 2011-2018 Jay Brummels
* Licensed under MIT (https://github.com/unscrum/jaymvc/LICENSE)
*/
(function ($, jay, window) {

    $(function() {
        window.setInterval(function() {

            $('.on-visible:visible').removeClass('on-visible').each(function() {
                var $t = $(this);
                var data = $t.data();
                log('triggering visibility action for', this, data.visibilityAction);
                if (data && data.visibilityAction) {
                    $t.doAction(data.visibilityAction);
                }
            });

        }, 200);
    });


})(jQuery, jay, window);
