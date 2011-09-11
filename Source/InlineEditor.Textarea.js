/*
---
description: InlineEditor.Textarea - Simple Edit-inPlace AJAX dropdown list control

license: MIT-style

authors:
- Nathan Reed

requires:
- core/1.2.4: [Class, Event, Element, Selectors, JSON, Request]
- /InlineEditor

provides: InlineEditor.Textarea

...
*/
InlineEditor.Textarea = new Class({
	Extends: InlineEditor,

	initialize: function(elem, options) {
		this.element = $(elem);
		this.options = options || {};

		this.parent(this.element, this.options);
		this.edit_link.innerHTML = this.current_text;
	},

	_create_form: function() {
		return $e('form', {
			'events':{'submit': function() {this.save_edit(); return false;}.bind(this)},
			'children': [
				$e('div', {'children': [
					this.edit_input = this._create_input()
				]}),

				$e('div', {'children': [

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
				]})
			]
		});
	},

	_create_input: function() {
		return $e('textarea', {
			'events': {
				'keydown': function(e) {
					// detect the escape key, and use it to cancel the edit
					if(e.key == 'esc') {
						this.cancel_edit();
					}
				}.bind(this),
				'blur': function(e) {
					// when in hide_buttons mode, we want to automatically cancel
					// if the user clicks off the control.
					if(this.options.hide_buttons){
						this.cancel_edit();
					}
				}.bind(this)
			}
		});
	}


});
