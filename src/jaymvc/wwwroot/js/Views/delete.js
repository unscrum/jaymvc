$.onAction('delete',
    function(evt, data) {
        var $tr = $(this).closest('tr');
        jay.modal({
            title: data.title,
            size: 'small',
            content: $('<div/>').html(data.message),
            buttons: [
                {
                    label: 'No, Cancel',
                    close: true
                }, {
                    label: data.positiveButton || 'Yes, Delete',
                    cssClass: 'btn-danger',
                    onClick: function(e, content$, mw$) {
                        mw$.showContentLoading();
                        content$.messageRemove();
                        jay.ajax({
                            url: data.url
                        }).done(function() {
                            $tr.slideUp('slow',
                                function() {
                                    $(this).remove();
                                });
                            if (data.target) {
                                $(data.target).wait(500,
                                    function() {
                                        $(this).empty().addClass('on-visible');
                                    });
                            }
                            mw$.hideContentLoading().modal('hide');
                        }).error(function(msg) {
                            mw$.hideContentLoading();
                            content$.message('error', msg);
                        }).fail(function() {
                            mw$.hideContentLoading();
                            content$.message('error', jay.failMessage);
                        });
                    }
                }
            ]
        });
    });
