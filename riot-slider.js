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

    this.elems.main.find('ul').addClass('slide-list')
    let slides = this.elems.main.find('li');
    slides.addClass('slide')

    this.slideCount = slides.length

    //console.log(this.slideCount,'z');
    //console.log(this.elems.main);
    //console.log(this.elems.slidesInner);
    //console.log(this.elems.slides);
    this.loadHtml()

    

    this.elems.slidesInner = this.elems.main.find('.slides-inner');

    

    let slideWidth = 100 / this.slideCount
    this.elems.slides.css('width', slideWidth + '%').css('color','#FF0')
    console.log('----------');
    console.log(slideWidth);
    console.log(this.elems.slides.length);

    this.setWidth()

    return

    this.bindAll()

    

    this.elems.main.addClass('isLoaded')

    this.goToSlide()
    this.startInterval()
    return true
  }

  loadHtml () {
    let html = this.elems.main.html()
    html = $('<div></div>')
      .addClass('slides-inner')
      .html(html)
    html = $('<div></div>')
      .addClass('slides-outer')
      .html(html)
    
    

    let buttonsHtml = $('<div></div>').addClass('buttons')

    let buttonHtml, buttonGroupHtml, buttonInnerHtml;

    for (let x = 1; x <= this.slideCount; x++) {
      buttonHtml = $('<a></a>')
        .attr('href', '#')
        .addClass('slide-link slide-link-' + x)
        .html(x)
      buttonsHtml.append(buttonHtml)
    }

    buttonGroupHtml = $('<div></div>').addClass('button-group');
    
    buttonInnerHtml = $('<i></i>').addClass('material-icons').html('navigate_before');
    buttonHtml = $('<a></a>')
    .attr('href', '#')
      .addClass('slide-link slide-link-prev')
      .html(buttonInnerHtml)

    buttonGroupHtml.append(buttonHtml)

    buttonInnerHtml = $('<i></i>').addClass('material-icons').html('navigate_next');
    buttonHtml = $('<a></a>')
    .attr('href', '#')
      .addClass('slide-link slide-link-next')
      .html(buttonInnerHtml)

    buttonGroupHtml.append(buttonHtml)

    buttonsHtml.append(buttonGroupHtml)

/////////////////////

    buttonGroupHtml = $('<div></div>').addClass('button-group');
    
    buttonInnerHtml = $('<i></i>').addClass('material-icons').html('play_arrow');
    buttonHtml = $('<a></a>')
    .attr('href', '#')
      .addClass('slide-link slide-link-play')
      .html(buttonInnerHtml)

    buttonGroupHtml.append(buttonHtml)

    buttonInnerHtml = $('<i></i>').addClass('material-icons').html('pause');
    buttonHtml = $('<a></a>')
    .attr('href', '#')
      .addClass('slide-link slide-link-stop')
      .html(buttonInnerHtml)

    buttonGroupHtml.append(buttonHtml)

    buttonsHtml.append(buttonGroupHtml)


    this.elems.main.html(html)
    this.elems.main.append(buttonsHtml)

    this.elems.slides = this.elems.main.find('li')
    
    //this.elems.main.append(buttonsHtml)
    console.log('c')
    /*<div class="buttonCon" style="display:none;">
<?
	$x=0;
	foreach ($imgAr as $img)
	{
		$x++;
		?><a href="javascript:void(0);" class="slideLink slideLink<? echo $x; ?>"><? echo $x; ?></a> <?
	}
?>
<div class="opsCon">
<a href="javascript:void(0);" class="slideLinkPrev"><i class="material-icons">
navigate_before
</i></a>
<a href="javascript:void(0);" class="slideLinkNext"><i class="material-icons">
navigate_next
</i></a>

<a href="javascript:void(0);" class="slideLinkPlay"><i class="material-icons">play_arrow</i></a>
<a href="javascript:void(0);" class="slideLinkStop"><i class="material-icons">pause</i></a>
</div>*/

    //this.elems.main.html(html)
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
    console.log(this)
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
