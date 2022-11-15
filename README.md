# jayMVC
javascript and dotnetcore mvc 6.0 hybrid framework

## Why another MVC framework?
My goal is to let server side MVC do its job, yet still have a responsive, sexy UI. It seems in frameworks like angular, if you are a FullStack developer you spend time in dotnet making Controllers with injected Services that return Models and then in JS you make more Controllers, that inject Services to call the dotnet Controllers and then create Templates in javascript to draw the Model that was created in C#. But sometimes you use Razor Views to launch SPAs.  Are you dizzy yet?.

What I don't like about pure jQuery or jQuery UI is that everything is bound to a DOM element by ID or class, and if a designer goes in and changes a class, it could break the whole application.

The goal here is to decouple jQuery from the DOM and instead create functions and events by **NAME** and in turn call or trigger them by **NAME** and when absolutely necessary to tie to DOM Element have a single way to bind the **NAME** to a DOM element in one place, so if a designer goes in, and changes a class, it can be fixed in one place, not several $("foo.someclassthatchanged") all over the JS application.


Also I believe in having minimal amounts of javascript, that can be templated and driven by the DOM.  Check out the MVC sample application [plugins](https://github.com/unscrum/jaymvc/tree/master/src/jaymvc/wwwroot/js/Views).  The plugins for the sample application like delete, edit, load, scrollTo, and wireUpTypeAhead, may be all you need for an entire application, because they take HTML5 Data attributes as input.  For example you could use the delete plugin to delete rows out of a table, but it could be a table of **Cars** or another table of **Trucks** or another table of **People**.

the DOM might pass in different titles, messages, urls and button labels but effectively the JS is the same.

The buttons below would be in 3 tables with a class of *cars*, *trucks* and *people* respectively, and could all be serviced by [wwwroot/js/Views/delete.js](https://raw.githubusercontent.com/unscrum/jaymvc/master/src/jaymvc/wwwroot/js/Views/delete.js)

    <button class="btn btn-link action-delete" data-title="Delete Car" data-message="Are you sure you want to delete this car?" data-url="/cars/delete/1" data-target="table.cars" ><i class=fa fa-trash-o"></i></button>

    ...

    <button class="btn btn-link action-delete" data-title="Delete Truck" data-message="Are you sure you want to delete this truck?" data-url="/trucks/delete/13" data-target="table.trucks" ><i class=fa fa-trash-o"></i></button>


    ...

    <button class="btn btn-link action-delete" data-title="Delete Person" data-message="Are you sure you want to delete this person?" data-url="/people/delete/12" data-target="table.people"><i class=fa fa-trash-o"></i></button>



## Whats not included?
Many of the plugins require Font Awesome 4.7 icons, but it is not bundled with jayMVC.  Instead use a CDN like:

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">


## Whats included?
A single download file of jaymvc.js or jaymvc.min.js includes the following open source and custom libraries.
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
* Underscore.js 1.8.3
* Lockr
* Moment.js 2.29.4
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

It expects a backend envelope. See a C# example  [JsonEnvelope](https://raw.githubusercontent.com/unscrum/jaymvc/master/src/jaymvc/Framework/JsonEnvelope.cs)

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
Lets say that you have a task to design a dashboard with several graphs and widgets.  Perhaps  the *Graphs* have JSON POSTs (JsonResult), and of the *Widgets* have HTML Snippet POSTS (PartialViewResult). All stitched together by a *Main Page* GET (ViewResult).  You might consider using jayOnVisible and jayOnAction to create a load scenario.

First lets write a jayAction handler to handle loading the Widgets:

    $.onAction('loadWidget', //name it something meaningful
      function(evt, data) {
        var $t = $(this);
        if ($t.isEmpty()){
            $t.addInlineLoading('<strong>Loading...<strong>');
        } else{
            $t.showContentLoading();
        }

        jay.ajaxPostHtml({
            url: data.url,
            data: data.postData || {}
        }).fail(function() {
            $t.empty().message('error', jay.failMessage);
        }).done(function(html) {
            var $html = $(html);
            $.triggerDataEvent($html.data());
            $t.html($html).hideContentLoading();
        });

And one to handle the JSON data for graphs.

    $.onAction('loadGraph', //name it something meaningful
      function(evt, data) {
        var $t = $(this);
        if ($t.isEmpty()){
            $t.addInlineLoading('<strong>Loading...<strong>');
        } else{
            $t.showContentLoading();
        }

        jay.ajax({
            url: data.url,
            data: data.postData || {}
        }).fail(function() {
            $t.empty().message('error', jay.failMessage);
        }).error(function() {
            $t.empty().message('error', jay.failMessage);
        }).done(function(json) {
            $t.empty().highcharts(json);  // Need to add the highcharts plugin
        });

Then in your *Main Page* you could use bootstrap to layout a responsive grid:

    <div class="row">
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadGraph" data-url="@Url.GraphOne()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadWidget" data-url="@Url.WidgetOne()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadGraph" data-url="@Url.GraphTwo()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadWidget" data-url="@Url.WidgetTwo()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadGraph" data-url="@Url.GraphThree()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadWidget" data-url="@Url.WidgetThree()"></div>
    </div>

So you see the *Main Page* drives the rest of its content.  The URLs could be on different controllers or the same controller with different actions, with the only rule that the *Graph* URLS return the JSON data to build the highcharts graph, and the *Widget* URLS return HTML snippets.

How does it work?  the jayOnVisible will call the data-visibility-action and then remove the on-action class.  If the on-action class gets added again it will simply call the action again. But in the actions above we added indicators that that section was loading.

Now lets say when you click on the div containing a *WidgetOne* or *GraphOne* you also want do do a modal popup to ask for extra data (like a time range). Assume that the Controller Action on the back end takes in an optional date range.

Lets add one more jayAction to handle the click.

    $.onAction('popupEditCriteria',  //name it something meaningful
      function(e, data){
        var $widgetDiv = $(this);
        jay.modal({
          partialUrl: data.editCriteriaUrl,
          partialData: data.postData || {}
          size: 'small',
          title: 'Change date range',
          buttons: [
            {
              label: 'Cancel',
              close: true
            },{
              label: 'Change',
              onClick: function(e, $content){
                $widgetDiv
                  .data('postData', $content.getInputValues() ) //set some data to post upon redraw
                  .addClass('on-visible'); // do redraw
              }
            }
          ]
        });
      });

And lets change the markup for *WidgetOne* and *GraphOne*.

    <div class="row">
      <div class="col-12 col-md-6 col-xl-4 on-visible action-popup-edit-criteria" data-visibility-action="loadGraph" data-url="@Url.GraphOne()" data-edit-criteria-url="@Url.DateRangePopup()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible action-popup-edit-criteria" data-visibility-action="loadWidget" data-url="@Url.WidgetOne()" data-edit-criteria-url="@Url.DateRangePopup()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadGraph" data-url="@Url.GraphTwo()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadWidget" data-url="@Url.WidgetTwo()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadGraph" data-url="@Url.GraphThree()"></div>
      <div class="col-12 col-md-6 col-xl-4 on-visible" data-visibility-action="loadWidget" data-url="@Url.WidgetThree()"></div>
    </div>

How does it work?  the jayOnVisible will call the *data-visibility-action* and then remove the on-action class.  When the *on-action* class gets added again it will simply call the action again. The *popupEditCriteria* action is actually just adding the form's input data to the div via jQuery's *.data()* with the name *postData*.  In the two load actions the *postData* is passed into the jayAjaxCall.  All that remains is to add a simple bootstrap PartialViewResult that asks for a data range.

## More Demos
Take a look at the sample MVC site that includes some plugins written on the jayMVC framework.  The site will allow you to add, edit and delete ToDo items.  It also illustrates the Bootstrap 4 Typeahead and Bootstrap 4 DateTime Picker.
