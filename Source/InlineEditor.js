/*
---
description: InlineEditor - Simple Edit-inPlace AJAX edit control

license: MIT-style

authors:
- Nathan Reed

requires:
- core/1.2.4: [Class, Event, Element, Selectors, JSON, Request]

provides: 
- InlineEditor
- $e

...
*/
var InlineEditor = new Class({
	initialize: function(elem, options) {
		// save these up here, and maybe later we can override them for
		// interationalization.
		this._save_button_msg = 'save';
		this._cancel_button_msg = 'cancel';
		this._saving_msg = 'saving...';
		this._default_error = 'Could Not Save';
		this._error_prefix = ' Error: ';
		this._empty_msg = '<i>none</i>';
		
		this.element = $(elem);
		
		// set defaults...
		this.options = options || {};
		this.options.url = this.options.url || this.element.get('data-url');
		this.options.data = this.options.data || {};
		this.options.empty_msg = this.options.empty_msg || this._empty_msg;
		this.options.onSuccess = this.options.onSuccess || $empty;
		
		if(this.element.getFirst() == null) {
			// only set the current text if there are no children
			this.current_text = this.element.innerHTML.trim();
		}
		
		this._init_element();
	},
	
	_init_element: function() {
		// apply the css class to the root element so it gets the default styles
		this.element.addClass('ine-root');
		
		// note the condition on 'text'. Show the empty message if it is empty.
		this.edit_link = $e('a', {
			'html': (this.current_text == "") ? this.options.empty_msg : this.current_text,
			'href': 'javascript:void(0)',
			'events':{'click':this.start_edit.bind(this)}
		});
		
		// we create the form inside a span because having a form straight in there
		// can cause strange things to happen...
		this.edit_form = $e('span', {
			'styles':{'display':'none'},
			'children': this._create_form()
		});
		
		this.element.empty().grab(this.edit_link).grab(this.edit_form );
	},
	
	_create_form: function() {
		return $e('form', {
			'events':{'submit': function() {this.save_edit(); return false;}.bind(this)},
			'children': [
				this.edit_input = this._create_input(),
				
				this.save_button = $e('input', {
					'type':'submit', 
					'value':this._save_button_msg
				}),
				
				this.cancel_button = $e('input', {
					'type':'button', 
					'value':this._cancel_button_msg, 
					'events':{'click':this.cancel_edit.bind(this)}
				}),
				
				this.error_span = $e('span', {'class':'ine-error'})
			]
		});
	},
	
	_create_input: function() {
		return $e('input', {'type':'text'});
	},
	
	start_edit: function() {
		this.edit_form.show();
		this.edit_link.hide();
		
		// init the edit textbox with the correct value etc
		this.edit_input.value = this.current_text;
		this.edit_input.focus();
		//this.edit_input.select();
		
		// these buttons might be in the wrong state from last time so we reset them
		this.save_button.value = this._save_button_msg;
		this.save_button.disabled = false;
		this.cancel_button.disabled = false;
		this.error_span.innerHTML = '';
		
		// TODO this is in totally the wrong place. We should call a start
		// edit event.
		if($defined(this.edit_input.selectedIndex)) {
			this.edit_input.selectedIndex= this.selectedIndex;
		}
	},
	
	cancel_edit: function() {
		this.edit_form.hide();
		this.edit_link.show();
	},
	
	save_edit: function() {
		if(!$defined(this.options.url)) {
			// no url? we just want to call the save complete method and
			// trigger the onSucess event.
			this.save_complete();
			return;
		}
		
		this.save_button.disabled = true;
		this.save_button.value = this._saving_msg;
		
		var new_value = this.edit_input.value.trim();
		
		// set up the data to send to the server.
		var request_data = $H({'value':new_value});
		request_data.combine(this.options.data);
		request_data.include('id', this.element.get('data-id')); // if 'id' already exists it will not be overwritten
			
		new Request({
			'url': this.options.url,
			onSuccess: this.save_complete.bind(this),
			onFailure: function(xhr) {
				// TODO, check the type is json
				if(xhr.getResponseHeader('content-type') == 'application/json') {
					this.save_failed(JSON.decode(xhr.responseText));
				} else {
					this.save_failed({'code':xhr.status, 'message':xhr.status + ' - ' + xhr.statusText});
				}
			}.bind(this)
		}).get(request_data);		
	},
	
	save_complete: function() {
		this.edit_form.hide();
		this.edit_link.show();
		this._set_link();
	},
	
	save_failed: function(json_response) {
		json_response = json_response || {};
		this.save_button.value = this._save_button_msg;
		this.save_button.disabled = false;
		
		// did we get an error message back from the server? no? then just use a default one
		this.error_span.innerHTML = this._error_prefix + (json_response.message || this._default_error);
	},
	
	// we use this as a function to change the current_text 
	// so that it can be overridden easily by subclasses (such as the Combo class)
	_set_link: function() {
		this.current_text = this.edit_input.value.trim();
		
		if(this.current_text == "") {
			// show the empty message, otherwise the element will be very hard to click on
			// with nothing in it
			this.edit_link.innerHTML = this.options.empty_msg;
		} else {
			this.edit_link.innerHTML = this.current_text;
		}
		
		this.options.onSuccess(this.current_text);
	}
});

//
// $e(): Use the mootools new element function to chain up element creation in a nice way
//
// eg. $e('b', 'bold text'); -> <b>bold text</b>
//     $e('a', {'href': 'http://www.google.com', 'text': 'google'}); -> <a href='http://www.google.com'>google</a>
//
// A more complex example using children:
//
//    $e('a', {
//       'href': './home',
//       'children': [
//          $e('img', {'src': './logo.png', 'title': 'popacular'}),
//          $e('span', 'popacular.com/home')
//       ]
//    });
//
// gives:
// <a href='./home'>
//    <img src='./logo.png' title='popacular' />
//    <span>popacular.com/home<span>
//  </a>
//
// Created:  2010-05-21
// License: MIT-Style License
// Nathan Reed (c) 2010
//
function $e(tag, props) {
   tag = tag || 'div';

   if(!$defined(props)) {
      return new Element(tag);
   }

   // normalize the properties element for the
   // mootools element constructor
   if($type(props) == 'string') {
      props = {'text': props};
   } else if($type(props) == 'element') {
      props = {'children': props};
   }

   // remove the children property from the array, we don't want it in there.
   // because when we pass these properties to the mootools element function it
   // might get confused.
   var children = props.children;
   props.children = null;

   var new_element = new Element(tag, props);

   if($defined(children)) {

      if($type(children) == 'element') {
         // if they have just passed through one child, then
         // normalize it by turning it into an array with one element.
         children = [children];
      }

      // add the children to the new element one by one
      children.each(function(item) {
         new_element.grab(item);
      });

   }

   return new_element
}

// this is now implemented in mootool.more (finally!)
Element.implement({
   show: function() {this.setStyle('display','');},
   hide: function() {this.setStyle('display','none');}
});
