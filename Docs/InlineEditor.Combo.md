Class: InlineEditor.Combo {#InlineEditor}
===================================
Edit-in-Place Control with a Dropdown List

InlineEditor Method: constructor {#InlineEditor:constructor}
-------------------------------------------------------------

### Syntax:
	var e = InlineEditor.Combo(element, options);

### Arguments:

1. element - (*mixed*) an element or element id
2. options - (*object*) InlineEditor options

### Options:
* url			- (*string*) url to send the save request to
* data			- (*object, optional*) extra data to send along with the save request
* empty_msg		- (*string, optional*) the message to show when the element is empty. You can use html.
* hide_buttons	- (*bool, optional*) hides the 'save' and 'cancel' buttons, use ENTER to submit, ESC to cancel.
* options_list	- (*array, optional*) an array of objects in the form {'value':1, 'text':'one'}. These will be the options in the Dropdown

### Events:

* onSuccess	- called after the edit is complete, 1st argument is the new text and the second is the new value

### Example:
	new InlineEditor.Combo(element, {
		url: 'save-edit.php',
		options_list: [
			{'text':'one', 'value':'1'},
			{'text':'two', 'value':'2'},
			{'text':'three', 'value':'3', 'selected':true}
		]
	});

Like the regular inline editor, you can also apply these options in the DOM. The HTML below is equivilent to the above code:
		
	<div id='editable-combo' data-url='save-edit.php' data-id='12'>
		<div data-value='1'>One</div>
		<div data-value='2'>Two</div>
		<div data-value='3' data-selected='true'>Three</div>
	</div>
	
	// then make it editable like this:
	InlineEditor.Combo('editable-combo');