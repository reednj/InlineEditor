/*
---
description: InlineEditor - Simple Edit-inPlace AJAX edit control

license: MIT-style

authors:
- Nathan Reed

requires:
- core/1.2.4: '*'

provides: InlineEditor

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
		
		this.edit_form = $e('span', {
			'styles':{'display':'none'},
			'children': this._create_form()
		});
		
		this.element.empty().grab(this.edit_link).grab(this.edit_form );
	},
	
	_create_form: function() {
		return $e('form', {
			'onsubmit': 'return false;',
			'children': [
				this.edit_input = this._create_input(),
				
				this.save_button = $e('input', {
					'type':'submit', 
					'value':this._save_button_msg, 
					'events':{'click':this.save_edit.bind(this)}
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
	},
	
	cancel_edit: function() {
		this.edit_form.hide();
		this.edit_link.show();
	},
	
	save_edit: function() {
		if(!$defined(this.options.url)) {
			alert('cannot save: no url defined');
			return;
		}
		
		this.save_button.disabled = true;
		this.save_button.value = this._saving_msg;
		
		var new_value = this.edit_input.value.trim();
		//var request_data = (this.options.id)? {'value':new_value, 'id': this.options.id} : {'value':new_value};
		var request_data = $H({'value':new_value});
		request_data.combine(this.options.data);
		request_data.include('id', this.element.get('data-id')); // if 'id' already exists it will not be overwritten
			
		new Request.JSON({
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
	
	save_complete: function(json_response) {
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
		
	}
});

