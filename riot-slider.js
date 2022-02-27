class RiotSlider {
  constructor (elemId) {
    this.elems = {
      main: null,
      buttons: null,
      outerCon: null,
      innerCon: null,
      slideLinks: null,
      buttonCon: null,
      slidesCon: null,
      play: null,
      stop: null,
      prev: null,
      next: null
    }
    this.slides = []
    this.slideNum = 1
    this.slideInterval = null
    this.intervalIsSet = false
    this.imageWidth = 0
    this.intervalTime = 3000
    this.origImgWidth = 1920
    this.origImgHeight = 1080

    this.minSlideWidth = null;
    this.minSlideHeight = null;
    this.minSlideWidth = null;
    this.maxSlideHeight = null;

    this.mainElementId = elemId;
  }

  load () {
    this.elems.main = $('#' + this.mainElementId)
    if (this.elems.main.length < 1) {
      console.log('Riot Slider not loaded. Element ID not found:' + this.mainElementId);
      return false
    }

    this.elems.main.addClass('riotSlider');

    /*this.elems.innerCon = this.elems.main.find('.slidesConInner')
    this.elems.slideElems = this.elems.innerCon.find('.slide')

    this.elems.buttonCon = this.elems.main.find('.buttonCon')
    this.elems.slideLinks = this.elems.buttonCon.find('.slideLink')

    this.elems.play = this.elems.buttonCon.find('.slideLinkPlay')
    this.elems.stop = this.elems.buttonCon.find('.slideLinkStop')
    this.elems.prev = this.elems.buttonCon.find('.slideLinkPrev')
    this.elems.next = this.elems.buttonCon.find('.slideLinkNext')
    this.elems.next = this.elems.buttonCon.find('.slideLinkNext')
    this.elems.slidesCon = this.elems.main.find('.slidesCon')

    this.elems.slideElems.css('display', 'inline-block')
    this.elems.buttonCon.css('display', 'block')

    this.setWidth()

    this.bindAll()

    this.goToSlide()
    this.startInterval()*/

    this.elems.main.addClass('isLoaded');
  }
}
/*
  bindAll () {

    $(window).resize(function () {
      RiotSlider.setWidth()
    })

    this.elems.slideLinks.on('click', function () {
      RiotSlider.stopInterval()
      var num = $(this)
        .html()
        .replace('slideLink', '')
        RiotSlider.slideNum = num
      //console.log(num);
      RiotSlider.goToSlide()
    })

    this.elems.play.on('click', function () {
      RiotSlider.incrementNumber(1)
      RiotSlider.goToSlide()
      RiotSlider.startInterval()
    })

    this.elems.stop.on('click', function () {
      RiotSlider.elem.stop.addClass('active')
      setInterval(function () {
        RiotSlider.elem.stop.removeClass('active')
      }, 1000)
      RiotSlider.stopInterval()
    })

    this.elems.prev.on('click', function () {
      RiotSlider.elem.prev.addClass('active')
      setInterval(function () {
        RiotSlider.elem.prev.removeClass('active')
      }, 1000)
      RiotSlider.stopInterval()
      RiotSlider.incrementNumber(-1)
      RiotSlider.goToSlide()
    })

    this.elems.next.on('click', function () {
      RiotSlider.elem.next.addClass('active')
      setInterval(function () {
        RiotSlider.elem.next.removeClass('active')
      }, 1000)
      RiotSlider.stopInterval()
      RiotSlider.incrementNumber(1)
      RiotSlider.goToSlide()
    })
  }

  startInterval () {
    //console.log('startInterval');
    this.stopInterval()
    this.elems.play.addClass('active')
    this.intervalIsSet = true
    this.slideInterval = setInterval(function () {
      //console.log('Change Slide');
      RiotSlider.incrementNumber(1)
      RiotSlider.goToSlide()
      //console.log(riotSlider.slideNum);
    }, this.intervalTime)
  }

  stopInterval () {
    if (this.intervalIsSet) {
      this.elems.play.removeClass('active')
      clearInterval(this.slideInterval)
      this.intervalIsSet = false
    }
  }

  incrementNumber (increment) {
    this.slideNum = this.slideNum + increment
    if (this.slideNum < 1) {
      this.slideNum = this.elems.slideElems.length
    }
    if (this.slideNum > this.elems.slideElems.length) {
      this.slideNum = 1
    }
  }

  setWidth () {
    var w = this.elems.main.width()

    if (w == this.imageWidth) {
      return false
    }

    this.imageWidth = w
    var h = (this.imageWidth / this.origImgWidth) * this.origImgHeight
    this.elems.innerCon.css('width', w + 'px').css('height', h + 'px')
    this.elems.slidesCon.css('height', h + 'px')
  }

  goToSlide () {
    var val = (this.slideNum - 1) * this.imageWidth
    this.elems.innerCon.css('left', '-' + val + 'px')
    this.elems.slideLinks.removeClass('active')
    this.elems.slideLinks
      .filter('.slideLink' + this.slideNum)
      .addClass('active')
  }
}
*/
/*
var riotSlider = {
	elem: {
		main:null, 
		buttons:null, 
		outerCon:null, 
		innerCon:null,
		slideLinks:null, 
		buttonCon:null,
		slidesCon:null,
		play:null,
		stop:null,
		prev:null,
		next:null
	},
	slideNum:1,
	slideInterval:null,
	intervalIsSet:false,
	imageWidth:0,
	intervalTime: 3000,
	origImgWidth:1920,
	origImgHeight:1080,
};



riotSlider.init = function(elemId) {
    this.elems.main = $('#'+elemId);
	this.elems.innerCon = this.elems.main.find('.slidesConInner');
	this.elems.slideElems = this.elems.innerCon.find('.slide');
	
	this.elems.buttonCon = this.elems.main.find('.buttonCon');
	this.elems.slideLinks = this.elems.buttonCon.find('.slideLink');
	
	this.elems.play = this.elems.buttonCon.find('.slideLinkPlay');
	this.elems.stop = this.elems.buttonCon.find('.slideLinkStop');
	this.elems.prev = this.elems.buttonCon.find('.slideLinkPrev');
	this.elems.next = this.elems.buttonCon.find('.slideLinkNext');
	this.elems.next = this.elems.buttonCon.find('.slideLinkNext');
	this.elems.slidesCon = this.elems.main.find('.slidesCon');

	this.elems.slideElems.css('display', 'inline-block');
	this.elems.buttonCon.css('display', 'block');
	
	this.setWidth();
	
	$(window).resize(function() {
        riotSlider.setWidth();
    });
	
	this.bindAll();
	
	this.goToSlide();
	this.startInterval();
};

riotSlider.bindAll = function() {
	this.elems.slideLinks.on( "click", function() {
		riotSlider.stopInterval();
		var num = $( this ).html().replace('slideLink', '');
		riotSlider.slideNum = num;
		//console.log(num);
		riotSlider.goToSlide();
	});
	
	this.elems.play.on( "click", function() {
		riotSlider.incrementNumber(1);
		riotSlider.goToSlide();
		riotSlider.startInterval();
	});
	
	this.elems.stop.on( "click", function() {
		riotSlider.elem.stop.addClass('active');
		setInterval(function(){ 
			riotSlider.elem.stop.removeClass('active');
		},1000);
		riotSlider.stopInterval();
	});
	
	this.elems.prev.on( "click", function() {
		riotSlider.elem.prev.addClass('active');
		setInterval(function(){ 
			riotSlider.elem.prev.removeClass('active');
		},1000);
		riotSlider.stopInterval();
		riotSlider.incrementNumber(-1);
		riotSlider.goToSlide();
	});
	
	this.elems.next.on( "click", function() {
		riotSlider.elem.next.addClass('active');
		setInterval(function(){ 
			riotSlider.elem.next.removeClass('active');
		},1000);
		riotSlider.stopInterval();
		riotSlider.incrementNumber(1);
		riotSlider.goToSlide();
	});
};

riotSlider.startInterval = function() {
	//console.log('startInterval');
	this.stopInterval();
	this.elems.play.addClass('active');
	this.intervalIsSet = true;
	this.slideInterval = setInterval(function(){ 
			//console.log('Change Slide');
			riotSlider.incrementNumber(1);
			riotSlider.goToSlide();
			//console.log(riotSlider.slideNum);
		},
		this.intervalTime);
};

riotSlider.stopInterval = function() {
    if (this.intervalIsSet) {
		this.elems.play.removeClass('active');
		clearInterval(this.slideInterval);
		this.intervalIsSet = false;
	}
};

riotSlider.incrementNumber = function(increment) {
	this.slideNum = this.slideNum+increment;
	if (this.slideNum < 1) 
	{
		this.slideNum = this.elems.slideElems.length;
	}
	if (this.slideNum > this.elems.slideElems.length)
	{
		this.slideNum = 1;
	}
};

riotSlider.setWidth = function() {
	var w = this.elems.main.width();

	if (w==this.imageWidth)
	{
		return false;
	}

	this.imageWidth = w;
	var h = this.imageWidth/this.origImgWidth*this.origImgHeight;
    this.elems.innerCon.css('width', w+"px").css('height', h+'px');
	this.elems.slidesCon.css('height', h+'px');
};

riotSlider.goToSlide = function() {
	var val = ((this.slideNum-1) * this.imageWidth);
	this.elems.innerCon.css('left', '-'+val+'px');
	this.elems.slideLinks.removeClass('active');
	this.elems.slideLinks.filter('.slideLink'+this.slideNum).addClass('active');
};*/
