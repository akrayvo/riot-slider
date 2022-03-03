# riot-slider

[View on Github »](https://github.com/akrayvo/riot-slider)

A simple, easy to impletment, jQuery image slider

## Requirements

- jQuery >= 3.1
- Material Icons (optional)

## Installation

Add **riot-slider.js** and **riot-slider.css** files to your project.

## Basic Example


```
<link rel="stylesheet" href="./riot-slider.css">
```
```
<div id="slider1" class="riot-slider">
    <ul>
        <li><img src="https://yoursite.com/images/slide1.jpg" /></li>
        <li><img src="https://www.mastergorilla.com/images/yit_phil_elliot.jpg" /></li>
        
        <li><img src="https://riotontheset.com/images/screens/episode-8-britney-blake-alex-tim.jpg" alt="Alt Text" /></li>
        <li><div><b>text here</b><p>More Text</p></div></li>
    </ul>
</div>
```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> 
<script src="./riot-slider.js"></script>
<script>
$( document ).ready(function() {
    let slider1 = new RiotSlider();
    slider1.load('slider1');
});</script>
```

Generated HTML

```
<form action="/yourPage.php" method="post">
    <div>Name</div>
    <input type="text" name="name" value=""><br><br>

    <div>Favorite Color</div>
    <select name="colors"><option value="">- select a color -</option><option value="blue">Blue</option><option value="green">Green</option><option value="lightBlue">Light Blue</option><option value="red">Red</option></select><br><br>

    <div>Comments</div>
    <textarea name="comments"></textarea><br><br>

    <input type="submit" name="submit" value="Save Info">
</form>
```

## Settings

### private $doAddIdAttributeFromName = false;

- automatically add an `id` attribute with the same value as `name`
- does not affect radio inputs because they can have multiple elements with the same `name`
- if set to false, `id` can be by added with the `$moreAttributes` parameter
- if set to true, `id` can be by overridden with the `$moreAttributes` parameter

```
$form->setDoAddIdAttributeFromName(false);
$form->text('first_name');
// <input type="text" name="first_name" value="">

$form->setDoAddIdAttributeFromName(true);
$form->text('first_name');
// <input type="text" name="first_name" value="" id="first_name">
```

### private $doReturnHtml = false;

- return the HTML elements as a string
- if not set, output is written to the screen

```
$form->setDoReturnHtml(false);
$form->text('first_name');
// <input type="text" name="first_name" value="">

$form->setDoReturnHtml(true);
$html = $form->text('first_name');
// (outputs nothing)
echo $html;
// <input type="text" name="first_name" value="">
```

### private $isXhtml = false;

- close tag elements, ex: `<input type="input" name="name"> vs <input type="input" name="name" />`
- boolean attributes will have values, ex: `<option value="1" selected="selected">` vs. `<option value="1" selected>`

```
$form->setIsXhtml(false);
$form->text('first_name', '', '[readonly]');
// <input type="text" name="first_name" value="" readonly>

$form->setIsXhtml(true);
$form->text('first_name', '', '[readonly]');
// <input type="text" name="first_name" value="" readonly="readonly" />
```

### private $doPassedStringCleanup = true;

- string cleanup of passed variables
- removes HTML tags
- used in `getPost()`, `getGet()`, and `getPassed()` functions

```
// passed from form: $first_name = "<b>Joe</b>"

$form->setDoPassedStringCleanup(true);
$first_name = $form->getPassed('first_name');
$form->text('first_name', $first_name);
// <input type="text" name="first_name" value="Joe">

$form->setDoPassedStringCleanup(false);
$first_name = $form->getPassed('first_name');
$form->text('first_name', $first_name);
// (note that the value is HTML encoded)
// <input type="text" name="first_name" value="&lt;b&gt;Joe&lt;/b&gt;">
```

### private $doSelectOptionValueEqualsText = false;

- if set, `select` `option` `value` and display text will both be set to the options array item value, so `[2=>'a', => 3=>'b']` will output `<option value="a">a</option><option value="b">b</option>`
- if NOT set, `select` `option` `value` will be the array key and the display text will be the array value, so `[2=>'a', => 3=>'b']` will output `<option value="2">a</option><option value="3">b</option>`

```
$options = ['NY'=>'New York', 'OH'=>'Ohio'];

$form->setDoSelectOptionValueEqualsText(false);
$form->select('state', $options);
// <select name="state"><option value="NY">New York</option><option value="OH">Ohio</option></select>

$form->setDoSelectOptionValueEqualsText(true);
$form->select('state', $options);
// <select name="state"><option value="New York">New York</option><option value="Ohio">Ohio</option></select>
```

## Using form tag attributes

All form element functions include a `$moreAttributes` paramter. It takes an array of attributes with the $key as the attribute name and the value being the value.

If the key is numeric, it will be handled as a boolean attribute (with no value such as `readonly`, `disabled`, `checked`, etc.).

Common attributes would include `id`, `class`, `style`, `placeholder`, etc.

```
$moreAttributes = ['style'=>'padding:20px;', 'placeholder'=>'Name', 'readonly'];
$form->text('name', '', $moreAttributes);
```

HTML output

```
<input type="text" name="name" value="" style="padding:20px" placeholder="Name" readonly>
```

## Functions

### Settings

- `setDoAddIdAttributeFromName($value)` - set $doAddIdAttributeFromName
- `setDoReturnHtml($value)` - set $doReturnHtml
- `setIsXhtml($value)` - set $isXhtml
- `setDoPassedStringCleanup($value)` - set $doPassedStringCleanup
- `setDoSelectOptionValueEqualsText($value)` - set $doSelectOptionValueEqualsText

### String Manipulation

- `htmlEscape($string)` - escape a string to display in HTML
- `stringCleanup($string)` - strips HTML tags from a string

### Get Passed Data

- `getPassed($var, $returnOnfail = '')` - retrive a value from $\_GET or $\_POST
- `getPost($var, $returnOnfail = '')` - retrive a value from $\_POST
- `getGet($var, $returnOnfail = '')` - retrive a value from $\_GET

### Input elements &lt;input&gt;

- `hidden($name, $value = '', $moreAttributes = [])` - `<input type="hidden">`
- `text($name, $value = '', $moreAttributes = [])` - `<input type="text">`
- `color($name, $value = '', $moreAttributes = [])` - `<input type="color">`
- `number($name, $value = '', $moreAttributes = [])` - `<input type="number">`
- `range($name, $min, $max, $value = '', $moreAttributes = [])` - `<input type="range">`
- `email($name, $value = '', $moreAttributes = [])` - `<input type="email">`
- `tel($name, $value = '', $moreAttributes = [])` - `<input type="tel">`
- `date($name, $value = '', $moreAttributes = [])` - `<input type="date">`
- `password($name, $moreAttributes = [])` - `<input type="password">`
- `checkbox($name, $isChecked = false, $value = 1, $moreAttributes = [])` - `<input type="checkbox">`
- `radio($name, $value, $selectedValue = '', $moreAttributes = [])` - `<input type="radio">`
- `submit($value = '', $name = '', $moreAttributes = [])` - `<input type="submit">`
- `reset($value = '', $name = '', $moreAttributes = [])` - `<input type="reset">`

### Other form elements

- `formStart($action = '', $method = '', $moreAttributes = array())` - `<form>`
- `formEnd()` - `</form>`
- `textarea($name, $value = '', $moreAttributes = [])` - `<textarea>`
- `button($html = 'Submit', $moreAttributes = [])` - `<button>`
- `select($name, $options, $value = null, $moreAttributes = [])` - `<select><option>`
- `selectByRecordSet($name, $records, $valueKey, $displayKey, $emptyText = '', $value = null, $moreAttributes = [])` - `<select><option>`
