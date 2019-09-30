## Migration guide

### Migrating from v4 to v5

To support Internet Explorer include the `Element.prototype.classList` and `Array.from` polyfills in your project.

Expanders with the `shrinkTo` (`data-shrink-to`) option set to a number, to toggle a collapsing list, will now have `aria-hidden` set on collapsed items. No changes should be required.

The JavaScript options have been updated:

- `rootClassName` has been removed. Instead use `o-expander` classes for styles.
- `contentClassName` is now `contentSelector`.
- `toggleClassName` (`data-o-expander-class-name`) is now `toggleSelector` (`data-o-expander-toggle-selector`).
- `countSelector` (`data-o-expander-count-selector`) is now `itemSelector` (`data-o-expander-item-selector`).

The following functions are removed or now private, ensure your project doesn't call them:
- `toggleExpander` and `displayState`: use `toggle`, `collapse`, or `expand` methods instead.
- `ariaToggles`
- `configure`
- `emit`
- `hasStateDefined`
- `isRequired`

The data attribute `data-o-expander-js` has been replaced with the class `o-expander--initialised`. If your project is styling based on `[data-o-expander-js]`, update your css to use `.o-expander--initialised`.
