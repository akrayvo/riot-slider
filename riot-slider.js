class RiotSlider {
  static jqueryUrl =
    'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'
  static materialIconsUrl =
    'https://fonts.googleapis.com/icon?family=Material+Icons'

  static validThemes = ['default', 'dark', 'pastel']
  static validButtonNumberDisplays = ['never', 'default', 'always']
  static validPreviousNextDisplay = ['buttons', 'sides', 'none', 'both']

  /*
   * initialize all class variables
   *     if the element ID is passed, the slider will be loaded.
   * if the element ID is NOT passed, the slider will not be loaded until the load()
   *     function is called. this will give a chance to set parameters.
   */
  constructor(elem) {
    this.elems = {
      main: null,
      slidesInner: null,
      slideLinkNumbers: null,
      slideNumberGroup: null,
      play: null,
      stop: null,
      prev: null,
      next: null,
      sidePrev: null,
      sideNext: null,
      customPrevButton: null,
      customNextButton: null
    }
    this.swipeInfo = {
      startX: null,
      startY: null,
      startTime: null
    }
    this.currentSlideNumber = 1
    this.slideCount = 0
    this.slideInterval = null
    this.isIntervalSet = false
    this.isLoaded = false
    this.sliderWidth = 0
    this.options = {
      doConsoleLog: false,
      useMaterialIcons: true,
      isAutoPlay: true,
      doShowButtons: true,
      buttonNumberDisplay: 'default',
      previousNextDisplay: 'both',
      theme: 'default',
      slideHoldSeconds: 6,
      swipeMaxSeconds: 0.9,
      swipeMinPx: 60,
      swipeMinPercent: 13
    }

    this.load(elem)
  }

  /*****************************************************************************
   * start SET OPTIONS
   ****************************************************************************/

  /*
   * set doConsoleLog option
   * if set, information will be added to the console log
   * generally only needed for testing/development
   * default = false
   */
  setDoConsoleLog(value) {
    this.options.doConsoleLog = this.returnBoolean(value)
    this.consoleLogInfo('set doConsoleLog:')
    this.consoleLogInfo(this.options.doConsoleLog)
  }

  /*
   * set useMaterialIcons option
   * if set, material icons will display for play, stop, previous, and next buttons
   * if unavailable, they will automatically be added from fonts.googleapis.com
   * default = true
   */
  setUseMaterialIcons(value) {
    this.options.useMaterialIcons = this.returnBoolean(value)
    this.consoleLogInfo('set useMaterialIcons:')
    this.consoleLogInfo(this.options.useMaterialIcons)
  }

  /*
   * set isAutoPlay option
   * if set, slider will automatically start playing when loaded
   * default = true
   */
  setIsAutoPlay(value) {
    this.options.isAutoPlay = this.returnBoolean(value)
    this.consoleLogInfo('set isAutoPlay:')
    this.consoleLogInfo(this.options.isAutoPlay)
  }

  /*
   * set doShowButtons option
   * if set, slide buttons will display (numbers, play, pause, previous, next)
   * default = true
   */
  setDoShowButtons(value) {
    this.options.doShowButtons = this.returnBoolean(value)
    this.consoleLogInfo('set doShowButtons:')
    this.consoleLogInfo(this.options.doShowButtons)
  }

  /*
   * set buttonNumberDisplay option
   * valid values:
   *  "never" = do not display number buttons
   *  "default" = hide number buttons if they need to wrap
   *  "always" = always display number buttons
   * default = normal
   */
  setButtonNumberDisplay(value) {
    value = this.returnString(value, true);
    if (typeof value !== 'string') {
      // return value will be set to null on error
      return;
    }
    if (RiotSlider.validButtonNumberDisplays.indexOf(value) < 0) {
      this.consoleLogInfo(
        'invalid value sent to setButtonNumberDisplay: ' + value
      )
      return
    }
    this.consoleLogInfo('set buttonNumberDisplay: ' + value)
    this.options.buttonNumberDisplay = value
  }

  /*
   * set previousNextDisplay option
   * valid values:
   *  "buttons" = display prev/next buttons near the slide numbers and play/pause buttons
   *  "sides" = display prev/next links on the left and right of the slide
   *  "none" = display no prev/next links/buttons
   *  "both" = display prev/next in with the buttons and sides of each slide
   * default = sides 
  */
  setPreviousNextDisplay(value) {
    value = this.returnString(value, true);
    if (typeof value !== 'string') {
      // return value will be set to null on error
      return;
    }
    if (RiotSlider.validPreviousNextDisplay.indexOf(value) < 0) {
      this.consoleLogInfo(
        'invalid value sent to setPreviousNextDisplay: ' + value
      )
      return
    }
    this.consoleLogInfo('set previousNextDisplay: ' + value)
    this.options.previousNextDisplay = value
  }

  /*
   * set theme option
   * current themes are "default", "dark", "pastel"
   * the theme/color sceme of the slider
   * default = normal
   */
  setTheme(value) {
    value = this.returnString(value, true);
    if (typeof value !== 'string') {
      // return value will be set to null on error
      return;
    }
    if (RiotSlider.validThemes.indexOf(value) < 0) {
      this.consoleLogInfo('invalid value sent to setTheme: ' + value)
      return
    }
    this.consoleLogInfo('set theme: ' + value)
    this.options.theme = value
  }

  /*
   * set slideHoldSeconds option
   * the length of time each slide is displayed before moving to the next when playing
   * value must be between 1 second and 600 seconds (10 minutes)
   * default = 6
   */
  setSlideHoldSeconds(value) {
    value = this.returnFloat(value, 1, 600)
    if (typeof value !== 'number') {
      return
    }
    this.consoleLogInfo('set slideHoldSeconds: ' + value)
    this.options.slideHoldSeconds = value
  }

  /*
   * set swipeMaxSeconds option
   * the max time in seconds between the start and end swipe on a touchscreen
   * can be a decimal (ex: 0.7 or 1.25)
   * if the time is too long, it is likely that the user isn't swiping or there was a missed event
   * value must be between 0.1 (100 milliseconds) and 5
   * default = 0.9 (900 milliseconds)
   */
  setSwipeMaxSeconds(value) {
    value = this.returnFloat(value, 1, 5000)
    if (typeof value !== 'number') {
      return
    }

    this.consoleLogInfo('set swipeMaxSeconds: ' + value)
    this.options.swipeMaxSeconds = value
  }

  /*
   * set setSwipeMinPx option
   * the minimum number of pixels for a swipe on touchscreen
   * used with data-swipe-min-percent. if data-swipe-min-px check fails, 
   *  swipe will still work if the data-swipe-min-percent check succeeds
   * value must be between 1 and 3000
   * default = 60
   */
  setSwipeMinPx(value) {
    value = this.returnInt(value, 1, 3000)
    if (typeof value !== 'number') {
      return
    }

    this.consoleLogInfo('set setSwipeMinPx: ' + value)
    this.options.swipeMinPx = value
  }

  /*
   * set swipeMinPercent option
   * the minimum percent of horizontal pixels for a swipe on touchscreen
   * the percentage of the swipe compared to the full slider width
   * makes it easier to recognize swipes on smaller screens
   * used with data-swipe-min-px. if data-swipe-min-px check is successful, 
   * 	data-swipe-min-percent is not checked
   * value must be between 1 and 100
   * default = 13
   */
  setSwipeMinPercent(value) {
    value = this.returnInt(value, 1, 100)
    if (typeof value !== 'number') {
      return
    }

    this.consoleLogInfo('set swipeMinPercent: ' + value)
    this.options.swipeMinPercent = value
  }

  /*****************************************************************************
   * end SET OPTIONS
   ****************************************************************************/

  /*
   * write information to the console if doConsoleLog is true
   */
  consoleLogInfo(info) {
    if (this.options.doConsoleLog) {
      console.log(info)
    }
  }

  /*
   * convert a variable to either true or false
   */
  returnBoolean(value) {

    if (typeof value === 'string') {
      // to lower case for string comparison, so "True" and "TRUE" will be "true"
      value = value.toLowerCase();

      if (value === 'true' || value === 'on' || value === 'yes' || value === '1') {
        return true
      }
      if (value === 'false' || value === 'off' || value === 'no' || value === '0') {
        return false
      }
    }

    if (value) {
      return true
    }
    return false
  }

  /*
   * convert a variable to an integer
   * note: bigint type will return null since we don't need to handles number that large
   * returns null on failure (not a number, invalid type, etc)
   */
  returnInt(value, min, max) {
    var valueType = typeof value;

    if (valueType === 'string') {
      if (isNaN(value)) {
        return null
      }
      value = parseInt(value);
    } else if (valueType === 'number') {
      value = Math.round(value);
    } else {
      // only a number or string can be passed
      return null
    }

    if (value >= min && value <= max) {
      return value
    }

    return null
  }

  /*
   * convert a variable to an float (decimal)
   * note: bigint type will return null since we don't need to handles number that large
   * returns null on failure (not a number, invalid type, etc)
   */
  returnFloat(value, min, max) {
    var valueType = typeof value;

    if (valueType === 'string') {
      if (isNaN(value)) {
        return null
      }
      value = parseFloat(value);
    } else if (valueType === 'number') {
      // the value is already a number, do nothing
    } else {
      // only a number or string can be passed
      return null
    }

    if (value >= min && value <= max) {
      return value
    }

    return null
  }

  /*
   * convert a variable to a string
   * if doStringCleanup is set, trim and set lower case
   */
  returnString(value, doCleanup) {
    var valueType = typeof value;

    if (valueType === 'string') {
      // already a string
      const doCleanupType = typeof doCleanup;
      if (doCleanupType === 'boolean' || doCleanupType === 'number') {
        if (doCleanup) {
          value = value.trim().toLowerCase();
        }
      }
      return value
    } else if (valueType === 'number') {
      return value.toString()
    }

    return null


  }

  /*
   * Load/initialize the slider
   * sliderElem is the id of the HTML ul
   */
  load(sliderElem) {
    // check if it was already loaded
    if (this.isLoaded) {
      return false
    }

    if (typeof sliderElem !== 'object') {
      return false
    }

    // check that the element is an unordered list
    const tagName = sliderElem.prop('tagName').toLowerCase()

    if (tagName !== 'ul') {
      this.consoleLogInfo(
        'Riot Slider not loaded. tag is "' +
        tagName +
        '". must be "ul" (unordered list).'
      )
      return false
    }

    if (sliderElem.find('li').length < 1) {
      this.consoleLogInfo('Riot Slider not loaded: No "li" (list item) found')
      return false
    }

    this.loadMaterialIconsIfNeeded()

    this.loadOptions(sliderElem)

    this.loadHtml(sliderElem)

    this.updateWidth(true)

    this.bindAll()

    //this.loadJqueryMoblieIfNeeded()

    if (this.options.isAutoPlay) {
      // go to the curret slide and start player
      this.goToSlide()
      if (this.options.doShowButtons) {
        this.elems.play.addClass('is-active')
        this.elems.stop.removeClass('is-disabled')
      }
      this.startInterval()
    }

    this.isLoaded = true

    this.consoleLogInfo('Riot Slider successfully loaded')

    return true
  }

  /*
   * read settings/options from data attributes
   */
  loadOptions(elem) {
    let attrName = 'data-do-console-log'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setDoConsoleLog(elem.attr(attrName))
    }

    attrName = 'data-use-material-icons'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setUseMaterialIcons(elem.attr(attrName))
    }

    attrName = 'data-is-auto-play'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setIsAutoPlay(elem.attr(attrName))
    }

    attrName = 'data-do-show-buttons'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setDoShowButtons(elem.attr(attrName))
    }

    //attrName = 'data-do-swipe-on-touchscreen'
    //if (typeof elem.attr(attrName) !== 'undefined') {
    //   this.setDoSwipeOnTouchscreen(elem.attr(attrName))
    // }

    attrName = 'data-button-number-display'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setButtonNumberDisplay(elem.attr(attrName))
    }

    attrName = 'data-previous-next-display'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setPreviousNextDisplay(elem.attr(attrName))
    }

    attrName = 'data-theme'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setTheme(elem.attr(attrName))
    }

    attrName = 'data-slide-hold-seconds'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setSlideHoldSeconds(elem.attr(attrName))
    }

    attrName = 'data-swipe-max-seconds'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setSwipeMaxSeconds(elem.attr(attrName))
    }

    attrName = 'data-swipe-min-px'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setSwipeMinPx(elem.attr(attrName))
    }

    attrName = 'data-swipe-min-percent'
    if (typeof elem.attr(attrName) !== 'undefined') {
      this.setSwipeMinPercent(elem.attr(attrName))
    }

    // check that additional additional data fields are not set. they could be used by the page, so it is
    // not a definite error, but it is likely that an invalid or misspelled parameter was used
    // ex "data-show-buttons" instead of "data-do-show-buttons"
    // if possible issue is found, disply if console logging is turned on

    const validData = ['data-do-console-log', 'data-use-material-icons', 'data-is-auto-play',
      'data-do-show-buttons', 'data-button-number-display', 'data-previous-next-display',
      'data-theme', 'data-slide-hold-seconds', 'data-swipe-max-seconds',
      'data-swipe-min-px', 'data-swipe-min-percent']

    const attributes = elem[0].attributes;
    for (var attribute in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
        // do stuff
        const attr = attributes[attribute].name.toLowerCase();
        if (attr.substring(0, 5) === 'data-') {
          if (validData.indexOf(attr) < 0) {
            this.consoleLogInfo('Possible error - container data field not recognized - ' + attr)
          }
        }
      }
    }
  }

  /*
   * add new HTML elements, add classes to existing elements, and use selectors to save elements
   */
  loadHtml(slideElem) {
    // add additional classes
    this.elems.slides = slideElem.find(' > li')
    this.elems.slides.addClass('slide')

    // total number of slides
    this.slideCount = this.elems.slides.length

    // previous and next display
    let prevHtml = '&laquo;'
    let nextHtml = '&raquo;'
    if (this.options.useMaterialIcons) {
      prevHtml = '<i class="material-icons">navigate_before</i>'
      nextHtml = '<i class="material-icons">navigate_next</i>'
    }

    // create the main container
    this.elems.main = $('<div class="riot-slider-main"></div>')
    if (this.options.theme.length > 0 && this.options.theme !== 'default') {
      this.elems.main.addClass('riot-slider-' + this.options.theme)
    }
    slideElem.after(this.elems.main)

    let html = '<div class="slides-outer">'
    html += '<div class="slides-inner"></div>'
    if (this.doShowPrevNextSides()) {
      html +=
        '<div class="slide-side-link slide-side-link-prev"><span>' +
        prevHtml +
        '</span></div>'
      html +=
        '<div class="slide-side-link slide-side-link-next"><span>' +
        nextHtml +
        '</span></div>'
    }

    html += '</div>' // end slides-outer

    html += this.getButtonHtml(prevHtml, nextHtml)

    this.elems.main.html(html)

    this.elems.slidesInner = this.elems.main.find('.slides-inner')
    this.elems.slidesInner.html(slideElem)

    // make slides a percentage of the total container. ex 5 slides, each slide is width:20%
    let slideWidth = 100 / this.slideCount
    this.elems.slides.css('width', slideWidth + '%')

    this.elems.slides.each(function (index) {
      let elem = $(this)
      let cap = elem.attr('data-caption')
      if (cap && cap.length > 0) {
        if (elem.find('.slide-caption').length < 1) {
          let capHtml = $('<div></div>')
            .addClass('slide-caption')
            .html(cap)
          elem.append(capHtml)
        }
      }
    })

    // set button elements
    if (this.options.doShowButtons) {
      this.elems.play = this.elems.main.find('.slide-link-play')
      this.elems.stop = this.elems.main.find('.slide-link-stop')
      if (this.doShowButtonNumbers) {
        this.elems.slideNumberGroup = this.elems.main.find(
          '.slide-number-group'
        )
        this.elems.slideLinkNumbers = this.elems.slideNumberGroup.find(
          '.slide-link-number'
        )
      }
      if (this.doShowPrevNextButtons()) {
        this.elems.prev = this.elems.main.find('.slide-link-prev')
        this.elems.next = this.elems.main.find('.slide-link-next')
      }
    }

    // set side elements
    if (this.doShowPrevNextSides()) {
      this.elems.sidePrev = $('.slide-side-link-prev')
      this.elems.sideNext = $('.slide-side-link-next')
    }


    this.elems.customPrevButton = $('.riot-slider-custom-link-prev')
    this.elems.customNextButton = $('.riot-slider-custom-link-next')
  }

  /*
   * if the button numbers will display
   */
  doShowButtonNumbers() {
    if (!this.options.doShowButtons) {
      return false
    }
    if (
      this.options.buttonNumberDisplay !== 'default' &&
      this.options.buttonNumberDisplay !== 'always'
    ) {
      return false
    }
    return true
  }

  /*
   * if the previous and next buttons should display
   */
  doShowPrevNextButtons() {
    if (!this.options.doShowButtons) {
      return false
    }

    if (
      this.options.previousNextDisplay !== 'buttons' &&
      this.options.previousNextDisplay !== 'both'
    ) {
      return false
    }

    return true
  }

  /*
   * if the previous and next slide links should display
   */
  doShowPrevNextSides() {
    if (
      this.options.previousNextDisplay !== 'sides' &&
      this.options.previousNextDisplay !== 'both'
    ) {
      return false
    }
    return true
  }

  /*
   * get HTML for the bottom buttos section
   */
  getButtonHtml(prevHtml, nextHtml) {
    if (!this.options.doShowButtons) {
      return ''
    }

    // the button container
    let html = '<div class="slide-buttons">'

    // the slide number buttons
    if (this.doShowButtonNumbers()) {
      html += '<div class="slide-number-group">'
      for (let x = 1; x <= this.slideCount; x++) {
        html +=
          '<button type="button" class="slide-link-number">' + x + '</button>'
      }
      html += '</div>' // slide-number-group
    }

    // the previous and next buttons
    if (this.doShowPrevNextButtons()) {
      html += '<div class="slide-button-group">'
      html +=
        '<button type="button" class="slide-link-prev">' +
        prevHtml +
        '</button>'
      html +=
        '<button type="button" class="slide-link-next">' +
        nextHtml +
        '</button>'
      html += '</div>' // slide-button-group
    }

    // the play and stop buttons
    let playHtml = 'play'
    let stopHtml = 'stop'
    if (this.options.useMaterialIcons) {
      playHtml = '<i class="material-icons">play_arrow</i>'
      stopHtml = '<i class="material-icons">pause</i>'
    }
    html += '<div class="slide-button-group">'
    html +=
      '<button type="button" class="slide-link-play">' + playHtml + '</button>'
    html +=
      '<button type="button" class="slide-link-stop is-disabled">' +
      stopHtml +
      '</button>'
    html += '</div>' // slide-button-group

    html += '</div>' // slide-buttons

    return html
  }

  /*
   * changes the width of the slide when the browser/window is resized
   */
  updateWidth(isInitial) {
    if (typeof isInitial === 'undefined') {
      isInitial = false
    }

    let width = this.elems.main.width()
    if (width === this.sliderWidth) {
      return
    }

    // reset the with of the inner-slider element. this will resize each
    //    slide inside it
    this.sliderWidth = width
    let sliderInnerWidth = this.sliderWidth * this.slideCount
    this.elems.slidesInner.css('width', sliderInnerWidth + 'px')

    // hide the button numbers if they are likely to wrap
    if (this.doShowButtonNumbers()) {
      if (this.options.buttonNumberDisplay === 'default') {
        if (this.slideCount * 50 >= this.sliderWidth) {
          this.elems.slideNumberGroup.addClass('is-hidden')
          this.consoleLogInfo('number buttons will wrap. hide them')
        } else {
          this.elems.slideNumberGroup.removeClass('is-hidden')
          this.consoleLogInfo('number buttons will not wrap. display them.')
        }
      }
    }

    if (!isInitial) {
      // reposition the slider so that the slide display correctly
      // without this, the position will be wrong until the next slide loads
      this.goToSlide()
    }

    this.consoleLogInfo('Riot Slider width set to ' + sliderInnerWidth)
  }

  /*
   * remove the is-active class from a button after a pause.
   * used on the stop, previous, and next buttons
   */
  removeActiveClassIn1Sec(element) {
    setInterval(
      function (element) {
        element.removeClass('is-active')
      },
      1000,
      element
    )
  }

  /*
   * Bind actions to buttons and window resize
   */
  bindAll() {
    // browswer window resize
    $(window).on('resize', { rsThis: this }, function (event) {
      event.data.rsThis.updateWidth()
    })

    if (this.doShowButtonNumbers()) {
      // slide number buttons
      this.elems.slideLinkNumbers.on('click', { rsThis: this }, function (
        event
      ) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.slideNumberClicked(this)
      })
    }

    if (this.options.doShowButtons) {
      // slider "play" button
      this.elems.play.on('click', { rsThis: this }, function (event) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.playClicked()
      })

      // slider "stop" button
      this.elems.stop.on('click', { rsThis: this }, function (event) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.stopClicked()
      })
    }

    this.elems.customPrevButton.on('click', { rsThis: this }, function (event) {
      event.data.rsThis.consoleLogInfo('custom previous clicked')
      event.preventDefault()
      event.stopPropagation()
      event.data.rsThis.prevClicked()
    })
    this.elems.customNextButton.on('click', { rsThis: this }, function (event) {
      event.data.rsThis.consoleLogInfo('custom next clicked')
      event.preventDefault()
      event.stopPropagation()
      event.data.rsThis.nextClicked()
    })

    if (this.doShowPrevNextButtons()) {
      // slider "previous" button
      this.elems.prev.on('click', { rsThis: this }, function (event) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.prevClicked()
      })
      // slider "next" button
      this.elems.next.on('click', { rsThis: this }, function (event) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.nextClicked()
      })
    }

    if (this.doShowPrevNextSides()) {
      // side "previous" button
      this.elems.sidePrev.on('click', { rsThis: this }, function (event) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.prevClicked()
      })
      // side "next" button
      this.elems.sideNext.on('click', { rsThis: this }, function (event) {
        event.preventDefault()
        event.stopPropagation()
        event.data.rsThis.nextClicked()
      })
    }

    //this.bindMobile()

    // vanilla javascript bind on swipe events
    for (var x = 0; x < this.elems.slides.length; x++) {
      this.elems.slides[x].params = { rsThis: this };
      this.elems.slides[x].addEventListener("touchstart", function (event) {
        //this
        //}
        event.preventDefault();
        this.params.rsThis.slideSwipeStartEvent(event);

      });
      this.elems.slides[x].addEventListener("touchend", function (event) {
        event.preventDefault();
        this.params.rsThis.slideSwipeEndEvent(event);
      });
    }
  }

  /*
  * Touchscreen swipe started
  * save time in milliseconds and the X and Y position
  */
  slideSwipeStartEvent(event) {

    var temp = this.getSwipeXYFromEvent(event);
    var x = temp[0];
    //var y = temp[1];

    if (!x) {
      this.swipeInfoReset();
      this.consoleLogInfo('slideSwipeStartEvent - no position found, stop swipe action;');
      return;
    }

    var d = new Date();

    this.swipeInfo.startX = x;
    //this.swipeInfo.startY = y;
    this.swipeInfo.startTime = d.getTime();

    this.consoleLogInfo('slideSwipeStartEvent - position = ' + x);
  }

  /*
  * Touchscreen swipe ended
  * make sure the time and position is valid
  * go to the next or previous slide
  */
  slideSwipeEndEvent(event) {

    if (!this.swipeInfo.startX || !this.swipeInfo.startTime) {
      this.swipeInfoReset();
      this.consoleLogInfo('slideSwipeEndEvent - end swipe with no start swipe, stop swipe action');
      return;
    }

    const d = new Date();
    const timeDif = d.getTime() - this.swipeInfo.startTime;

    if (timeDif > this.options.swipeMaxSeconds * 1000) {
      this.swipeInfoReset();
      // too much time passed bewteen start and end. either event missed or very slow slide.
      this.consoleLogInfo('slideSwipeEndEvent - slide time too long, stop swipe action, max seconds = '
        + this.options.swipeMaxSeconds + ', seconds taken = ' + (timeDif/1000));
      return;
    }

    const temp = this.getSwipeXYFromEvent(event);
    const x = temp[0];
    //const y = temp[1];

    if (!x) {
      this.swipeInfoReset();
      this.consoleLogInfo('slideSwipeEndEvent - no position found, stop swipe action');
      return;
    }

    const xDif = Math.abs(x - this.swipeInfo.startX);
    //const yDif = Math.abs(y - this.swipeInfo.startY);

    this.consoleLogInfo('slideSwipeEndEvent - x=' + xDif + 'px, time=' + timeDif + 'MS');


    if (xDif < this.options.swipeMinPx) {
      this.consoleLogInfo('slideSwipeEndEvent - xDif=' + xDif + ', < ' + this.options.swipeMinPx + ', check percednt');

      const windowWidth = this.elems.main.width();
      const widthPercent = xDif / windowWidth * 100;

      if (widthPercent < this.options.swipeMinPercent) {
        this.swipeInfoReset();
        this.consoleLogInfo('slideSwipeEndEvent - xDif=' + xDif + ', windowWidth=' + windowWidth +
          ', percent=' + (Math.round(widthPercent * 100) / 100) + '%, < 20%, stop swipe action');
        return;
      }
    }

    this.stopInterval()
    if (x > this.swipeInfo.startX) {
      this.consoleLogInfo('slideSwipeEndEvent - previous');
      this.incrementSlideNumber(-1);
    } else {
      this.consoleLogInfo('slideSwipeEndEvent - next');
      this.incrementSlideNumber();
    }
    this.goToSlide();
  }

  swipeInfoReset() {
    this.swipeInfo.startX = null;
    //this.swipeInfo.startY = null;
    this.swipeInfo.startTime = null;
  }

  getSwipeXYFromEvent(event) {
    if (event.TouchList) {
      if (event.TouchList[0]) {
        if (event.TouchList[0].screenX && event.TouchList[0].screenY) {
          console.log('pageX', event.TouchList[0].pageX, vent.TouchList[0].pageY);
          return [event.TouchList[0].pageX, vent.TouchList[0].pageY]
        }
      }
    }

    if (event.changedTouches) {
      if (event.changedTouches[0]) {
        if (event.changedTouches[0].screenX && event.changedTouches[0].screenX) {
          console.log('pageX', event.changedTouches[0].screenX, event.changedTouches[0].screenY);
          return [event.changedTouches[0].screenX, event.changedTouches[0].screenY]
        }
      }
    }

    return [null, null];
  }

  /*
   * display the current slide
   */
  goToSlide() {
    // change the left margin of the slider container so that that correct slide displays
    var val = (this.currentSlideNumber - 1) * this.sliderWidth
    this.elems.slidesInner.css('margin-left', '-' + val + 'px')

    if (this.elems.slideLinkNumbers) {
      // remove the "is-active" class from all slide numbers
      this.elems.slideLinkNumbers.removeClass('is-active')

      // add the "is-active" class to the displaying slide number
      $(this.elems.slideLinkNumbers[this.currentSlideNumber - 1]).addClass(
        'is-active'
      )
    }

    this.consoleLogInfo('slide loaded: ' + this.currentSlideNumber)
  }

  /*
   * stop the upcoming move to the next slide.
   * ex: if the "stop" button is hit
   */
  stopInterval() {
    if (this.isIntervalSet) {
      if (this.options.doShowButtons) {
        this.elems.play.removeClass('is-active')
        this.elems.stop.addClass('is-disabled')
      }
      clearInterval(this.slideInterval)
      this.isIntervalSet = false
    }
  }

  /*
   * Increment the slide number
   * usually the optional value is no passed to set +1 (next slide)
   * -1 can be passed to go to the previous slide
   */
  incrementSlideNumber(increment) {
    // set default value if needed
    if (typeof increment === 'undefined') {
      increment = 1
    }

    // change the current sli
    this.currentSlideNumber += increment

    // check if before the first slide, go to the last slide
    // will happen when the "previous" button is clicked on the first slide
    if (this.currentSlideNumber < 1) {
      this.currentSlideNumber = this.slideCount
    }

    // check if after the first slide, go to the first slide
    // will happen when on the last slide and trying to move to the next slide
    if (this.currentSlideNumber > this.slideCount) {
      this.currentSlideNumber = 1
    }
  }

  /*
   * load the next slide after a pause
   */
  startInterval() {
    // stop the current interval if it is on/active
    this.stopInterval()

    // go to next slide after pause
    this.isIntervalSet = true
    this.slideInterval = setInterval(
      function (rsThis) {
        rsThis.incrementSlideNumber()
        rsThis.goToSlide()
      },
      Math.round(this.options.slideHoldSeconds * 1000),
      this
    )
  }

  /*
   * load material icons from googleapis if needed
   */
  loadMaterialIconsIfNeeded() {
    if (!this.options.useMaterialIcons) {
      return false
    }

    // not displaying buttons or side links
    if (!this.options.doShowButtons) {
      if (
        this.options.previousNextDisplay !== 'sides' &&
        this.options.previousNextDisplay !== 'both'
      ) {
        return false
      }
    }

    // Create an element in the DOM for testing if Material Icons are present
    let spanElem = document.createElement('span')
    spanElem.className = 'material-icons'
    spanElem.style.display = 'none'
    document.body.append(spanElem, document.body.firstChild)

    // See if the computed font-family value is material icons
    const needToLoadMaterialIcons =
      window
        .getComputedStyle(spanElem, null)
        .getPropertyValue('font-family') !== 'Material Icons'

    // If it's not, load the resource
    if (needToLoadMaterialIcons) {
      let linkElem = document.createElement('link')
      linkElem.href = RiotSlider.materialIconsUrl
      linkElem.rel = 'stylesheet'
      document.head.appendChild(linkElem)
    }

    // Cleanup the original <span> we stuck in the DOM
    document.body.removeChild(spanElem)
  }

  /*****************************************************************************
   * BUTTON CLICK ACTIONS
   ****************************************************************************/
  /*
   * changes the width of the slide when the browser/window is resized
   */
  slideNumberClicked(buttonClicked) {
    this.stopInterval()
    this.currentSlideNumber = parseInt($(buttonClicked).html())
    this.goToSlide()
  }

  /*
   * the play button has been clicked. load the next slide and set the
   * following slide to load after a pause
   */
  playClicked() {
    this.incrementSlideNumber()
    this.goToSlide()
    this.startInterval()
    this.elems.play.addClass('is-active')
    this.elems.stop.removeClass('is-disabled')
  }

  /*
   * the stop button has been clicked. if the next image is set to load
   * after a pause, stop that action
   */
  stopClicked() {
    if (!this.isIntervalSet) {
      return
    }
    this.elems.stop.addClass('is-active') //.addClass('is-disabled')
    this.removeActiveClassIn1Sec(this.elems.stop)
    this.stopInterval()
  }

  /*
   * the previous button was clicked. got to the next slide
   */
  prevClicked() {
    if (this.elems.prev) {
      this.elems.prev.addClass('is-active')
      this.removeActiveClassIn1Sec(this.elems.prev)
    }
    this.stopInterval()
    this.incrementSlideNumber(-1)
    this.goToSlide()
  }

  /*
   * the previous button was clicked. got to the previous slide
   */
  nextClicked() {
    if (this.elems.next) {
      this.elems.next.addClass('is-active')
      this.removeActiveClassIn1Sec(this.elems.next)
    }
    this.stopInterval()
    this.incrementSlideNumber()
    this.goToSlide()
  }
}

/*
 * check for jquery. load if needed. then load riot slider
 */

// This will check if jQuery has loaded. If not, it will add to <head>
window.onload = function () {
  if (!window.jQuery) {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = RiotSlider.jqueryUrl
    head.appendChild(script)

    let waitForJQuery = setInterval(function () {
      if (window.jQuery) {
        clearInterval(waitForJQuery)
        riotSliderInitAll()
      }
    }, 100)
  } else {
    riotSliderInitAll()
  }
}

function riotSliderInitAll() {
  $(document).ready(function () {
    $('.riot-slider').each(function () {
      new RiotSlider($(this))
    })
  })
}
