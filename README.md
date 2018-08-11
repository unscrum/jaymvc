# jayMVC
javascript and dotnetcore mvc 2.1 hybrid framework

## Not included
Many of the plugins require Font Awesome 4.7 icons, but it is not bundled with jayMVC.  Insead use a CDN like:

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">


## Included
a single download file of jaymvc.js or jaymvc.min.js includes the following open source and custom libraries
* jQuery 3.2.1
* popper 1.12.9
* bootstrap 4.1.1
* jQuery UI 1.12.1 (a subset that works well with bootstrap)
  * widget.js,
  * position.js
  * data.js
  * disable-selection.js
  * scroll-parent.js
  * unique-id.js
  * draggable.js
  * droppable.js
  * resizable.js
  * selectable.js
  * sortable.js
  * mouse.js
* jQuery UI Touchpunch - enables touch for jQuery UI
* (_) Underscore.js 1.8.3
* Lockr
* Moment.js 2.20.1
* Custom jQuery / Bootstrap plugins
  * jayOnAction
  * jayOnData
  * jayLoading
  * jayAjax
  * jayMessage
  * jayOnVisible
  * jayModal
  * jayDataFilter
  * bootstrap 4 datetimepicker
  * bootstrap 4 multiselect
  * bootstrap 4 Typeahead

## jayOnAction

This is the main event handling pattern for the site. All event handling is processed through event delegation with the following pattern. Event handlers are defined but not bound to individual elements (decoupled) by calling

    $.onAction('someAction', function(e, data) { ... });

Elements are then tagged for specific events by adding a css class that starts with action- followed by the action name, so in the example above, the associated action would be

     class="action-some-action"

HTML5 data attributes as well as jQuery.data() is also parsed and passed into the function.  

Given:

    <div class="action-some-action" data-url="/Some/Url" data-more-info="true">...</div>

And:

    $.onAction('someAction',
      function(e, data){
        // e is the original jQuery event
        // data.url is equal to /Some/Url
        // data.moreInfo is equal to true
      });


Multiple action handlers may be
registered for a single action. If only one action handler should be registered at a give time, you may setup that action by using
    $.singleOnAction(...)

which will remove any existing action handlers for that action. This is useful if a script is loaded or included multiple times on a page.

## jayOnData
This give a way to register and trigger events in the DOM by using names instead of element selectors. It helps decouple the intent of the event from DOM element that is affected.

In this example we have an empty span with a class 'page-number' somewhere in the page that will respond to a 'setPageNumber' event when triggered.  This would also work with 2 or more spans all with the class 'page-number'

    $.onDataEvent('setPageNumber' //Event Name
      'span.page-number', //Bound to a DOM Element
      function(t){ //callback to execute when triggered.
          $(this).html(t);
        });

Later in client side that can be triggered the following ways:

    $.triggerDataEvent('setPageNumber', 2);

or by passing in an object to trigger multiple events.

    $.triggerDataEvent({
        setPageNumber: 2,
        someOtherEvent: 'foo'
      });

