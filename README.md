# riot-slider

[View on Github »](https://github.com/akrayvo/riot-slider)

A simple, easy to impletment, jQuery image slider

## Working example

The Riot Slider was created for (and named after) this website. The newest version is on the homepage.
[Riot On The Set web series](https://riotontheset.com/)


## Requirements

- jQuery >= 3.1

## Installation

Add **riot-slider.min.css** and **riot-slider.min.js** files to your project.

## Basic Example
- include the css file, **riot-slider.min.css** or **riot-slider.css**.
- in HTML, add an unordered list (ul) with a class of **riot-slider**
- add list items (li). each item is a slide. Images, text, or any other html can be added to each line item.
- include the js file, **riot-slider.min.js** or **riot-slider.js**.

```
<link rel="stylesheet" href="./riot-slider.min.css" />
```

```
<ul class="riot-slider">
    <li><img src="./images/blue-jay.jpg" /></li>
    <li><img src="./images/squirrel.jpg" /></li>
    <li><img src="./images/port-au-prince-haiti.jpg" /></li>
    <li><img src="./images/pennsylvania-landscape.jpg" /></li>
    <li>
        <p><b>Text Slide Here</b></p>
        <p>More text here!</p>
    </li>
</ul>
```

```
<script src="./riot-slider.min.js"></script>
```

## Optional css and js

jQuery, jQuery mobile, and Material Icons will automatically be added if they are needed and not already available. If they are needed, it may be more efficient to include them before including `riot-slider.min.js`

```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://code.jquery.com/mobile/1.5.0-rc1/jquery.mobile-1.5.0-rc1.min.js"></script>
```

## Slider Customizations

The slider is set up by adding an undered list (ul). Data attributes can be added to customize the format and functionalty of the slider.

# ul example

The following code will display the slider with a dark background and each slide will display for 3 seconds when the slider is playing.

```
<ul class="riot-slider" data-slide-hold-seconds="3" data-theme="dark">
```

# data-do-console-log = true/false

- if set, information will be added to the console log
- generally only needed for testing/development
- default = false

# data-use-material-icons = true/false

- if set, material icons will display for play, stop, previous, and next buttons
- if unavailable, they will automatically be added from fonts.googleapis.com
- default = false

# data-is-auto-play = true/false

- if set, slider will automatically start playing when loaded
- default = true

# data-do-show-buttons = true/false

- if set, slide buttons will display (numbers, play, pause, previous, next)
- default = true

# data-do-swipe-on-touchscreen = true/false

- left and right swipe will be available via jquery mobile
- default = true

# data-button-number-display = default/never/always

- "never" = do not display number buttons
- "normal" = hide number buttons if they need to wrap
- "always" = always display number buttons
- default = normal

# data-previous-next-display = buttons/sides/none/both

- "buttons" = display prev/next buttons near the slide numbers and play/pause buttons
- "sides" = display prev/next links on the left and right of the slide
- "none" = display no prev/next links/buttons
- "both" = display prev/next in with the buttons And sides of the slides
- default = sides

# data-theme = default/dark/pastel

- the theme/color sceme of the slider
- default = normal

# data-slide-hold-seconds = (number)

- the length of time each slide is displayed before moving to the next when playing
- default = 6

## Slide Captions

Each slide is a list item (li). The data-caption attribute can be added to place a caption on the slide.

# li example

The following code will display the slider with a dark background and each slide will display for 3 seconds when the slider is playing.

```
<li data-caption="Blue Jay"><img src="./images/blue-jay.jpg" /></li>
```

# Custom Previous and Next Buttons or Links

Custom buttons can be added outside of the main slider element to move to the next or previous slide by adding classes. This will work with any element
(button, img, a, div, etc)
- class="riot-slider-custom-link-prev"
- class="riot-slider-custom-link-next"

```
<a class="riot-slider-custom-link-prev" href="#">Previous Slide!</a><br> 
<a class="riot-slider-custom-link-next" href="#">Next Slide!</a>
```
