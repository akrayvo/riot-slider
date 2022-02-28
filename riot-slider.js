class RiotSlider {
  /*
   * initialize all class variables
   *     if the element ID is passed, the slider will be loaded.
   * if the element ID is NOT passed, the slider will not be loaded until the load()
   *     function is called. this will give a chance to set parameters
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
    this.options = {
      useMaterialIcons: true,
      showButtons: true,
      showSlideNumberButtons: true,
      isAutoplay: true,
      slideMoveTimeSec: null,
      slideHoldTimeMs: 5000,
      doConsoleLogInfo: true
    }

    if (typeof elementId !== 'undefined') {
      this.load(elementId)
    }
  }

  // write information to the console if doConsoleLogInfo is true
  consoleLogInfo (info) {
    if (this.options.doConsoleLogInfo) {
      console.log(info)
    }
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

    this.loadHtml()

    this.setWidth()

    this.bindAll()

    this.goToSlide()

    this.elems.play.addClass('is-active')
    this.startInterval()

    this.isLoaded = true

    this.consoleLogInfo(
      'Riot Slider successfully loaded on element ID:' + elementId
    )

    return true
  }

  /*
   * add new HTML elements, add classes to existing elements, and use selectors to save to the elems class
   */
  loadHtml () {
    // add 2 containers around the list of slides.
    // slide-outer stays in place, slide-inner changes the left-margin value to "slide"
    let html = this.elems.main.html()
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

    // the button container
    let buttonsHtml, buttonHtml, buttonGroupHtml, buttonInnerHtml
    buttonsHtml = $('<div></div>').addClass('buttons')

    // the slide number buttons
    for (let x = 1; x <= this.slideCount; x++) {
      buttonHtml = $('<a></a>')
        .attr('href', '#')
        .addClass('slide-link slide-link-' + x)
        .html(x)
      buttonsHtml.append(buttonHtml)
    }

    // the previous and next buttons
    buttonGroupHtml = $('<div></div>').addClass('button-group')
    buttonInnerHtml = $('<i></i>')
      .addClass('material-icons')
      .html('navigate_before')
    buttonHtml = $('<a></a>')
      .attr('href', '#')
      .addClass('slide-link-prev')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    buttonInnerHtml = $('<i></i>')
      .addClass('material-icons')
      .html('navigate_next')
    buttonHtml = $('<a></a>')
      .attr('href', '#')
      .addClass('slide-link-next')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    buttonsHtml.append(buttonGroupHtml)

    // the play and stop buttons
    buttonGroupHtml = $('<div></div>').addClass('button-group')
    buttonInnerHtml = $('<i></i>')
      .addClass('material-icons')
      .html('play_arrow')
    buttonHtml = $('<a></a>')
      .attr('href', '#')
      .addClass('slide-link-play')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    buttonInnerHtml = $('<i></i>')
      .addClass('material-icons')
      .html('pause')
    buttonHtml = $('<a></a>')
      .attr('href', '#')
      .addClass('slide-link-stop')
      .html(buttonInnerHtml)
    buttonGroupHtml.append(buttonHtml)
    buttonsHtml.append(buttonGroupHtml)

    // add buttons to html
    this.elems.main.append(buttonsHtml)

    // assign the buttons
    this.elems.slideLinks = this.elems.main.find('.slide-link')
    this.elems.play = this.elems.main.find('.slide-link-play')
    this.elems.stop = this.elems.main.find('.slide-link-stop')
    this.elems.prev = this.elems.main.find('.slide-link-prev')
    this.elems.next = this.elems.main.find('.slide-link-next')
  }

  /*
   * changes the width of the slide when the browser/window is resized
   */
  setWidth () {
    this.sliderWidth = this.elems.main.width()
    let sliderInnerWidth = this.sliderWidth * this.slideCount
    this.elems.slidesInner.css('width', sliderInnerWidth + 'px')
    this.consoleLogInfo('Riot Slider width set to ' + sliderInnerWidth)
  }

  /*
   * changes the width of the slide when the browser/window is resized
   */
  slideNumberClicked (buttonClicked) {
    this.stopInterval()
    this.currentSlideNumber = parseInt( $(buttonClicked).html() )
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
      event.data.rsThis.setWidth()
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
   *
   */
  startInterval () {
    // stop the current interval if it is on/active
    this.stopInterval()

    // set the pause in milliseconds
    let milliseconds = this.options.slideHoldTimeMs
    // if pause is invalid, set to 4 seconds
    if (isNaN(milliseconds) || milliseconds < 1000 || milliseconds > 600000) {
      milliseconds = 4000
    }

    // go to next slide after pause
    this.intervalIsSet = true
    this.slideInterval = setInterval(
      function (rsThis) {
        rsThis.incrementSlideNumber()
        rsThis.goToSlide()
      },
      milliseconds,
      this
    )
  }
}
