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

jQuery and Material Icons will automatically be added if they are needed and not already available. If they are needed, it may be more efficient to include them before including `riot-slider.min.js`.
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
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
- default = true

# data-is-auto-play = true/false

- if set, slider will automatically start playing when loaded
- default = true

# data-do-show-buttons = true/false

- if set, slide buttons will display (numbers, play, pause, previous, next)
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
- can be a decimal (ex: 4.5)
- value must be between 1 second and 600 seconds (10 minutes)
- default = 6

# data-swipe-max-seconds = (number)
   * the max time in seconds between the start and end swipe on a touchscreen
   * can be a decimal (ex: 0.7 or 1.25)
   * if the time is too long, it is likely that the user isn't swiping or there was a missed event
   * value must be between 0.1 (100 milliseconds) and 5
   * default = 0.9 (900 milliseconds)

# data-swipe-min-px =  (number)
   * the minimum number of pixels for a swipe on touchscreen
   * used with data-swipe-min-percent. if data-swipe-min-px check fails, swipe will still work if the data-swipe-min-percent check succeeds
   * value must be between 1 and 3000
   * default = 60

# data-swipe-min-percent =  (number)
   * the minimum percent of horizontal pixels for a swipe on touchscreen
   * the percentage of the swipe compared to the full slider width
   * makes it easier to recognize swipes on smaller screens
   * used with data-swipe-min-px. if data-swipe-min-px check is successful, data-swipe-min-percent is not checked
   * value must be between 1 and 100
   * default = 13

## Slide Captions

Each slide is a list item (li). The data-caption attribute can be added to place a caption on the slide.

# li example

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
