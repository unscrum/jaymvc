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