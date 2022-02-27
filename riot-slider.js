class RiotSlider {
  constructor () {
    this.elems = {
      main: null,
      //window: null,
      //buttons: null,
      slidesOuter: null,
      slidesInner: null,
      slides: null
      //slideList: null,
      //buttonCon: null,
      //slidesCon: null,
      //play: null,
      //stop: null,
      //prev: null,
      //next: null
    }
    this.slideNum = 1
    this.slideCount = 0
    this.slideInterval = null
    this.intervalIsSet = false
    this.intervalTime = 3000
    /*    this.slides = []
    this.slideInterval = null
    this.intervalIsSet = false
    this.imageWidth = 0
    
    this.origImgWidth = 1920
    this.origImgHeight = 1080

    this.sliderWidth = null



    this.images = []*/
  }

  load (elemId) {
    this.elems.main = $('#' + elemId)
    if (this.elems.main.length < 1) {
      console.log('Riot Slider not loaded. Element ID not found:' + elemId)
      return false
    }

    let html = this.elems.main.html()
    html = $('<div></div>')
      .addClass('slidesInner')
      .html(html)
    html = $('<div></div>')
      .addClass('slidesOuter')
      .html(html)
    this.elems.main.html(html)

    this.elems.slidesInner = this.elems.main.find('.slidesInner')
    this.elems.slides = this.elems.slidesInner.find('.slide')

    this.slideCount = this.elems.slides.length

    this.setWidth()

    this.bindAll()

    
    let slideWidth = 100 / this.slideCount + '%'
    this.elems.slides.css('width', slideWidth)

    this.elems.main.addClass('isLoaded')

    this.goToSlide()
    this.startInterval()
  }

  setWidth () {
    this.sliderWidth = this.elems.main.width()
    let sliderInnerWidth = this.sliderWidth * this.slideCount
    this.elems.slidesInner.css('width', sliderInnerWidth + 'px')
    console.log('Riot Slider width changed. New Width = ' + sliderInnerWidth)
  }

  /*bindAll () {
    $(window).on('resize', {instance: this}, function (event) {
      event.data.instance.setWidth()
    })
  }*/

  bindAll () {
    $(window).on('resize', this.setWidth)
  }

  goToSlide () {
    var val = (this.slideNum - 1) * this.sliderWidth
    this.elems.slidesInner.css('margin-left', '-' + val + 'px')
    //this.elem.slideLinks.removeClass('active');
    //this.elem.slideLinks.filter('.slideLink'+this.slideNum).addClass('active');
  }

  stopInterval () {
    if (this.intervalIsSet) {
      //this.elem.play.removeClass('active');
      //clearInterval(this.slideInterval);
      this.intervalIsSet = false
    }
  }

  slideIncrementAndGo () {
    this.incrementSlideNumber()
    this.goToSlide()
  }

  incrementSlideNumber (increment) {
    if (typeof increment === 'undefined') {
      increment = 1
    }
    this.slideNum = this.slideNum + increment
    if (this.slideNum < 1) {
      this.slideNum = this.slideCount
    }
    if (this.slideNum > this.slideCount) {
      this.slideNum = 1
    }
  }

  startInterval () {
    console.log(this);
    //console.log('startInterval');
    this.stopInterval()
    //this.elem.play.addClass('active');
    this.intervalIsSet = true
    let a = '123'
    this.slideInterval = setInterval(
      this.slideIncrementAndGo.bind(this),
      this.intervalTime
    )
  }
}
