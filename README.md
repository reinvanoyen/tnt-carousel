# tnt-carousel
### Super simple carousel with touch support

More documentation coming soon!

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
arrowButtons | boolean | true | Whether or not to automatically add a previous and next button