Optionally events can be bound to the $(document) itself by:

    $.onData('eventName', function(){...//Callback});

## jayLoading
This plugin extends jQuery to show loading icons either inside a container or covering one.  
** Requires FontAwesome **

Empty an element and add a loading spinner and optional text

    $(this).addInlineLoading('loading, please wait...');

Cover a DOM element completely by an opaque *div* with optional sizes of loading spinners.  It is resized to cover when the browser scrolls or is resized. Optional sizes are *sm, md, lg* and  *xl* (defaults to *lg*)

    $(this).showContentLoading('xl');

Hide it later in the code (perhaps after an AJAX complete)

    $(this).hideContentLoading();

Optionally hide all *loading* panes

    $.hideAllContentLoading(); //hide all content loading panes

## jayAjax
This is the main AJAX handling component for the entire site. It wraps all AJAX calls to and from the server expecting a common envelope format that it unpacks and passes back the enclosed data.  

It expects a backend envelope. See a C# example  [JsonEnvelope](/unscrum/jaymvc/blob/master/src/jaymvc/Framework/JsonEnvelope.cs)

Make an AJAX call expecting *JSON* back doing a *POST*. It automatically handles Forbidden and Unauthorized, but delegates out 3 callbacks.

    jay.ajax({
      url: '/some/url',
      data: {
        foo: 'bar'
      }
    }).done(function(obj){
      //the url returned an envelope with success
    }).error(function(objOrMsg){
      //the url returned an envelope with errors     
    }).fail(function(){
      // the url responded with a non success code (500 or other error status code)
    });

Make an AJAX call doing a *POST* to get an *HTML* snippet back. It automatically handles Forbidden and Unauthorized, but delegates out 2 callbacks.

    jay.ajaxPostHtml({
      url: '/some/url',
      data: {
        foo: 'bar'
      }
    }).done(function(html){
      //the url returned an html snippet
    }).fail(function(){
      // the url responded with a non success code (500 or other error status code)
    });

Make an AJAX call doing a *POST* to get an *HTML* snippet back and automatically *load* it into the DOM element passed in. It automatically handles Forbidden and Unauthorized, but delegates out a single callback for success.

    $(this).jayLoad('/some/url',{
        foo: 'bar'
      }, function(html){
        //the url returned an html snippet
      });

## jayMessage
This is a responsive way to add bootstrap alerts into the DOM, prepended to the element passed in.  Alert messages disappear when clicked and optionally can disappear after a set timeout.  

** Requires FontAwesome **

Show a success alert for 1.5 seconds and then slide it up.

      $(this).message('success', 'Saved Successfully', 1500);

Optional types are
  * success
  * error
  * warning
  * info
  * loading

Remove the all messages from the DOM element.

    $(this).messageRemove();

## jayOnVisible
Extends the jayOnAction plugin above by triggering an action as soon as the element containing an "on-visible" class is added to the DOM.

Assuming we have already loaded the action handlers:

    $.onAction('doSomething', function(e, data){...});
    $.onAction('doSomethingElse', function(e, data){...});

When an HTML Snippet like below is added into the document:

    <div class="on-visible" data-visibility-action="doSomething">...</div>
    <div class="on-visible" data-visibility-action="doSomethingElse">...</div>

Then both *jayOnAction* handlers above will be triggered.

## jayModal
Extends jayAjax and jayLoading to responsively load, add and remove HTML Snippets to the DOM as Bootstrap Modals.

This example will post the *partialData* to */Some/Url* and open a modal, then load the AJAX response into the model content area.

    jay.modal({
        partialUrl: '/Some/Url',
        partialData: {
          foo:true
        },
        open: function(){...//optionally called after the content is successfully loaded}
        close: function(){...//optionally called before removing from the DOM, (clean up plugins)}
        title: 'Modal Title Here',
        size: 'large' //supports 'small', 'medium', 'large', or 'xl'
      });

Optionally you can use content from the DOM or created in jQuery;

    jay.modal({
        title: 'Modal Title',
        size: 'small',
        content: $('<div/>').html('Some Text...')
      });  

Buttons can also be added, and support cssClass, label, close: true/false and and optional onClick.  

Here is an example of a jayOnAction with  jayModal that confirms a delete before deleting via jayAjax.

    $.onAction('delete',
      function(e, data){
        jay.modal({
          content: $('<div/>').html('Are you sure you want to delete...')
          title: 'Confirm Delete',
          size: 'small',
          buttons: [
            {
                label: 'No, Cancel',
                close: true
            },
            {
              label: 'Yes, Delete',
              cssClass: 'btn-danger',
              onClick: function(e, $contentArea, $modalWrapper){
                // e is the original jQuery event
                // $contentArea is just the modals content area, (not the header or button footer)
                // $modalWrapper is a handle to the entire Bootstrap modal

                $contentArea.messageRemove(); //remove any lingering messages
                $modalWrapper.showContentLoading();  //show a loading pane over the modal window
                jay.ajax({ //make the AJAX delete call
                  url: data.deleteUrl
                }).done(function(){ //success
                  $modalWrapper
                    .hideContentLoading()
                    .modal('hide'); //hide and remove from DOM
                }).error(function(msg){ // jsonEnvelope error
                    $modalWrapper.hideContentLoading();
                    $contentArea.message('error', msg);
                }).fail(function(){ // bad status code
                    $modalWrapper.hideContentLoading();
                    $contentArea.message('error', jay.failMessage);
                });
              }
            }
          ]
        });
      });

A simple jayAlert can be called as well, which wraps jayModal with a *small* modal window with *message*, close button and optional *title* (default title is 'Alert')

    jay.alert('message');

    jay.alert('title','message');

## Putting it all together
Take a look at the sample MVC site that includes some plugins written on the jayMVC framework.  The site will allow you to add, edit and delete ToDo items.  It also illustrates the Bootstrap 4 Typeahead and Bootsrap 4 DateTime Picker.
