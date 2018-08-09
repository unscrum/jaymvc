$.onAction('scrollTo',
    function (e, data) {
        $('html,body').animate({
                scrollTop: $(data.where).offset().top - 100
            },
            700);
    });