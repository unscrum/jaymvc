$.onAction('load',
    function(evt, data) {
        var $t = $(this);
        if ($t.isEmpty()){
            $t.addInlineLoading('<strong>Loading...<strong>');
        } else{
            $t.showContentLoading();
        }
        jay.ajaxPostHtml({
            url: data.url
        }).fail(function() {
            $t.empty().message('error', jay.failMessage);
        }).done(function(html) {
            var $html = $(html);
            $.triggerDataEvent($html.data());
            $t.html($html).hideContentLoading();
        });
    });