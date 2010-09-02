InlineEditor
============

InlineEditor allows any text element to be made editable. The user clicks on it, and it turns into a textbox with
a save and cancel button. On save a request is send to the server with the new value, and any other needed metadata.

![ScreenShot](http://imgur.com/ZGoDz.png)

How to use
----------

Include the InlineEditor.js and InlineEditor.css (and InlineEditor.Combo.js if you need drop down lists) in the header:
	
	<link rel="stylesheet" href="InlineEditor.css" type="text/css">
	<script type='text/javascript' src='InlineEditor.js'></script>

Make elements editable like this:
	
	new InlineEditor(element, {url: 'save-change.php'});

When the editbox is saved a GET request will be made to that url with the new data.

Maybe you need to send some meta-data such as a row_id along with the request. Use the 'id' option:
	
	new InlineEditor(element, {url: 'save-change.php', 'id':15});
	
You can also place these attributes on the element its self, like this:
	
	<div class='editable' data-url='save-change.php' data-id='1'>data value</div>
	<div class='editable' data-url='save-change.php' data-id='2'>data value</div>

	// then you could initialize all these at once like this:
	$$('.editable').each(function(item) { new InlineEditor(item); }
	
Drop Down Lists
---------------

Use InlineEditor.Combo.js to let the user set input from a drop down list, instead of with a textbox

These are created in the same way as regular InlineEditors but have more settings to deal with setting the list of 
options in the dropdown.

This can be done in the javascript constructor:
	
	new InlineEditor.Combo(element, {
		url: 'save-edit.php',
		id: '12',
		options_list: [
			{'text':'one', 'value':'1'},
			{'text':'two', 'value':'2'},
			{'text':'three', 'value':'3', 'selected':true}
		]
	});

or in the dom:
	
	<div class='editable-combo' data-url='save-edit.php' data-id='12'>
		<div data-value='1'>One</div>
		<div data-value='2'>Two</div>
		<div data-value='3' data-selected='true'>Three</div>
	</div>