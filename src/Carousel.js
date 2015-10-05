var $ = require( 'jquery' );

var Carousel = function( $element ) {
	this.$element = $element;
	this.$slides = this.$element.children();
	this.amountOfSlides = this.$slides.size();
	this.$images = this.$element.find( 'img' );
	this.activeIndex = 0;

	if( this.$images.size() > 0 ) {
		var that = this;
		this.loadImages( function() {
			that.build();
		} );
	}
	else {
		this.build();
	}
};

Carousel.prototype = {
	build: function() {
		this.$wrap = this.$element.wrap( '<div>' ).parent();

		this.$prevButton = $( '<button>' )
			.addClass( 'carousel-prev-button' )
			.appendTo( this.$wrap )
		;

		this.$nextButton = $( '<button>' )
			.addClass( 'carousel-next-button' )
			.appendTo( this.$wrap )
		;

		this.$element.addClass( 'loaded' );

		this.$firstSlide = this.$slides.eq( 0 );
		this.refresh();
		this.bindEvents();
	},
	loadImages: function( callback ) {

		var amountLoaded = 0,
			amountToLoad = this.$images.size();

		this.$images.each( function()
		{
			var $currentImage = $( this );
			var image = new Image();

			image.onload = function()
			{
				amountLoaded++;

				if( amountLoaded === amountToLoad )
				{
					callback();
				}
			}

			image.src = $currentImage.attr( 'src' );
		} );
	},
	bindEvents: function() {

		var that = this;

		$( window ).resize( function() {
			that.refresh();
		} );

		this.$nextButton.click( function() {
			that.next();
		} );

		this.$prevButton.click( function() {
			that.prev();
		} );

		$( document ).keydown( function( e ) {
			if( e.keyCode == 37 )
			{
				that.prev();
			}
			else if( e.keyCode == 39 )
			{
				that.next();
			}
		} );

		this.bindTouchEvents();
	},
	bindTouchEvents: function() {

		var that = this;

		var swipeDistance,
			posX,
			posY
		;

		this.$wrap.bind( 'touchstart', function( e ) {
			var e = e.originalEvent.changedTouches[ 0 ];
			posX = e.clientX;
			posY = e.clientY;
			swipeDistance = 0;
		} );

		this.$wrap.bind( 'touchmove', function( e ) {
			e.preventDefault();
		} );

		this.$wrap.bind( 'touchend', function( e ) {
			var e = e.originalEvent.changedTouches[ 0 ];
			swipeDistance = e.clientX - posX;
			that.processSwipeDistance( swipeDistance );
		} );
	},
	processSwipeDistance: function( dist ) {
		if( dist < 0 ) {
			this.next();
		}

		if( dist > 0 ) {
			this.prev();
		}
	},
	refresh: function() {
		var that = this;

		this.activeIndex = 0;

		clearTimeout( this.timeout );

		this.$slides.attr( 'style', '' );
		this.$element.attr( 'style', '' );

		this.elementWidth = this.$wrap.width();

		this.$element.css( {
			width: this.elementWidth
		} );

		this.slideWidth = this.$firstSlide[0].getBoundingClientRect().width;
		this.slideHeight = this.$firstSlide[0].getBoundingClientRect().height;

		this.$wrap.css( {
			position: 'relative',
			overflow: 'hidden',
			height: this.slideHeight
		} );

		this.amountVisible = Math.ceil( this.elementWidth / this.slideWidth );

		this.totalWidth = ( this.amountOfSlides * this.slideWidth );

		this.timeout = setTimeout( function()
		{
			that.$element.css( {
				width: that.totalWidth
			} );

			that.$element.children().css( {
				float: 'left',
				width: that.slideWidth
			} );
		}, 500 );

		this.refreshButtons();
	},
	refreshButtons: function() {
		this.$prevButton.removeClass( 'hide' );
		this.$nextButton.removeClass( 'hide' );

		var restSlides = this.amountOfSlides - this.activeIndex;

		if( this.activeIndex === 0 )
		{
			this.$prevButton.addClass( 'hide' );
		}

		if( restSlides <= this.amountVisible )
		{
			this.$nextButton.addClass( 'hide' );
		}
	},
	next: function() {
		this.slideTo( this.activeIndex + 1 );
	},
	prev: function() {
		this.slideTo( this.activeIndex - 1 );
	},
	slideTo: function( n ) {

		var restSlides = this.amountOfSlides - n;

		if( restSlides >= this.amountVisible && n >= 0 )
		{
			this.activeIndex = n;

			this.$element.css( {
				'transform': 'translateX( ' + -( this.activeIndex * this.slideWidth ) + 'px )'
			} );

			this.refreshButtons();
		}
	}
};

module.exports = Carousel;