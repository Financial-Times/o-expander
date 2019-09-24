## Migration guide

### Migrating from v4 to v5

To support Internet Explorer include the `Element.prototype.classList` and `Array.from` polyfills in your project.

The JavaScript options have been updated:

- `rootClassName` has been removed. Instead use `o-expander` classes for styles.
- `contentClassName` is now `contentSelector`.
- `toggleClassName` (`data-o-expander-class-name`) is now `toggleSelector` (`data-o-expander-toggle-selector`).

The following functions are removed or now private, ensure your project doesn't call them:
- `toggleExpander` and `displayState`: use `toggle`, `collapse`, or `expand` methods instead.
- `ariaToggles`
- `configure`
- `emit`
- `hasStateDefined`
- `isRequired`