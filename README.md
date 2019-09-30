# o-expander [![Build Status](https://circleci.com/gh/Financial-Times/o-expander.png?style=shield&circle-token=0342cb593ceeb278037288a5f7a4745990b9517b)](https://circleci.com/gh/Financial-Times/o-expander) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](#licence)

Accessible, content-aware component for expanding and collapsing content.

- [Markup](#markup)
- [JavaScript](#javascript)
- [Sass](#sass)
- [Options](#options)
- [Contact](#contact)
- [Licence](#licence)

## Markup

The  `o-expander` component has a content element `o-expander__content` (the DOM to expand and collapse) and toggle elements `o-expander__toggle` (the triggers to toggle the expander).

`o-expander__toggle` and `o-expander__content` can be put anywhere within `o-expander` as long as `o-expander__toggle` is not contained within `o-expander__content`. There are no restrictions on sibling markup.

```html
<div data-o-component="o-expander" class="o-expander">
    <div class="o-expander__content">
      <!-- Some content to expand and collapse. -->
    </div>
    <button class="o-expander__toggle">Toggle Content</button>
</div>
```

### Height Expander

By default the expander is based on height. Set the `max-height` of your collapsed expander using a custom class like `my-example-expander` below. `o-expander` will remove your `max-height` when the toggle is clicked to expand the expander.

```diff
-<div data-o-component="o-expander" class="o-expander">
+<div data-o-component="o-expander" class="o-expander my-example-expander">
    <div class="o-expander__content">
      <!-- Some content to expand and collapse. -->
    </div>
    <button class="o-expander__toggle">Toggle Content</button>
</div>
```

```css
// Set the height to 30% the viewport width (this is for demo purposes and could
// be any height). Only apply a max-height when the expander has the
// `o-expander--initialised` class for progressive enhancement, so when
// JavaScript fails content isn't hidden.
.o-expander--initialised.my-example-expander {
  max-height: 30vh;
}
```

### Item Count Expander

The expander may also be based on the number of items within `o-expander__content`. For example, to show only two items within a list: Set `o-expander__content` on your collapsing list (`ul` or `ol`), and specify the number of items to collapse to with the `data-o-expander-shrink-to` data attribute.

```diff
-	<div data-o-component="o-expander" class="o-expander">
+	<div data-o-component="o-expander" class="o-expander" data-o-expander-shrink-to="2">
		<h2>Collapsing to number of items in a list</h2>
		<ul class="o-expander__content">
			<li>item</li>
			<li>item</li>
			<li>item</li> // hidden when collapsed
			<li>item</li> // hidden when collapsed
			<li>item</li> // hidden when collapsed
		</ul>
		<button class="o-expander__toggle">Toggle Content</button>
	</div>
```

### Hidden Expander

The expander may also toggle the visibility of `o-expander__content` entirely. Set `data-o-expander-shrink-to` to `hidden`.

```diff
-	<div data-o-component="o-expander" class="o-expander">
+	<div data-o-component="o-expander" class="o-expander" data-o-expander-shrink-to="hidden">
		<h2>Collapsing to number of items in a list</h2>
		<div class="o-expander__content">
			<!-- Some content to entirely hide/show. -->
		</div>
		<button class="o-expander__toggle">Toggle Content</button>
	</div>
```

## JavaScript

### Static methods

#### `init(el, opts)`
This generally sticks to the [usual origami convention](http://origami.ft.com/docs/syntax/js/#initialisation). If `el` is an HTMLElement with the attribute `data-o-component="o-expander"` a single instance will be created for that element and returned, otherwise an expander will be created for each `o-expander` element found within `el`, and an array of instances returned.

### Instance methods

#### `destroy()`
Destroys an o-expander instance and removes all event listeners

### Events

o-expander fires the following events, which always fire before any repainting/layout occurs

  * `oExpander.init` - fires when the expander has initialised
  * `oExpander.expand` - fires when the expander expands
  * `oExpander.collapse` - fires when the expander collapses

## Sass

  * If you want to use the default classes, turn silent mode off before importing it: `$o-expander-is-silent: false;`
  * By default o-expander will collapse content on initialisation. To prevent this add the class `.o-expander__content--expanded`
  * Maximum height (when collapsed) should be set using css. Be mindful that when js doesn't run you may want to default to showing all the content e.g.

    ```scss
    .o--if-js .o-expander__content { // ensures all content is shown when js doesn't run
        max-height: 50px;
    }

    .o-expander__content { // collapses content when js doesn't run
        max-height: 50px;
    }
    ```

  * Animation and other fancy behaviour can be added using css and by listening to the events outlined above.

## Options

All the following can be passed in an options object in the second parameter of `oExpander#init()` or as data-attributes (hyphenated and prefixed by `o-expander` e.g. `data-o-expander-shrink-to="height"`)

  * `shrinkTo` [`'height'`]: A non-negative integer, indicating the number of items to show when collapsed, or the string `'height'`, which will collapse to a max-height defined in the CSS, or `'hidden'` which will use `aria-hidden` (rather than `aria-expanded`) to completely hide the content when collapsed
  * `countSelector` [`'.o-expander__content > li'`]: Selector for identifying items to count, relative to `.o-expander`
  * `expandedToggleText` [`'less|fewer'`]: Text to show on toggle link or button when expanded (defaults to fewer when in count mode, or less when in height mode). Accepts empty strings
  * `collapsedToggleText` [`'more'`]: Text to show on toggle link or button when collapsed. Accepts empty strings
  * `toggleSelector`[`'.o-expander__toggle'`]: Selector for expand/collapse toggle link or button. When using the default selector some styling, with an arrow icon, will come for free. If the selector matches more than one element they will all have the ability to expand/collapse the expander
  * `contentClassName` [`'o-expander__content'`]: Class name used in the content element of the component
  * `toggleClassName` [`'o-expander__toggle'`]: Class name used in the toggle element of the component
  * `toggleState`[`'all|aria|none'`]: Do you want the expander to update the link or button's text and `aria-expanded` attribute, just the aria attribute or neither (defaults to `all`)

## Migration

State | Major Version | Last Minor Release | Migration guide |
:---: | :---: | :---: | :---:
✨ active | 5 | N/A  | [migrate to v5](MIGRATION.md#migrating-from-v4-to-v5) |
⚠ maintained | 4 | 4.7  | - |
╳ deprecated | 3 | 3.0  | - |
╳ deprecated | 2 | 2.0 | - |
╳ deprecated | 1 | 1.4 | - |

## Contact

If you have any questions or comments about this component, or need help using it, please either [raise an issue](https://github.com/Financial-Times/o-expander/issues), visit [#ft-origami](https://financialtimes.slack.com/messages/ft-origami/) or email [Origami Support](mailto:origami-support@ft.com).

---

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
