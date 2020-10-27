export default ExpanderUtility;
declare class ExpanderUtility {
    /**
     * Class constructor.
     * @param {HTMLElement} oExpanderElement - The component element in the DOM
     * @param {Object} opts - An options object for configuring the component.
     * @param {String|Number} opts.shrinkTo ['height'] - The expander collapse method, "height", "hidden", or a number of items.
     * @param {String|Number} opts.toggleState ['all'] - How to update the expander toggles: "all" to update text and aria-expanded attributes, "aria" to update only aria-expanded attributes, "none" to avoid updating toggles on click.
     * @param {String} opts.expandedToggleText ['fewer'] - Toggle text when the expander is collapsed. Defaults to "fewer", or "less" when `shrinkTo` is "height", or "hidden" when `shrinkTo` is "hidden".
     * @param {String} opts.collapsedToggleText ['more'] - Toggle text when the expander is collapsed. Defaults to "more" or "show" when `shrinkTo` is "hidden".
     * @param {Object} opts.selectors - The selectors for expander elements.
     * @param {String} opts.selectors.toggle - A selector for the expanders toggles e.g. `.my-expander__toggle`.
     * @param {String} opts.selectors.content - A selector for the expanders content, which will collapse or expand e.g. `.my-expander__content`.
     * @param {String} opts.selectors.item - A selector for the items within the expander content e.g. `li` (required only when `shrinkTo` is set to a number).
     * @param {Object} opts.classnames - The classnames to apply to the expander for different states.
     * @param {String} opts.classnames.initialized - The class to apply to the top level of the expander when initialised by JS e.g. `.my-expander--initialized`.
     * @param {String} opts.classnames.inactive - The class to apply to the top level of the expander when it can not expand or collapse e.g. `.my-expander--inactive`.
     * @param {String} opts.classnames.expanded - The class to apply to the expander content when it is expanded e.g. `.my-expander--expanded`.
     * @param {String} opts.classnames.collapsed - The class to apply to the expander content when it is collapsed JS e.g. `.my-expander--collapsed`.
     * @param {String} opts.classnames.collapsibleItem - The class to apply to any item (see the `selectors.item` option) which will be hidden when collapsed e.g. `.my-expander__collapsible-item` (required only when `shrinkTo` is set to a number).
     */
    constructor(oExpanderElement: HTMLElement, opts: {
        shrinkTo: string | number;
        toggleState: string | number;
        expandedToggleText: string;
        collapsedToggleText: string;
        selectors: {
            toggle: string;
            content: string;
            item: string;
        };
        classnames: {
            initialized: string;
            inactive: string;
            expanded: string;
            collapsed: string;
            collapsibleItem: string;
        };
    });
    _currentState: boolean;
    options: any;
    oExpanderElement: HTMLElement;
    contentElement: any;
    toggles: any;
    id: any;
    /**
     * Recalculate and apply the styles to expand or collapse the expander
     * according to its current state.
     * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.expand` or `oExpander.collapse` events.
     */
    apply(isSilent: boolean): void;
    /**
     * Toggle the expander so expands or, if it's already expanded, collapses.
     */
    toggle(): void;
    /**
     * Expand the expander.
     * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.expand` event.
     */
    expand(isSilent: boolean): void;
    /**
     * Collapse the expander.
     * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.collapse` event.
     */
    collapse(isSilent: boolean): void;
    /**
     * Return true if the expander is currently collapse.
     * @returns {Boolean}
     */
    isCollapsed(): boolean;
    /**
     * Remove the expander from the page.
     */
    destroy(): void;
    /**
     * @returns {Array<Element>} - All collapseable content items.
     */
    _getCollapseableItems(): Array<Element>;
    /**
     * @returns {Array<Element>} - All content items.
     */
    _getItems(): Array<Element>;
    /**
     * Return whether the expander has something to hide / show.
     * i.e. if expanding/collapsing would do anything.
     * @returns {Boolean}
     * @access private
     */
    _isActive(): boolean;
    /**
     * Expand or collapse the expander.
     * @param {Boolean} state "expand" or "collapse".
     * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.collapse` or `oExpander.expand` events.
     * @access private
     */
    _setExpandedState(state: boolean, isSilent: boolean): void;
    /**
     * Fire a bubbling o-expander event with the correct namespace.
     * @param {string} name The event name. E.g. "example" will fire an "oExpander.example" event.
     * @access private
     */
    _dispatchEvent(name: string): void;
}
