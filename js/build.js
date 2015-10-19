!function t(e,i,s){function n(r,a){if(!i[r]){if(!e[r]){var h="function"==typeof require&&require;if(!a&&h)return h(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var d=i[r]={exports:{}};e[r][0].call(d.exports,function(t){var i=e[r][1][t];return n(i?i:t)},d,d.exports,t,e,i,s)}return i[r].exports}for(var o="function"==typeof require&&require,r=0;r<s.length;r++)n(s[r]);return n}({1:[function(t,e,i){"use strict";var s=t("../src/Carousel.js");new s(document.querySelector(".carousel"))},{"../src/Carousel.js":2}],2:[function(t,e,i){"use strict";var s=function(t){t&&t.parentNode&&t.parentNode.removeChild(t)},n=function(t,e){var i=0,s=t.length;0===s&&e();for(var n=0;n<t.length;n++){var o=new Image;o.onload=function(){i++,i===s&&e()},o.src=t[n].getAttribute("src")}},o=function(t,e){e=e||{},this.options={autoplay:e.autoplay||!1,playInterval:e.playinterval||4e3,touchSwipe:e.touchSwipe||!0,mouseSwipe:e.mouseSwipe||!0,keyEvents:e.keyEvents||!1,arrowButtons:e.arrowButtons||!0,previousArrowClass:e.previousArrowClass||"carousel-prev-button",nextArrowClass:e.nextArrowClass||"carousel-next-button",inactiveArrowClass:e.inactiveArrowClass||"hide",loadedClass:e.loadedClass||"loaded",activeSlideClass:e.activeSlideClass||"active",edgeFriction:e.edgeFriction||.1},this._element=t,this._slides=this._element.children,this.amountOfSlides=this._slides.length,this.activeSlideIndex=0,this.translateX=0,this.dragDistance=0,this.dragDuration=0,this.isBuilt=!1;var i=this;this.amountOfSlides>0&&n(this._element.getElementsByTagName("img"),function(){i.build()})};o.prototype.build=function(){this.isBuilt||(this._wrap=document.createElement("div"),this._element.parentElement.insertBefore(this._wrap,this._element),this._wrap.appendChild(this._element),this._element.classList.add(this.options.loadedClass),this._firstSlide=this._slides[0],this.options.arrowButtons&&(this._prevButton=document.createElement("button"),this._prevButton.classList.add(this.options.previousArrowClass),this._nextButton=document.createElement("button"),this._nextButton.classList.add(this.options.nextArrowClass),this._wrap.appendChild(this._prevButton),this._wrap.appendChild(this._nextButton)),this.refresh(),this.bindEvents(),this.options.autoplay&&this.play(),this.isBuilt=!0)},o.prototype.destroy=function(){if(this.isBuilt){this._element.removeAttribute("style"),this._element.classList.remove(this.options.loadedClass),this.options.arrowButtons&&(s(this._prevButton),s(this._nextButton));for(var t=0;t<this._slides.length;t++)this._slides[t].removeAttribute("style"),this._slides[t].classList.remove(this.options.activeSlideClass);this.pause(),this.unbindEvents(),this.isBuilt=!1}},o.prototype.bindEvents=function(){var t,e,i,s,n=this,o=function(t){n.refresh()},r=function(t){n.pause(),n.goToNext()},a=function(t){n.pause(),n.goToPrevious()},h=function(t){37===t.keyCode?(n.pause(),n.goToPrevious()):39===t.keyCode&&(n.pause(),n.goToNext())},l=function(o){s=!0;var r=o;o.changedTouches&&(r=o.changedTouches[0]),t=n.translateX,e=r.clientX,i=Date.now(),n.setTransition("none")},d=function(i){if(s){var o=i;i.changedTouches&&(o=i.changedTouches[0]),n.dragDistance=o.clientX-e,n.setTranslateX(t+n.dragDistance),i.preventDefault()}},u=function(t){s=!1,n.setTransition(""),n.setTransitionTimingFunction(""),n.dragDuration=Date.now()-i,n.adjustScrollPosition(),n.dragDistance=0,n.dragDuration=0};window.addEventListener("resize",o),this.options.touchSwipe&&(this._wrap.addEventListener("touchstart",l),this._wrap.addEventListener("touchmove",d),this._wrap.addEventListener("touchend",u)),this.options.mouseSwipe&&(this._wrap.addEventListener("mousedown",l),this._wrap.addEventListener("mousemove",d),this._wrap.addEventListener("mouseup",u)),this.options.keyEvents&&document.addEventListener("keydown",h),this.options.arrowButtons&&(this._prevButton.addEventListener("click",a),this._nextButton.addEventListener("click",r))},o.prototype.unbindEvents=function(){window.removeEventListener("resize"),document.removeEventListener("keydown")},o.prototype.setTransition=function(t){this._element.style.transition=t,this._element.style.MozTransition=t,this._element.style.webkitTransition=t,this._element.style.msTransition=t,this._element.style.OTransition=t},o.prototype.setTransitionTimingFunction=function(t){this._element.style.transitionTimingFunction=t,this._element.style.MozTransitionTimingFunction=t,this._element.style.webkitTransitionTimingFunction=t,this._element.style.msTransitionTimingFunction=t,this._element.style.OTransitionTimingFunction=t},o.prototype.setTransitionDuration=function(t){this._element.style.transitionDuration=t+"ms",this._element.style.MozTransitionDuration=t+"ms",this._element.style.webkitTransitionDuration=t+"ms",this._element.style.msTransitionDuration=t+"ms",this._element.style.OTransitionDuration=t+"ms"},o.prototype.setTranslateX=function(t){this.translateX=t,this._element.style.transform="translate3d("+this.translateX+"px, 0, 0)",this._element.style.MozTransform="translateX("+this.translateX+"px)",this._element.style.webkitTransform="translate3d("+this.translateX+"px, 0, 0)",this._element.style.msTransform="translateX("+this.translateX+"px)",this._element.style.OTransform="translateX("+this.translateX+"px)"},o.prototype.adjustScrollPosition=function(){var t=Math.abs(this.dragDistance);if(t>this.slideWidth*this.options.edgeFriction){var e=this.dragDuration/t;this.setTransitionDuration(200*e);var i=Math.ceil(t/this.slideWidth);this.dragDistance<0&&(this.isOnRightEdge?this.goTo(this.amountOfSlides-1):this.goTo(this.activeSlideIndex+i)),this.dragDistance>0&&(this.isOnLeftEdge?this.goTo(0):this.goTo(this.activeSlideIndex-i))}else this.goTo(this.activeSlideIndex)},o.prototype.refresh=function(){this.activeSlideIndex=0;for(var t=0;t<this._slides.length;t++)this._slides[t].removeAttribute("style");this._wrap.removeAttribute("style"),this._element.removeAttribute("style"),this.elementWidth=this._element.offsetWidth,this.slideWidth=this._firstSlide.offsetWidth,this.slideHeight=this._firstSlide.offsetHeight,this.amountVisible=Math.ceil(this.elementWidth/this.slideWidth),this.totalWidth=this.amountOfSlides*this.slideWidth,this._wrap.style.width=this.elementWidth+"px",this._wrap.style.position="relative",this._wrap.style.overflow="hidden",this._wrap.style.height=this.slideHeight+"px",this._element.style.width=this.totalWidth+"px";for(var t=0;t<this._slides.length;t++)this._slides[t].style["float"]="left",this._slides[t].style.width=this.slideWidth+"px";this.refreshState()},o.prototype.refreshState=function(){for(var t=0;t<this._slides.length;t++)this._slides[t].classList.remove(this.options.activeSlideClass);this._slides[this.activeSlideIndex].classList.add(this.options.activeSlideClass),this.isOnLeftEdge=0===this.activeSlideIndex,this.isOnRightEdge=this.amountOfSlides-this.activeSlideIndex<=this.amountVisible,this.refreshButtons()},o.prototype.refreshButtons=function(){this.options.arrowButtons&&(this._prevButton.classList.remove("hide"),this._nextButton.classList.remove("hide"),this.isOnLeftEdge&&this._prevButton.classList.add("hide"),this.isOnRightEdge&&this._nextButton.classList.add("hide"))},o.prototype.goToNext=function(){this.goTo(this.activeSlideIndex+1)},o.prototype.goToPrevious=function(){this.goTo(this.activeSlideIndex-1)},o.prototype.goTo=function(t){if(t>=0&&t<this.amountOfSlides){this.activeSlideIndex=t;var e=Math.max(-(this.activeSlideIndex*this.slideWidth),-(this.totalWidth-this.elementWidth));e=Math.min(0,e),this.setTranslateX(e),this.refreshState()}0>t&&this.goTo(0),t>=this.amountOfSlides&&this.goTo(this.amountOfSlides-1)},o.prototype.play=function(){var t=this;this.playInterval=setInterval(function(){t.goToNext()},this.options.playInterval)},o.prototype.pause=function(){clearInterval(this.playInterval)},e.exports=o},{}]},{},[1]);