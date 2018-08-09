(function ($, jay) {
    /*
    * call jay.alert('message'), or jay.alert('title', 'message');
    */
    jay.alert = function (title, message, size) {
        if (arguments.length === 1) {
            message = title;
            title = 'Alert';
        };

        jay.modal({
            content: $('<p title="text-danger"></p>').html(message),
            title: title,
            size: size || 'small',
            buttons: [
                {
                    label: 'Close',
                    close: true
                }
            ]
        });
    };
    /*
    * call jay.modal( { title:'title', 
    *                        content: $('#contentID') } ); to load content into a modal from an ID
    * or jay.modal( { title:'title', 
    *                            partialUrl: '/controller/action/', 
    *                           partialData: { id: 1, name: 'jay' } } ); to load the content in from a parital view with the data provided
    * optionally set the first container in the partial view to have a data-modal-title="Title" attribute and call
    * or jay.modal( { partialUrl: '/controller/action/', 
    *                               partialData: { id: 1, name: 'jay' } } );
    * or jay.modal( { partialUrl: '/controller/action/'} ); for a partial that does not take any parameters.
    * You can override the buttons by typing your own buttons collection:
    * jay.modal( { partialUrl: '/controller/action/', buttons [ { label: 'Cancel',
    *                                                             onClick: null,
    *                                                             close: true},
    *                                                           { label: 'Validate',
    *                                                             onClick: function(evt, $modalContantArea, $modalWrapper){
    *                                                               //CODE HERE TO Validate
    *                                                               $modalWrapper.modal('hide') //To close when you are done inside of promise
    *                                                              },
    *                                                             close: false,
    *                                                             cssClass: 'btn-danger'
    *                                                           }  
    *                                                           { label: 'Save and Close',
    *                                                             onClick: function(evt, $modalContantArea, $modalWrapper){
    *                                                               //CODE HERE TO SAVE
    *                                                              },
    *                                                             close: true}  
    *                                                        ] ); 
    * other options include :
    * title: 'My Modal Window' //Title of the modal window
    * open: function () { //code to run when it first opens (after the partial loads if using a partial) }
    * close: function(){ //code to run after it closes }
    * size: 'medium'  //small or large also work or override use your own width, height
    */
    jay.modal = function (options) {
        options = $.extend({
            title: 'Modal',
            size: 'medium',
            partialUrl: null,
            partialData: {},
            content: $('<div>content</div>'),
            open: function () { log('modal open action'); },
            close: function () { log('modal close action'); },
            static: false
        }, options);

        var sizeClass = '';
        if (options.size === 'large') {
            sizeClass = ' modal-lg';
        } else if (options.size === 'small') {
            sizeClass = ' modal-sm';
        } else if (options.size === 'xl') {
            sizeClass = ' modal-xl';
        }

        var $modalDialog = $('<div/>').addClass('modal-dialog' + sizeClass).attr('role', 'document');
        var $modalWrapper = $('<div/>').attr('role', 'dialog')
            .addClass('modal fade')
            .attr('tabindex', -1)
            .append($modalDialog)
            .appendTo('body');
        var $modalHeader = $('<div/>')
            .addClass('modal-header')
            .append($('<h5>').addClass('modal-title').html(options.title))
            .append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
           
        var $content = $('<div class="jayModal modal-body"></div>');

        var $modalContent = $('<div/>')
            .addClass('modal-content')
            .append($modalHeader)
            .append($content)
            .appendTo($modalDialog);

        if (options.buttons && $.isArray(options.buttons)) {
            var $modalFooter = $('<div/>').addClass('modal-footer');
            var ln = options.buttons.length; //IE SUCKS so figure out how may up front
            for (var i = 0; i < ln; i++) {
                var isLastButton = i === (ln - 1);
                var buttonClass = options.buttons[i].cssClass || (isLastButton ? 'btn-primary' : 'btn-light');


                var $button = $('<button type="button"></button>').addClass('btn').addClass(buttonClass).html(options.buttons[i].label).appendTo($modalFooter);
                if (options.buttons[i].disabled === true) {
                    $button.attr('disabled', 'disabled');
                }
                if (options.buttons[i].onClick || $.isFunction(options.buttons[i].onClick)) {
                    $button
                        .data('buttonOption', options.buttons[i])
                        .on('click', function (e) {
                            var buttonOption = $(this).data('buttonOption');
                            buttonOption.onClick.apply(this, [e, $content, $modalWrapper]);
                            if (buttonOption.close === true) {
                                $modalWrapper.modal('hide');
                            }
                        });
                } else if (options.buttons[i].close === true) {
                    $button.on('click', function () {
                        $modalWrapper.modal('hide');
                    });
                }
            }
            $modalFooter.appendTo($modalContent);
        }
        $modalWrapper.on('hidden.bs.modal', function () {
            options.close.apply($content, arguments);
            $(this).remove(); //remove me from the dom.
        });

        var modalOptions = {
            backdrop: options.static === true ? 'static' : true,
            show: true
        };

        if (options.partialUrl) {
            $content.append($('<div/>').css({ 'font-size': '200%', 'text-align': 'center' }).addInlineLoading('loading...'));
            $modalWrapper.on('shown.bs.modal', function () {
                jay.ajaxPostHtml({
                    url: options.partialUrl,
                    data: options.partialData || {}
                }).done(function (html) {
                    $content.html(html);
                    options.open.apply($content);
                }).fail(function () {
                    $content.empty().message('error', jay.failMessage);
                });
            }).modal(modalOptions);
            
        } else {
            $content
                .html(options.content.clone()[0]);
            $modalWrapper.on('shown.bs.modal', function() {
                options.open.apply($content);
            }).modal(modalOptions);
        }
    };


})(jQuery, jay);