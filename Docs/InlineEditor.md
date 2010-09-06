Class: InlineEditor {#InlineEditor}
===================================
Edit-in-Place Control

InlineEditor Method: constructor {#InlineEditor:constructor}
-------------------------------------------------------------

### Syntax:
	var e = InlineEditor(element, options);

### Arguments:

1. element - (*mixed*) an element or element id
2. options - (*object*) InlineEditor options

### Options:
* url			- (*string, optional*) url to send the save request to
* data			- (*object, optional*) extra data to send along with the save request
* empty_msg		- (*string, optional*) the message to show when the element is empty. You can use html.
* hide_buttons	- (*bool, optional*) hides the 'save' and 'cancel' buttons, use ENTER to submit, ESC to cancel.

### Events:

* onSuccess	- called after the edit is complete, argument is the new text

### Example:
	new InlineEditor(element, {url: 'save-change.php', 'id':15});
	
You can also place these attributes on the element its self, like this:
	
	<div class='editable' data-url='save-change.php'>data value</div>
	
	<!-- 
	since sending a row_id along with the data is so common, you can include it as 
	an attribute to be send as extra data. This is equivilent to using 'data: {id: 2}'
	-->
	<div class='editable' data-url='save-change.php' data-id='2'>data value</div>

	// then you could initialize all these at once like this:
	$$('.editable').each(function(item) { new InlineEditor(item); }
	