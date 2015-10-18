/*

tnt-carousel
------------

Author: Rein Van Oyen <rein@tnt.be>
Website: http://www.tnt.be
Repo: http://github.com/reinvanoyen/tnt-carousel
Issues: http://github.com/reinvanoyen/tnt-carousel/issues

*/

"use strict";

var removeElement = function( element ) {
	element && element.parentNode && element.parentNode.removeChild( element );
};

var Carousel = function( element, options ) {

	options = options || {};

	this.options = {
		autoplay: options.autoplay || false,
		playInterval: options.playinterval || 4000,
		touchSwipe: options.touchSwipe || true,
		mouseSwipe: options.mouseSwipe || true,
		keyEvents: options.keyEvents || false,
		arrowButtons: options.arrowButtons || true,
		previousArrowClass: options.previousArrowClass || 'carousel-prev-button',
		nextArrowClass: options.nextArrowClass || 'carousel-next-button',
		inactiveArrowClass: options.inactiveArrowClass || 'hide',
		loadedClass: options.loadedClass || 'loaded',
		activeSlideClass: options.activeSlideClass || 'active',
		edgeFriction: options.edgeFriction || .1
	};

	this._element = element;
	this._slides = this._element.children;

	this.amountOfSlides = this._slides.length;

	this.activeSlideIndex = 0;
	this.translateX = 0;
	this.dragDistance = 0;
	this.dragDuration = 0;
	this.isBuilt = false;

	this.build();
};

Carousel.prototype.build = function() {

	if( ! this.isBuilt ) {

		this._wrap = document.createElement( 'div' );
		this._element.parentElement.appendChild( this._wrap );
		this._wrap.appendChild( this._element );

		this._element.classList.add( this.options.loadedClass );
		this._firstSlide = this._slides[ 0 ];

		if( this.options.arrowButtons ) {

			this._prevButton = document.createElement( 'button' );
			this._prevButton.classList.add( this.options.previousArrowClass );
			
			this._nextButton = document.createElement( 'button' );
			this._nextButton.classList.add( this.options.nextArrowClass );

			this._wrap.appendChild( this._prevButton );
			this._wrap.appendChild( this._nextButton );
		}

		this.refresh();
		this.bindEvents();

		if( this.options.autoplay ) {
			this.play();
		}

		this.isBuilt = true;
	}

};

Carousel.prototype.destroy = function() {

	if( this.isBuilt ) {
		
		/*
		this.$element.unwrap();
		*/
		
		this._element.removeAttribute( 'style' );
		this._element.classList.remove( this.options.loadedClass );

		if( this.options.arrowButtons ) {

			removeElement( this._prevButton );
			removeElement( this._nextButton );
		}

		for( var i = 0; i < this._slides.length; i++ ) {
			this._slides[ i ].removeAttribute( 'style' );
			this._slides[ i ].classList.remove( this.options.activeSlideClass );
		}

		this.pause();
		this.unbindEvents();

		this.isBuilt = false;
	}
};

Carousel.prototype.bindEvents = function() {

	var that = this;

	var refresh = function( e ) {
		that.refresh();
	};

	var nextArrowClick = function( e ) {
		that.pause();
		that.goToNext();
	};

	var prevArrowClick = function( e ) {
		that.pause();
		that.goToPrevious();
	};

	var keyDown = function( e ) {
		if( e.keyCode === 37 ) {
			that.pause();
			that.goToPrevious();
		}
		else if( e.keyCode === 39 ) {
			that.pause();
			that.goToNext();
		}
	};

	var originalTranslateX,
		startPosX,
		startTime,
		isDragging
	;

	var dragStart = function( e ) {
		isDragging = true;
		
		var event = e;
		if( e.changedTouches ) {
			event = e.changedTouches[ 0 ];
		}
		originalTranslateX = that.translateX;
		startPosX = event.clientX;
		startTime = Date.now();
		that.setTransition( 'none' );
	};

	var dragMove = function( e ) {
		if( isDragging ) {
			var event = e;
			if( e.changedTouches ) {
				event = e.changedTouches[ 0 ];
			}
			that.dragDistance = event.clientX - startPosX;
			that.setTranslateX( originalTranslateX + ( that.dragDistance ) );
			e.preventDefault();
		}
	};

	var dragEnd = function( e ) {
		isDragging = false;
		that.setTransition( '' );
		that.setTransitionTimingFunction( '' );
		that.dragDuration = ( Date.now() - startTime );
		that.adjustScrollPosition();
		that.dragDistance = 0;
		that.dragDuration = 0;
	};

	window.addEventListener( 'resize', refresh );

	if( this.options.touchSwipe ) {

		this._wrap.addEventListener( 'touchstart', dragStart );
		this._wrap.addEventListener( 'touchmove', dragMove );
		this._wrap.addEventListener( 'touchend', dragEnd );
	}

	if( this.options.mouseSwipe ) {
		
		this._wrap.addEventListener( 'mousedown', dragStart );
		this._wrap.addEventListener( 'mousemove', dragMove );
		this._wrap.addEventListener( 'mouseup', dragEnd );
	}

	if( this.options.keyEvents ) {

		document.addEventListener( 'keydown',  keyDown );
	}

	if( this.options.arrowButtons ) {

		this._prevButton.addEventListener( 'click', prevArrowClick );
		this._nextButton.addEventListener( 'click', nextArrowClick );
	}
};

