(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Carousel = require('../src/carousel.js');

var carousel = new Carousel(document.querySelector('.carousel'), {
	autoplay: false,
	mouseSwipe: false,
	arrowButtonsContainer: document.querySelector('body')
});

},{"../src/carousel.js":4}],2:[function(require,module,exports){
"use strict";

var util = require( './util' );

class TntDomElement {

	constructor( arg ) {

		if( arg instanceof TntDomElement )
		{
			return arg;
		}

		if( typeof arg === 'string' ) {

			if( util.isHtmlString( arg ) ) {

				let wrap = document.createElement( 'div' );
				wrap.innerHTML = arg;
				return new TntDomElement( wrap.childNodes );

			} else {

				return new TntDomElement( document.querySelectorAll( arg ) );
			}
		}

		this.elements = [];

		if( arg instanceof HTMLElement ) {

			this.elements.push( arg );

		} else if( arg instanceof HTMLCollection || arg instanceof NodeList ) {

			for( var i = 0; i < arg.length; i++ )
			{
				this.elements.push( arg[ i ] );
			}

		} else {

			throw "Invalid argument for constructor";
		}

		return this;
	}

	forEach( cb ) {

		this.elements.forEach( e => {

			cb( e );
		} );
	}

	length() {

		return this.elements.length;
	}

	html( htmlString ) {

		this.forEach( e => {

			e.innerHTML = htmlString;
		} );

		return this;
	}

	addClass( classname ) {

		this.forEach( e => {

			e.classList.add( classname );
		} );

		return this;
	}

	removeClass( classname ) {

		this.forEach( e => {

			e.classList.remove( classname );
		} );

		return this;
	}

	css( property, value ) {


		this.forEach( e => {

			e.style[ property ]= value;
		} );

		return this;
	}

	remove() {

		this.forEach( e => {

			e && e.parentNode && e.parentNode.removeChild( e );
		} );

		return this;
	}

	get( i ) {

		if( typeof this.elements[ i ] !== 'undefined' ) {

			return this.elements[ i ];
		}

		throw "Could not get element with index " + i;
	}

	append( element ) {

		element = new TntDomElement( element );

		let first = this.get( 0 );

		element.forEach( e => {

			first.appendChild( e );
		} );
	}

	appendTo( element ) {

		let first = element.get( 0 );

		this.forEach( e => {

			first.appendChild( e );
		} );
	}

	copy() {

		let html = '';

		this.forEach( e => {

			html += e.outerHTML;
		} );

		return new TntDomElement( html );
	}

	insertBefore( element ) {

		let first = element.get( 0 );

		this.forEach( e => {

			first.parentNode.insertBefore( e, first );
		} );
	}

	wrap( element ) {

		element = new TntDomElement( element );
		element.insertBefore( this );
		this.appendTo( element );
	}

	click( cb ) {

		return this.bind( 'click', cb );
	}

	bind( eventName, cb ) {

		this.forEach( e => {

			e.addEventListener( eventName, cb );
		} );

		return this;
	}
}

module.exports = TntDomElement;
},{"./util":3}],3:[function(require,module,exports){
var util = {};

util.isHtmlString = function( string ) {

	return /<[a-z][\s\S]*>/i.test( string );
};

module.exports = util;
},{}],4:[function(require,module,exports){
/*

tnt-carousel
------------

Author: Rein Van Oyen <rein@tnt.be>
Website: http://www.tnt.be
Repo: http://github.com/reinvanoyen/tnt-carousel
Issues: http://github.com/reinvanoyen/tnt-carousel/issues

*/

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tnt = require('tnt-dom');
var util = require('./util');
var defaultOptions = require('./defaults');

var Carousel = function () {
	function Carousel(element, options) {
		_classCallCheck(this, Carousel);

		this.el = element;
		this.options = util.extend(defaultOptions, options);

		this.setup();
	}

	_createClass(Carousel, [{
		key: 'setup',
		value: function setup() {

			this.children = new tnt(this.el.children);
			this.slideCount = this.children.length();

			this.refresh();
			this.build();
			this.refreshBuild();

			this.slideTo(0);
		}
	}, {
		key: 'refresh',
		value: function refresh() {

			var firstSlide = this.children.get(0);

			this.slideHeight = firstSlide.offsetHeight;
			this.slideWidth = firstSlide.offsetWidth;

			//
			this.visibleSlideCount = Math.floor(this.el.offsetWidth / this.slideWidth);

			// Wrap width
			this.wrapWidth = this.slideWidth * this.slideCount;

			// Resize each child
			this.children.css('height', this.slideHeight + 'px');
			this.children.css('width', this.slideWidth + 'px');
		}
	}, {
		key: 'build',
		value: function build() {

			this.wrap = new tnt('<div class="tnt-carousel-wrap">');
			this.children.wrap(this.wrap);
		}
	}, {
		key: 'refreshBuild',
		value: function refreshBuild() {

			this.wrap.css('width', this.wrapWidth + 'px');
			this.wrap.css('height', this.slideHeight + 'px');
			this.wrap.css('overflow', 'hidden');
		}
	}, {
		key: 'slideTo',
		value: function slideTo(index) {

			var offset = this.slideWidth * index;
			this.wrap.css('transform', 'translateX(-' + offset + 'px)');
		}
	}]);

	return Carousel;
}();

module.exports = Carousel;

},{"./defaults":5,"./util":6,"tnt-dom":2}],5:[function(require,module,exports){
"use strict";

module.exports = {
	autoplay: false,
	playInterval: 4000,
	touchSwipe: true,
	mouseSwipe: true,
	keyEvents: false,
	arrowButtons: true,
	arrowButtonsContainer: null,
	previousArrowClass: 'carousel-prev-button',
	nextArrowClass: 'carousel-next-button',
	inactiveArrowClass: 'hide',
	loadedClass: 'loaded',
	activeSlideClass: 'active',
	edgeFriction: .1
};

},{}],6:[function(require,module,exports){
'use strict';

var util = {};

util.proxy = function (c, f) {

	var args = Array.prototype.slice.call(arguments, 2);

	return function () {

		return f.apply(c, args.concat(Array.prototype.slice.call(arguments)));
	};
};

util.extend = function (defaults, options) {

	var extended = {};
	var prop;

	for (prop in defaults) {

		if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
			extended[prop] = defaults[prop];
		}
	}

	for (prop in options) {

		if (Object.prototype.hasOwnProperty.call(options, prop)) {
			extended[prop] = options[prop];
		}
	}

	return extended;
};

util.removeElement = function (element) {

	element && element.parentNode && element.parentNode.removeChild(element);
};

util.loadImages = function (_images, callback) {

	var amountLoaded = 0,
	    amountToLoad = _images.length;

	if (amountToLoad === 0) {
		callback();
	}

	for (var i = 0; i < _images.length; i++) {

		var image = new Image();

		image.onload = function () {

			amountLoaded++;

			if (amountLoaded === amountToLoad) {

				callback();
			}
		};

		image.src = _images[i].getAttribute('src');
	}
};

module.exports = util;

},{}]},{},[1]);
