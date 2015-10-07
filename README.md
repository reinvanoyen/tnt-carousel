# tnt-carousel
## Super simple responsive carousel with touch support

Designed to be used with [browserify](http://www.browserify.org).

There's a huge amount of carousel scripts out there, I'm fully aware of that. But not many carousels work well with percentages, fluid layouts and media queries.
This carousel makes it possible to style your carousel like you want. If you want to have 2 slides in view, just style your childs to have a width of 50%.
If you want it to only have 1 slide in view on mobile, just style your childs to have a width of 100%. The carousel will adapt accordingly.

### Getting started

```ssh
$ npm install tnt-carousel
```

```javascript
var Carousel = require('tnt-carousel');
new Carousel($('#my-carousel'));
```

```html
<div id="my-carousel">
	<div>This is slide #1</div>
	<div>This is slide #2</div>
	<div>This is slide #3</div>
	<div>This is slide #4</div>
	<div>This is slide #5</div>
	<div>This is slide #6</div>
	<div>This is slide #7</div>
</div>
```

### Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
autoplay | boolean | false | Whether or not to automatically start playing once the carousel is built
autoplayInterval | int | 4000 | The time interval (in milliseconds) between each slide
touchEvents | boolean | true | Whether or not to use touch events
thresshold | number | 0.1 | Determines the distance (width of slide * thresshold) to swipe before it is registered as a request to a new slide. A value between 0.1 and 0.3 feels natural.
arrowButtons | boolean | true | Whether or not to automatically add a previous and next button
previousArrowClass | string | carousel-prev-button | If option arrowButtons is set to true, the previous arrow will have this class assigned
nextArrowClass | string | carousel-next-button | If option arrowButtons is set to true, the next arrow will have this class assigned
loadedClass | string | loaded | When the carousel is built it will have this class assigned
activeSlideClass | string | active | The currently active slide will have this class assigned

### Methods

#### destroy

Destroys a carousel after it's been built. This restores the DOM to it's original state.

```javascript
	carousel.destroy();
```

#### build

Build the carousel. Gets called automatically upon creating an instance. Useful to rebuild previously destroyed carousels.

```javascript
	var carousel = new Carousel($('#my-carousel'));
	carousel.destroy();
	carousel.build();
```

#### goTo

Slide to a certain slide

```javascript
	carousel.goTo( 3 );
```

#### play

Automatically go from one slide to the other

```javascript
	carousel.play();
```

#### pause

Pause the carousel if it's playing

```javascript
	carousel.pause();
```
