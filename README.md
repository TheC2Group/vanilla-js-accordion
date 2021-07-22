accordion
=========

> Accessible accordion using CSS transition to expand and contract. Aria states are automatically added.


To get Started
--------------

### CommonJS

```
$ npm install vanilla-js-accordion
```

```js
var Accordion = require('vanilla-js-accordion');
```

### Browser Global

```html
<script src="iife/accordion.js"></script>
```


Basic Example
-------------

```html
<div class="Accordion">
    <div class="item" data-status="contracted">
        <div class="target">...</div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target">...</div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target">...</div>
        <div class="panel">...</div>
    </div>
</div>
```

```js
// This wouldn't be necessary since all these options are the defaults
var options = {
    item: '.item',
    target: '.target',
    control: '.target', // in this case the target is also acting as the control
    panel: '.panel',
    allowMultiple: true,
    attribute: 'data-status',
    expanded: 'expanded',
    contracted: 'contracted',
    prefix: 'Accordion-',
    transition: 'height .3s',
    setFocus: 'none', // options: none, item, panel, target, control, first
    hashEnabled: true // use hash in URL to open accordion item
};

new Accordion('.Accordion', options);
```

Since the height of the "control" and the height of the "panel" make up the height of the item. It is sometimes not the case that the "target" is the same as the "control". If you want an item to be open on page load, change the data-status to "expanded". Below is an example of this:

```html
<div class="Accordion">
    <div class="item" data-status="expanded">
        <div class="control">
            <a class="target" href="#">...</a>
        </div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="control">
            <a class="target" href="#">...</a>
        </div>
        <div class="panel">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="control">
            <a class="target" href="#">...</a>
        </div>
        <div class="panel">...</div>
    </div>
</div>
```

```js
new Accordion('.Accordion', {
    control: '.control'
});
```

Example with Custom IDs
-----------------------

Add an ID to each accordion target and an aria-labelledby attribute to each panel.

```html
<div class="Accordion">
    <div class="item" data-status="contracted">
        <div class="target" id="Uno">...</div>
        <div class="panel" aria-labelledby="Uno">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" id="Dos">...</div>
        <div class="panel" aria-labelledby="Dos">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" id="Tres">...</div>
        <div class="panel" aria-labelledby="Tres">...</div>
    </div>
</div>
```

API
---

```js
var accordion = new Accordion(document.querySelector('.Example1'));

accordion.activate(0);    // toggles accordion to the index
accordion.expand(0);      // expands accordion to the index
accordion.contract(0);    // contracts accordion to the index
accordion.contractAll(0); // contracts all the accordions, the optional parameter is an index that gets ignored
accordion.expandAll();    // expands all the accordions
accordion.destroy()       // removes event listeners and aria properties
```

Accessibility
-------------

[http://www.w3.org/TR/wai-aria-practices/#accordion](http://www.w3.org/TR/wai-aria-practices/#accordion)

Here is what the markup looks like after accessibility is added with JavaScript. It may be beneficial to add the aria attributes before JavaScript runs.

```html
<div class="Accordion" role="tablist" aria-multiselectable="true">
    <div class="item" data-status="expanded">
        <div class="target" role="tab" aria-expanded="true" tabindex="0" id="Accordion-1-1">...</div>
        <div class="panel" role="tabpanel" aria-hidden="false" aria-labelledby="Accordion-1-1">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" tabindex="0" id="Accordion-1-2">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" aria-labelledby="Accordion-1-2">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" tabindex="0" id="Accordion-1-3">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" aria-labelledby="Accordion-1-3">...</div>
    </div>
</div>
```

Or if `allowMultiple` is set to `false`.

```html
<div class="Accordion" role="tablist">
    <div class="item" data-status="expanded">
        <div class="target" role="tab" aria-expanded="true" aria-selected="true" tabindex="0" id="Accordion-2-1">...</div>
        <div class="panel" role="tabpanel" aria-hidden="false" aria-labelledby="Accordion-2-1">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" aria-selected="false" tabindex="0" id="Accordion-2-2">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" aria-labelledby="Accordion-2-2">...</div>
    </div>
    <div class="item" data-status="contracted">
        <div class="target" role="tab" aria-expanded="false" aria-selected="false" tabindex="0" id="Accordion-2-3">...</div>
        <div class="panel" role="tabpanel" aria-hidden="true" aria-labelledby="Accordion-2-3">...</div>
    </div>
</div>
```

For Developers Working on this Module
-------------------------------------

* After you pull down the project, run `npm install` to get all of the node modules
* You will want to work in the accordion.js file in the root
* To compile your changes, run `npm run build` (creates the CJS, IIFE and UMD versions of the module), then `npm run bundle-example` (creates the example file)
* To test your changes, open example/index.html in a browser


License
-------

MIT © [The C2 Group](https://c2experience.com)
