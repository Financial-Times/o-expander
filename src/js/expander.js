import ExpanderUtility from './expander-utility';

class Expander extends ExpanderUtility {

	/**
	 * o-expander constructor.
	 * @param {HTMLElement} [oExpanderElement] - The component element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component
	 */
	constructor (oExpanderElement, opts) {
		super(oExpanderElement, Object.assign({
			selectors: {
				toggle: '.o-expander__toggle',
				content: '.o-expander__content',
				contentItem: '.o-expander__content > li',
			},
			classnames: {
				initialised: 'o-expander__content--initialised',
				inactive: 'o-expander__content--inactive',
				expanded: 'o-expander__content--expanded',
				collapsed: 'o-expander__content--collapsed',
				collapsibleItem: 'o-expander__collapsible-item'
			}
		}, opts || Expander._getDataAttributes(oExpanderElement)));
	}

	/**
	 * Construct a custom expander. Useful to add customised expander
	 * functionality to a component. E.g. to animate away collapsed items
	 * rather than hide them immediately.
	 *
	 * @param {HTMLElement} [oExpanderElement] - The expander element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component, including custom class names.
	 */
	static createCustom(oExpanderElement, opts) {
		return new ExpanderUtility(oExpanderElement, opts);
	}

	/**
	 * Initialise the component.
	 * @param {(HTMLElement|String)} rootElement - The root element to initialise the component in, or a CSS selector for the root element
	 * @param {Object} [opts={}] - An options object for configuring the component
	 * @returns {(Expander|Array<Expander>)} - Expander instance(s)
	 */
	static init(rootEl, opts) {
		if (!rootEl) {
			rootEl = document.body;
		}
		if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		if (rootEl instanceof HTMLElement && rootEl.matches('[data-o-component=o-expander]')) {
			return new Expander(rootEl, opts);
		}
		return Array.from(rootEl.querySelectorAll('[data-o-component="o-expander"]'), rootEl => new Expander(rootEl, opts));
	}

	/**
	 * Get the data attributes from the ExpanderElement. If the component is being set up
	 * declaratively, this method is used to extract the data attributes from the DOM.
	 * @param {HTMLElement} oExpanderElement - The component element in the DOM
	 * @returns {Object} - Data attributes as an object
	 * @access private
	 */
	static _getDataAttributes(oExpanderElement) {
		if (!(oExpanderElement instanceof HTMLElement)) {
			return {};
		}
		return Object.keys(oExpanderElement.dataset).reduce((options, key) => {
			// Ignore data-o-component
			if (key === 'oComponent') {
				return options;
			}
			// Build a concise key and get the option value
			const shortKey = key.replace(/^oExpander(\w)(\w+)$/, (m, m1, m2) => m1.toLowerCase() + m2);
			const value = oExpanderElement.dataset[key];
			// Try parsing the value as JSON, otherwise just set it as a string
			try {
				options[shortKey] = JSON.parse(value.replace(/\'/g, '"'));
			} catch (error) {
				options[shortKey] = value;
			}
			return options;
		}, {});
	}
}

export default Expander;
