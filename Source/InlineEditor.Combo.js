/*
---
description: InlineEditor.Combo - Simple Edit-inPlace AJAX dropdown list control

license: MIT-style

authors:
- Nathan Reed

requires:
- core/1.2.4: [Class, Event, Element, Selectors, JSON, Request]
- /InlineEditor

provides: InlineEditor.Combo

...
*/
InlineEditor.Combo = new Class({
	Extends: InlineEditor,

	initialize: function(elem, options) {
		this.element = $(elem);
		this.options = options || {};
		this.options.options_list = this.options.options_list || this._read_options() || [];
		this.options.selected = this.options.selected || this.element.get('data-selected');

		this.parent(this.element, this.options);

		this.selectedIndex = this._set_default(this.options.options_list);
		this.edit_link.innerHTML = this.current_text;
	},

	_selection_changed: function() {

		if(this.options.hide_buttons) {
			// if the buttons are hidden, then we just submit straight away, no
			// waiting for the user to press enter
			this.save_edit();
		}
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
		var selectedIndex = -1;

		// has the user set the selected item on the root node itself?
		if(this.options.selected != undefined) {
			this.edit_input.value = this.options.selected;
			this.current_text = this.edit_input.options[this.edit_input.selectedIndex].text;
			return this.edit_input.selectedIndex;
		}

		// scan through the list, set the current_text, and select the
		// default item. if no default is specified then select the top
		// item.
		for(var i=0; i < options_list.length; i++) {
			if(options_list[i].selected == true) {
				this.current_text = options_list[i].text;
				has_default = true;
				selectedIndex = i;
				break;
			}
		}

		if(has_default == false && options_list.length > 0) {
			this.current_text = options_list[0].text;
			selectedIndex = 0;
		}

		return selectedIndex;
	},

	_create_input: function() {
		// conver the options list too a bunch of proper options elements
		var option_elems = [];
		this.options.options_list.each(function(item) {
			option_elems.push($e('option', item));
		});

		return $e('select', {
			'children': option_elems,
			'events': {
				'keydown': function(e) {
					// detect the escape key, and use it to cancel the edit
					// this event code is duplicated between ie & ie.combo.
					// it should really be moved somewhere common...
					if(e.key == 'esc') {
						this.cancel_edit();
					} else if(e.key == 'enter') {
						// we have to capture this for the select box
						// for some reason the form does not detect it properly
						this.save_edit();
					}
				}.bind(this),
				'change': this._selection_changed.bind(this),
				'blur': function(e) {
					// when in hide_buttons mode, we want to automatically cancel
					// if the user clicks off the control.
					if(this.options.hide_buttons){
						this.cancel_edit();
					}
				}.bind(this)
			}});
	},

	_set_link: function() {
		this.selectedIndex = this.edit_input.selectedIndex;
		this.current_text = this.edit_input.options[this.selectedIndex].text;
		this.edit_link.innerHTML = this.current_text;

		this.options.onSuccess(this.current_text, this.edit_input.value);
	}
});
