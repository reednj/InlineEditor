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
		this.element = $(elem);
		
		// set defaults...
		this.options = options || {};
		this.options.save_text = this.options.save_text || 'save';
		this.options.url = this.options.url || this.element.get('data-url');
		this.options.id = this.options.id || this.element.get('data-id');
		
		if(this.element.getFirst() == null) {
			this.current_text = this.element.innerHTML; //todo: check that it is a textnode only?
		}
		
		this._init_element();
		
	},
	
	_init_element: function() {
		// apply the css class to the root element so it gets the default styles
		this.element.addClass('ine-root');
		
		// we create all the dom needed to make it editable and place it inside the current
		// element
		this.edit_link = $e('a', {
			'text': this.current_text,
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
					'value':'save', 
					'events':{'click':this.save_edit.bind(this)}
				}),
				
				this.cancel_button = $e('input', {
					'type':'button', 
					'value':'cancel', 
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
		this.save_button.value = this.options.save_text;
		this.save_button.disabled = false;
		this.cancel_button.disabled = false;
		this.error_span.innerHTML = "";
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
		this.save_button.value = 'saving...';
		
		var new_value = this.edit_input.value.trim();
		var request_data = (this.options.id)? {'value':new_value, 'id': this.options.id} : {'value':new_value};
		
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
		
		this.current_text = this.edit_input.value;
		this._set_link();
	},
	
	save_failed: function(json_response) {
		json_response = json_response || {};
		this.save_button.value = this.options.save_text;
		this.save_button.disabled = false;
		
		// did we get an error message back from the server? no? then just use a default one
		this.error_span.innerHTML = ' Error: ' + (json_response.message || 'Could Not Save');
	},
	
	// we use this as a function so that it can be overridden easily by subclasses
	_set_link: function() {
		this.current_text = this.edit_input.value;
		this.edit_link.innerHTML = this.current_text;
	}
});

