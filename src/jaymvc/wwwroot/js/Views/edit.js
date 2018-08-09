$.onAction('edit',
    function(evt, data) {
        var $t = $(this);
        var cancelButton = {
            label: 'Cancel'
        };

        if (data.deleteOnCancel === true) {
            cancelButton.onClick = function(e, content$, mw$) {
                mw$.showContentLoading();
                jay.ajax({ url: data.deleteUrl }).done(function() {
                    mw$.hideContentLoading().modal('hide');
                }).fail(function() {
                    mw$.hideContentLoading();
                    content$.message('error', jay.failMessage);
                });
            };
        } else {
            cancelButton.close = true;
        }

        jay.modal({
            title: data.title,
            partialUrl: data.url,
            size: data.size || 'medium',
            open: function() {
                $(':input', this).filterTextType().selectRangeOnFocus();
                $('div.input-group.date', this).datetimepicker({ format: 'L' });
                $('div.input-group.time', this).datetimepicker();
                $('select[multiple="multiple"]', this).multiselect();
                $(':input:first', this).focus();
            },
            close: function() {
                $(':input', this).filterTextType().selectRangeOnFocusDestroy();
                $('input[data-visibility-action="wireUpTypeAhead"]', this).typeahead('destroy');
                $('div.input-group.date', this).datetimepicker('destroy');
                $('div.input-group.time', this).datetimepicker('destroy');
                $('select[multiple="multiple"]', this).multiselect('destroy');
            },
            buttons: [
                cancelButton, {
                    label: 'Save',
                    onClick: function(e, content$, mw$) {
                        mw$.showContentLoading();
                        content$.clearJsonValidation();
                        if (data.postForm === true) {
                            content$.find('form').submit();
                        } else {
                            jay.ajax({
                                url: data.saveUrl,
                                data: $(':input', content$).getInputValues(true)
                            }).done(function(json) {
                                if (data.target) {
                                    $(data.target).wait(500,
                                        function() {
                                            $(this).addClass('on-visible');
                                        });
                                } 
                                if (data.afterAction) {
                                    $t.doAction(data.afterAction, $.extend({ }, { jsonResult: json }, data));
                                }
                                mw$.hideContentLoading().modal('hide');
                            }).error(function(dict) {
                                mw$.hideContentLoading();
                                content$.applyJsonValidation(dict);
                            }).fail(function() {
                                mw$.hideContentLoading();
                                content$.message('error', jay.failMessage);
                            });
                        }
                    }
                }
            ]
        });
    });