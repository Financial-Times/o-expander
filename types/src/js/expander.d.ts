export default Expander;
declare class Expander extends ExpanderUtility {
    /**
     * Construct a custom expander. Useful to add customised expander
     * functionality to a component. E.g. to animate away collapsed items
     * rather than hide them immediately.
     *
     * @param {HTMLElement} oExpanderElement - The expander element in the DOM.
     * @param {Object} opts [{}] - An options object for configuring the expander @see ExpanderUtility.
     */
    static createCustom(oExpanderElement: HTMLElement, opts: any): ExpanderUtility;
    /**
     * Initialise the component.
     * @param {(HTMLElement|String)} rootElement - The root element to initialise the component in, or a CSS selector for the root element
     * @param {Object} opts [{}] - An options object for configuring the component
     * @returns {(Expander|Array<Expander>)} - Expander instance(s)
     */
    static init(rootEl: any, opts: any): (Expander | Array<Expander>);
    /**
     * Get the data attributes from the ExpanderElement. If the component is being set up
     * declaratively, this method is used to extract the data attributes from the DOM.
     * @param {HTMLElement} oExpanderElement - The component element in the DOM
     * @returns {Object} - Data attributes as an object
     * @access private
     */
    static _getDataAttributes(oExpanderElement: HTMLElement): any;
    /**
     * o-expander constructor.
     * @param {HTMLElement} oExpanderElement - The component element in the DOM
     * @param {Object} opts - An options object for configuring the component.
     * @param {String|Number} opts.shrinkTo ['height'] - The expander collapse method, "height", "hidden", or a number of items.
     * @param {String|Number} opts.toggleState ['all'] - How to update the expander toggles: "all" to update text and aria-expanded attributes, "aria" to update only aria-expanded attributes, "none" to avoid updating toggles on click.
     * @param {String} opts.itemSelector ['li'] - A selector for the expandable items when `shrinkTo` is set to a number, relative to `.o-expander__content`.
     * @param {String} opts.expandedToggleText ['fewer'] - Toggle text for when the expander is collapsed. Defaults to "fewer", or "less" when `shrinkTo` is "height", or "hidden" when `shrinkTo` is "hidden".
     * @param {String} opts.collapsedToggleText ['more'] - Toggle text for when the expander is collapsed. Defaults to "more" or "show" when `shrinkTo` is "hidden".
     */
    constructor(oExpanderElement: HTMLElement, opts: {
        shrinkTo: string | number;
        toggleState: string | number;
        itemSelector: string;
        expandedToggleText: string;
        collapsedToggleText: string;
    });
}
import ExpanderUtility from "./expander-utility.js";
