/*
---
description: InlineEditor.Combo

license: MIT-style

authors:
- Nathan Reed

requires:
- core/1.2.4: '*'

provides: InlineEditor.Combo

...
*/
InlineEditor.Combo = new Class({
	Extends: InlineEditor,
	
	initialize: function(elem, options) {
		this.element = $(elem);
		this.options = options || {};
		this.options.options_list = this.options.options_list || this._read_options() || [];

		this.parent(this.element, this.options);
		this._set_default(this.options.options_list);
		this.edit_link.innerHTML = this.current_text;
	},
	
	// if they have specified their option list in the dom
	// then read it in and put in a standard format
	_read_options: function() {
		var options_list = [];
		var div_list = this.element.getElements('div');
		
		if(div_list == null || div_list.length == 0) {
			return;
		}
		
		div_list.each(function(item) {
			// the attributes here will be passed straight to the create element
			// function, so they must be valud html attrs.
			var new_item = {'value':item.get('data-value'), 'text':item.innerHTML};
			
			// is this the default item? do some special things in that case
			if(item.get('data-selected') == 'true') {
				new_item.selected = true;
			}
			
			options_list.push(new_item);
		}.bind(this));
		
		return options_list;
	},
	
	_set_default: function(options_list) {
		var has_default = false;
		
		// scan through the list, set the current test, and select the
		// default item. if no default is specified then select the top 
		// item.
		for(var i=0; i < options_list.length; i++) {
			if(options_list[i].selected == true) {
				this.current_text = options_list[i].text;
				has_default = true;
				break;
			}
		}
		
		if(has_default == false && options_list.length > 0) {
			this.current_text = options_list[0].text;
		}
	},
	
	_create_input: function() {
		// conver the options list too a bunch of proper options elements
		var option_elems = [];
		this.options.options_list.each(function(item) {
			option_elems.push($e('option', item));
		});
		
		return $e('select', {'children': option_elems});
	},
	
	_set_link: function() {
		this.current_text = this.edit_input.options[this.edit_input.selectedIndex].text;;
		this.edit_link.innerHTML = this.current_text;
	}
});
