class RiotSlider {
  /*
   * initialize all class variables
   *     if the element ID is passed, the slider will be loaded.
   * if the element ID is NOT passed, the slider will not be loaded until the load()
   *     function is called. this will give a chance to set parameters.
   */
  constructor (elementId) {
    this.elems = {
      main: null,
      slidesOuter: null,
      slidesInner: null,
      slides: null,
      slideLinks: null,
      play: null,
      stop: null,
      prev: null,
      next: null
    }
    this.currentSlideNumber = 1
    this.slideCount = 0
    this.slideInterval = null
    this.intervalIsSet = false
    this.isLoaded = false
    this.sliderWidth = 0
    this.options = {
      useMaterialIcons: false,
      doShowButtons: true,
      isAutoPlay: true,
      doConsoleLogInfo: true,
      buttonNumberDisplay: 'normal', // never, normal, always
      theme: 'default',
      slideHoldSeconds: 6
    }

    if (typeof elementId !== 'undefined') {
      this.load(elementId)
    }
  }

  /*****************************************************************************
   * start SET OPTIONS
   ****************************************************************************/

  /*
   * set useMaterialIcons option
   * if set, material icons will display for play, stop, previous, and next buttons
   * <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
   */
  setUseMaterialIcons (value) {
    this.options.useMaterialIcons = this.returnBoolean(value)
  }

  /*
   * set doShowNumberButtons option
   * if set, slide number buttons will display
   */
  setDoShowButtons (value) {
    this.options.doShowButtons = this.returnBoolean(value)
  }

  /*
   * set isAutoPlay option
   * if set, slider will automatically start playing when loaded
   */
  setIsAutoPlay (value) {
    this.options.isAutoPlay = this.returnBoolean(value)
  }

  /*
   * set doConsoleLog option
   * if set, information will be added to the console log
   * used in the consoleLogInfo(info) function
   */
  setDoConsoleLog (value) {
    this.options.doConsoleLog = this.returnBoolean(value)
  }

  /*
   * set buttonNumberDisplay option
   * valid values:
   *  "never" = do not display number buttons
   *  "normal" = hide number buttons if they need to wrap
   *  "always" = always display number buttons
   */
  setButtonNumberDisplay (value) {
    if (value != 'never' && value != 'normal' && value != 'always') {
      consoleLogInfo('invalid value sent to setButtonNumberDisplay: ' + value)
      return
    }
    this.options.buttonNumberDisplay = value
  }

  /*
   * set theme option
   * current themes are "default" and "dark"
   */
  setTheme (value) {
    if (value != 'default' && value != 'dark') {
      consoleLogInfo('invalid value sent to setTheme: ' + value)
      return
    }
    this.options.theme = value
  }

  /*
   * set slideHoldSeconds option
   * the length of time each slide is displayed before moving to the next when playing
   */
  setSlideHoldSeconds (value) {
    if (isNaN(value)) {
      return
    }
    if (value < 1 || value > 600) {
      return
    }
    this.options.slideHoldSeconds = value
  }

  /*****************************************************************************
   * end SET OPTIONS
   ****************************************************************************/

  /*
   * write information to the console if doConsoleLogInfo is true
   */
  consoleLogInfo (info) {
    if (this.options.doConsoleLog) {
      console.log(info)
    }
  }

  /*
   * convert a variable to either true or false
   */
  returnBoolean (value) {
    if (value) {
      return true
    }
    return false
  }

  /*
   * Load/initialize the slider
   * elementId is the id of the HTML div
   */
  load (elementId) {
    // check if it was already loaded
    if (this.isLoaded) {
      return false
    }

    // check that the element exists
    this.elems.main = $('#' + elementId)
    if (this.elems.main.length < 1) {
      this.consoleLogInfo(
        'Riot Slider not loaded. Element ID not found:' + elementId
      )
      return false
    }

    // check that at least 1 slide exists
    if (this.elems.main.find('ul li').length < 1) {
      this.consoleLogInfo(
        'Riot Slider not loaded. No slides found in ' + elementId
      )
      return false
    }

    this.loadMaterialIconsIfNeeded()

    this.loadHtml()

    this.updateWidth()

    this.bindAll()

    if (this.options.isAutoPlay) {
      // go to the curret slide and start player
      this.goToSlide()
      this.elems.play.addClass('is-active')
      this.startInterval()
    }

    this.isLoaded = true

    this.consoleLogInfo(
      'Riot Slider successfully loaded on element ID:' + elementId
    )

    return true
  }