Carousel.prototype.unbindEvents = function() {

	window.removeEventListener( 'resize' );
	document.removeEventListener( 'keydown' );
};

Carousel.prototype.setTransition = function( transition ) {

	this._element.style.transition = transition;
	this._element.style.webkitTransition = transition;
	this._element.style.mozTransition = transition;
};

Carousel.prototype.setTransitionTimingFunction = function( easing ) {

	this._element.style.transitionTimingFunction = easing;
	this._element.style.mozTransitionTimingFunction = easing;
	this._element.style.webkitTransitionTimingFunction = easing;
};

Carousel.prototype.setTransitionDuration = function( n ) {

	this._element.style.transitionDuration = n + 'ms';
	this._element.style.mozTransitionDuration = n + 'ms';
	this._element.style.webkitTransitionDuration = n + 'ms';
};

Carousel.prototype.setTranslateX = function( n ) {

	this.translateX = n;

	this._element.style.transform = 'translate3d('+this.translateX+'px, 0, 0)';
	this._element.style.mozTransform = 'translate3d('+this.translateX+'px, 0, 0)';
	this._element.style.webkitTransform = 'translate3d('+this.translateX+'px, 0, 0)';
};

Carousel.prototype.adjustScrollPosition = function() {

	var absoluteDistance = Math.abs( this.dragDistance );

	if( absoluteDistance >  ( this.slideWidth * this.options.edgeFriction ) ) {

		var speed = ( this.dragDuration / absoluteDistance );
	
		this.setTransitionDuration( speed * 200 );

		var amountOfSlidesDragged = Math.ceil( absoluteDistance / this.slideWidth );

		if( this.dragDistance < 0 ) {
			if( this.isOnRightEdge ) {
				this.goTo( this.amountOfSlides - 1 );
			}
			else {
				this.goTo( this.activeSlideIndex + amountOfSlidesDragged );
			}
		}

		if( this.dragDistance > 0 ) {
			if( this.isOnLeftEdge ) {
				this.goTo( 0 );
			}
			else {
				this.goTo( this.activeSlideIndex - amountOfSlidesDragged );
			}
		}
	}
	else {
		this.goTo( this.activeSlideIndex );
	}
};

Carousel.prototype.refresh = function() {

	this.activeSlideIndex = 0;

	for( var i = 0; i < this._slides.length; i++ ) {
		this._slides[ i ].removeAttribute( 'style' );
	}

	this._wrap.removeAttribute( 'style' );
	this._element.removeAttribute( 'style' );

	this.elementWidth = this._element.offsetWidth;
	this.slideWidth = this._firstSlide.offsetWidth;
	this.slideHeight = this._firstSlide.offsetHeight;
	this.amountVisible = Math.ceil( this.elementWidth / this.slideWidth );
	this.totalWidth = ( this.amountOfSlides * this.slideWidth );

	this._wrap.style.width = this.elementWidth + 'px';
	this._wrap.style.position = 'relative';
	this._wrap.style.overflow = 'hidden';
	this._wrap.style.height = this.slideHeight + 'px';

	this._element.style.width = this.totalWidth + 'px';

	for( var i = 0; i < this._slides.length; i++ ) {
		this._slides[ i ].style.float = 'left';
		this._slides[ i ].style.width = this.slideWidth + 'px';
	}

	this.refreshState();
};

Carousel.prototype.refreshState = function() {

	for( var i = 0; i < this._slides.length; i++ ) {
		this._slides[ i ].classList.remove( this.options.activeSlideClass );
	}

	this._slides[ this.activeSlideIndex ].classList.add( this.options.activeSlideClass );

	this.isOnLeftEdge = ( this.activeSlideIndex === 0 );
	this.isOnRightEdge = ( ( this.amountOfSlides - this.activeSlideIndex ) <= this.amountVisible );

	this.refreshButtons();
};

Carousel.prototype.refreshButtons = function() {

	if( this.options.arrowButtons ) {

		this._prevButton.classList.remove( 'hide' );
		this._nextButton.classList.remove( 'hide' );

		if( this.isOnLeftEdge ) {
			this._prevButton.classList.add( 'hide' );
		}

		if( this.isOnRightEdge ) {
			this._nextButton.classList.add( 'hide' );
		}
	}
};

Carousel.prototype.goToNext = function() {

	this.goTo( this.activeSlideIndex + 1 );
};

Carousel.prototype.goToPrevious = function() {

	this.goTo( this.activeSlideIndex - 1 );
};

Carousel.prototype.goTo = function( n ) {

	if( n >= 0 && n < this.amountOfSlides ) {

		this.activeSlideIndex = n;

		var translateX = Math.max( -( this.activeSlideIndex * this.slideWidth ), -( this.totalWidth - this.elementWidth ) );
		translateX = Math.min( 0, translateX );

		this.setTranslateX( translateX );
		this.refreshState();
	}

	if( n < 0 ) {
		this.goTo( 0 );
	}

	if( n >= this.amountOfSlides ) {
		this.goTo( this.amountOfSlides - 1 );
	}
};

Carousel.prototype.play = function() {

	var that = this;

	this.playInterval = setInterval( function() {

		that.goToNext();

	}, this.options.playInterval );
};

Carousel.prototype.pause = function() {

	clearInterval( this.playInterval );
};

module.exports = Carousel;
