$.onAction('wireUpTypeAhead',
    function(e, data) {
        var $t = $(this)
            .attr('autocomplete', 'off')
            .on('typeaheadstartingsearch',
                function() {
                    $t.removeClass('is-valid')
                        .removeClass('is-invalid');
                })
            .on('typeaheadsearchdone',
                function() {
                    $t.removeClass('is-invalid')
                        .addClass('is-valid');

                })
            .on('typeaheadfailure',
                function() {
                    $t.removeClass('is-valid')
                        .addClass('is-invalid')
                        .closest('form').message('error', jay.failMessage);
                })
            .on('typeaheadnoresults',
                function() {
                    $t.removeClass('is-valid')
                        .addClass('is-invalid');
                })
            .on('typeaheadsuccess',
                function(e1, value) {
                    $t.removeClass('is-invalid')
                        .removeClass('is-valid');
                    $(data.valueField).val(value);
                    if (data.afterAction) {
                        $t.doAction(data.afterAction, $.extend({ value: value }, data));
                    }
                })
            .on('focus',
                function() {
                    $(this).one('blur',
                        function() {
                            if (!$(this).val()) {
                                $(data.valueField).val('');
                                if (data.afterAction) {
                                    $t.doAction(data.afterAction, $.extend({ value: '' }, data));
                                }
                            }
                        });
                })
            .typeahead({
                ajax: {
                    url: data.url,
                    triggerLength: parseInt(data.triggerLength, 10) || 2
                }
            });
    });