  /*
   * add new HTML elements, add classes to existing elements, and use selectors to save elements
   */
  loadHtml () {
    // add 2 containers around the list of slides.
    // slide-outer stays in place, slide-inner changes the left-margin value to "slide"
    let html = this.elems.main
      .find('ul')
      .first()
      .html()

    html = $('<div></div>')
      .addClass('slides-inner')
      .html(html)
    html = $('<div></div>')
      .addClass('slides-outer')
      .html(html)
    this.elems.main.html(html)

    // add additional classes
    this.elems.main.find('ul').addClass('slide-list')
    this.elems.slides = this.elems.main.find('li')
    this.elems.slides.addClass('slide')

    // this is the container that the slide list is in. it will change width if the slider width changes
    this.elems.slidesInner = this.elems.main.find('.slides-inner')

    // total number of slides
    this.slideCount = this.elems.slides.length

    // make slides a percentage of the total container. ex 5 slides, each slide is width:20%
    let slideWidth = 100 / this.slideCount
    this.elems.slides.css('width', slideWidth + '%')

    this.loadButtonHtml()

    this.elems.slides.filter('[data-caption]').each(function (index) {
      let cap = $(this).attr('data-caption')
      if (cap.length > 0) {
        let capHtml = $('<div></div>')
          .addClass('slide-caption')
          .html(cap)
        $(this).append(capHtml)
      }
    })

    // assign the buttons
    this.elems.slideLinks = this.elems.main.find('.slide-link')
    this.elems.play = this.elems.main.find('.slide-link-play')
    this.elems.stop = this.elems.main.find('.slide-link-stop')
    this.elems.prev = this.elems.main.find('.slide-link-prev')
    this.elems.next = this.elems.main.find('.slide-link-next')
  }

  /*
   * add new HTML button elements: slide numbers, play, pause, previous, next
   */
  loadButtonHtml () {
    if (!this.options.doShowButtons) {
      return
    }

    // the button container
    let buttonsHtml, buttonHtml, buttonGroupHtml, buttonInnerHtml
    buttonsHtml = $('<div></div>').addClass('buttons')

    if (
      this.options.buttonNumberDisplay === 'normal' ||
      this.options.buttonNumberDisplay === 'always'
    ) {
      buttonGroupHtml = $('<div></div>').addClass('button-number-group')
      // the slide number buttons
      for (let x = 1; x <= this.slideCount; x++) {
        buttonHtml = $('<button></button>')
          .attr('type', 'button')
          .addClass('slide-link slide-link-' + x)
          .html(x)
        buttonGroupHtml.append(buttonHtml)
      }
      buttonsHtml.append(buttonGroupHtml)
    }

    // the previous and next buttons
    buttonGroupHtml = $('<div></div>').addClass('button-group')
    if (this.options.useMaterialIcons) {
      buttonInnerHtml = $('<i></i>')
        .addClass('material-icons')
        .html('navigate_before')
    } else {
      buttonInnerHtml = '&laquo;'
    }
    buttonHtml = $('<button></button>')
      .attr('type', 'button')
      .addClass('slide-link-prev')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    if (this.options.useMaterialIcons) {
      buttonInnerHtml = $('<i></i>')
        .addClass('material-icons')
        .html('navigate_next')
    } else {
      buttonInnerHtml = '&raquo;'
    }
    buttonHtml = $('<button></button>')
      .attr('type', 'button')
      .addClass('slide-link-next')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    buttonsHtml.append(buttonGroupHtml)

    // the play and stop buttons
    buttonGroupHtml = $('<div></div>').addClass('button-group')
    if (this.options.useMaterialIcons) {
      buttonInnerHtml = $('<i></i>')
        .addClass('material-icons')
        .html('play_arrow')
    } else {
      buttonInnerHtml = 'play'
    }
    buttonHtml = $('<button></button>')
      .attr('type', 'button')
      .addClass('slide-link-play')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    if (this.options.useMaterialIcons) {
      buttonInnerHtml = $('<i></i>')
        .addClass('material-icons')
        .html('pause')
    } else {
      buttonInnerHtml = 'stop'
    }
    buttonHtml = $('<button></button>')
      .attr('type', 'button')
      .addClass('slide-link-stop')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    buttonsHtml.append(buttonGroupHtml)

    // add buttons to html
    this.elems.main.append(buttonsHtml)

    if (this.options.theme === 'dark') {
      this.elems.main.addClass('riot-slider-dark');
    }
  }

  /*
   * changes the width of the slide when the browser/window is resized
   */
  updateWidth () {
    let width = this.elems.main.width()
    if (width === this.sliderWidth) {
      return
    }

    // reset the with of the inner-slider element. this will resize each
    //    slide inside it
    this.sliderWidth = width
    let sliderInnerWidth = this.sliderWidth * this.slideCount
    this.elems.slidesInner.css('width', sliderInnerWidth + 'px')

    // reposition the slider so that the slide display correctly
    // without this. the position will be wrong until the next slide loads
    this.goToSlide()

    // hide the button numbers if they are likely to wrap
    if (this.options.buttonNumberDisplay === 'normal') {
      if (this.slideCount * 48 >= this.sliderWidth) {
        this.elems.main.find('.button-number-group').addClass('is-hidden')
        this.consoleLogInfo('number buttons will wrap. hide them')
      } else {
        this.elems.main.find('.button-number-group').removeClass('is-hidden')
        this.consoleLogInfo('number buttons not will wrap. display them')
      }
    }

    this.consoleLogInfo('Riot Slider width set to ' + sliderInnerWidth)
  }

  /*
   * remove the is-active class from a button after a pause.
   * used on the stop, previous, and next buttons
   */
  removeActiveClassIn1Sec (element) {
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
  bindAll () {
    // browswer window resize
    $(window).on('resize', { rsThis: this }, function (event) {
      event.data.rsThis.updateWidth()
    })

    // slide number buttons
    this.elems.slideLinks.on('click', { rsThis: this }, function (event) {
      event.preventDefault()
      event.stopPropagation()
      event.data.rsThis.slideNumberClicked(this)
    })

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

  /*
   * display the current slide
   */
  goToSlide () {
    // change the left margin of the slider container so that that correct slide displays
    var val = (this.currentSlideNumber - 1) * this.sliderWidth
    this.elems.slidesInner.css('margin-left', '-' + val + 'px')

    // remove the "is-active" class from all slide numbers
    this.elems.slideLinks.removeClass('is-active')

    // add the "is-active" class to the displaying slide number
    this.elems.slideLinks
      .filter('.slide-link-' + this.currentSlideNumber)
      .addClass('is-active')

    this.consoleLogInfo('slide loaded: ' + this.currentSlideNumber)
  }

  /*
   * stop the upcoming move to the next slide.
   * ex: if the "stop" button is hit
   */
  stopInterval () {
    if (this.intervalIsSet) {
      this.elems.play.removeClass('is-active')
      clearInterval(this.slideInterval)
      this.intervalIsSet = false
    }
  }

  /*
   * Increment the slide number
   * usually the optional value is no passed to set +1 (next slide)
   * -1 can be passed to go to the previous slide
   */
  incrementSlideNumber (increment) {
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
  startInterval () {
    // stop the current interval if it is on/active
    this.stopInterval()

    // go to next slide after pause
    this.intervalIsSet = true
    this.slideInterval = setInterval(
      function (rsThis) {
        rsThis.incrementSlideNumber()
        rsThis.goToSlide()
      },
      Math.round(this.options.slideHoldSeconds * 1000),
      this
    )
  }

  loadMaterialIconsIfNeeded () {
    if (!this.options.useMaterialIcons) {
      return false
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
      linkElem.href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
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
  slideNumberClicked (buttonClicked) {
    this.stopInterval()
    this.currentSlideNumber = parseInt($(buttonClicked).html())
    this.goToSlide()
  }

  /*
   * the play button has been clicked. load the next slide and set the
   * following slide to load after a pause
   */
  playClicked () {
    this.elems.play.addClass('is-active')
    this.incrementSlideNumber()
    this.goToSlide()
    this.startInterval()
  }

  /*
   * the stop button has been clicked. if the next image is set to load
   * after a pause, stop that action
   */
  stopClicked () {
    this.elems.stop.addClass('is-active')
    this.removeActiveClassIn1Sec(this.elems.stop)
    this.stopInterval()
  }

  /*
   * the previous button was clicked. got to the next slide
   */
  prevClicked () {
    this.elems.prev.addClass('is-active')
    this.removeActiveClassIn1Sec(this.elems.prev)
    this.stopInterval()
    this.incrementSlideNumber(-1)
    this.goToSlide()
  }

  /*
   * the previous button was clicked. got to the previous slide
   */
  nextClicked () {
    this.elems.next.addClass('is-active')
    this.removeActiveClassIn1Sec(this.elems.next)
    this.stopInterval()
    this.incrementSlideNumber()
    this.goToSlide()
  }
}
