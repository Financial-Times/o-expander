import viewport from 'o-viewport';

// Used to find o-expander ids.
let count = 0;

class Expander {
	/**
	 * Class constructor.
	 * @param {HTMLElement} [oExpanderElement] - The component element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component
	 */
	constructor (oExpanderElement, opts) {
		// Set expander set.
		// 'expanded', 'collapsed', or 'null';
		this._currentState = null;

		// Get configurable options.
		this.options = Object.assign({}, {
			shrinkTo: 'height',
			toggleState: 'all',
			contentSelector: '.o-expander__content',
			toggleSelector: '.o-expander__toggle',
		}, opts || Expander._getDataAttributes(oExpanderElement));

		// If the user has configured the expand toggle text, choose the text
		// based on the "shrinkTo" configuration: "hide" when shrinking by
		// hiding collaposed items; "less" when shrinkng by height; "fewer" when
		// shrinking to a count of elements.
		if (!this.options.expandedToggleText) {
			switch (this.options.shrinkTo) {
				case 'hidden':
					this.options.expandedToggleText = 'hide';
					break;
				case 'height':
					this.options.expandedToggleText = 'less';
					break;
				default:
					this.options.expandedToggleText = 'fewer';
					break;
			}
		}
		// If the user has configured the collapse toggle text, choose the text
		// based on the "shrinkTo" configuration: "show" when shrinking by
		// hiding collaposed items; "more" when shrinkng by height or a count of
		// elements.
		if (!this.options.collapsedToggleText) {
			this.options.collapsedToggleText = this.options.shrinkTo === 'hidden' ? 'show' : 'more';
		}

		// Selectors.
		this.className = 'o-expander';
		this.countSelector = 'o-expander > li';

		// Elements.
		this.oExpanderElement = oExpanderElement;
		this.contentElement = this.oExpanderElement.querySelector(this.options.contentSelector);
		this.toggles = [].slice.apply(this.oExpanderElement.querySelectorAll(this.options.toggleSelector));
		if (!this.toggles.length) {
			throw new Error(
				'o-expander needs a toggle link or button.' +
				`None were found for toggle selector "${this.options.toggleSelector}".`
			);
		}

		// If `shrinkTo` is a number, cast to an actual number using the
		// unary operator `+`.
		if (!isNaN(this.options.shrinkTo)) {
			this.options.shrinkTo = +this.options.shrinkTo;
		}

		// Set `aria-controls` on each toggle using expander ids.
		this.id = this.contentElement.id;
		if (!this.id) {
			while (document.querySelector('#o-expander__toggle--' + count)) {
				count++;
			}
			this.id = this.contentElement.id = 'o-expander__toggle--' + count;
		}
		this.toggles.forEach(toggle => toggle.setAttribute('aria-controls', this.id));

		// Add a click event to each toggle.
		this.toggles.forEach(toggle => {
			toggle.addEventListener('click', () => this.toggle());
		});

		// If shrinking based on a height set in css, reapply the expander on
		// orientation and resize events.
		if (this.options.shrinkTo === 'height') {
			viewport.listenTo('resize');
			viewport.listenTo('orientation');
			document.body.addEventListener('oViewport.orientation', () => this.apply());
			document.body.addEventListener('oViewport.resize', () => this.apply());
		}

		// Add a data attribute to indicate the expander is initalised, which
		// may be styled against for progressive enhancement (we shouldn't hide
		// content when the expander fails to load).
		this.oExpanderElement.setAttribute('data-o-expander-js', '');

		// Apply the configured expander.
		this.apply(true);

		// Setup. Fire the `oExpander.init` event.
		this._dispatchEvent('init');
	}

	/**
	 * Recalculate and apply the styles to expand or collapse the expander
	 * according to its current state.
	 * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.expand` or `oExpander.collapse` events.
	 */
	apply (isSilent) {
		if (!this._isToggleable()) {
			this.oExpanderElement.classList.add('o-exapnder--inactive');
		} else {
			//Remove the inactive class, this expander may be toggled.
			this.oExpanderElement.classList.remove('o-exapnder--inactive');
			// Mark collapsible items with the `o-expander__collapsible-item` class.
			if (typeof this.options.shrinkTo === 'number') {
				const allCountElements = this.oExpanderElement.querySelectorAll(this.options.countSelector);
				const collapsibleCountElements = Array.from(allCountElements).splice(this.options.shrinkTo);
				collapsibleCountElements.forEach(el => el.classList.add('o-expander__collapsible-item'));
			}
			// Collapse or expand.
			if (this.isCollapsed()) {
				this.collapse(isSilent);
			} else {
				this.expand(isSilent);
			}
		}
	}

	/**
	 * Toggle the expander so a collaposed expander is expanded and an expanded
	 * expander is collapsed.
	 */
	toggle () {
		if (this.isCollapsed()) {
			this.expand();
		} else {
			this.collapse();
		}
	}

	/**
	 * Expand the expander.
	 * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.expand` event.
	 */
	expand (isSilent) {
		this._setExpandedState('expand', isSilent);
	}

	/**
	 * Collapse the expander.
	 * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.collapse` event.
	 */
	collapse (isSilent) {
		this._setExpandedState('collapse', isSilent);
	}

	/**
	 * Return true if the expander is currently collapse.
	 * @returns {Boolean}
	 */
	isCollapsed () {
		// If the expander has been run we store the current state.
		if (this._currentState) {
			return this._currentState === 'collapse';
		}
		// If not check for dom attributes to decide if the user intends
		// the expander to be expanded or collapsed by default.
		if (this.options.shrinkTo === 'hidden') {
			return this.contentElement.getAttribute('aria-hidden') === 'true';
		}
		return !this.contentElement.classList.contains('o-expander--expanded');
	}

	/**
	 * Remove the expander from the page.
	 */
	destroy() {
		if (this.options.shrinkTo === 'height') {
			document.body.removeEventListener('oViewport.orientation', () => this.apply());
			document.body.removeEventListener('oViewport.resize', () => this.apply());
		}
		this.toggles.forEach(toggle => {
			toggle.removeEventListener('click', this.toggle);
			toggle.removeAttribute('aria-controls');
			toggle.removeAttribute('aria-expanded');
		});
		this.contentElement.removeAttribute('aria-hidden');
		this.contentElement.classList.remove('o-expander--expanded');
		this.contentElement.classList.remove('o-expander--collapsed');
		this.oExpanderElement.removeAttribute('data-o-expander-js');
	}

	/**
	 * Find whether the expander is toggleable or inactive.
	 * @returns {Boolean}
	 * @access private
	 */
	_isToggleable() {
		// An expander may always toggle hidable items.
		if (this.options.shrinkTo === 'hidden') {
			return true;
		}
		// An expander based on the number of items in a container may only
		// collapose if the items length exceeds the number to shrink to. I.e.
		// a list of 2 can't collapose to 5.
		if (typeof this.options.shrinkTo === 'number') {
			const expandableElements = this.oExpanderElement.querySelectorAll(this.options.countSelector);
			if (expandableElements.length > this.options.shrinkTo) {
				return true;
			}
		}
		// If the expander is based on a height then check the content overflows
		// the content container.
		let overflows = false;
		if (this.isCollapsed()) {
			overflows = this.contentElement.clientHeight < this.contentElement.scrollHeight;
		} else {
			this.collapse();
			overflows = this.contentElement.clientHeight < this.contentElement.scrollHeight;
			this.expand();
		}
		return overflows;
	}

	/**
	 * Expand or collapse the expander.
	 * @param {Boolean} state "expand" or "collapse".
	 * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.collapse` or `oExpander.expand` events.
	 * @access private
	 */
	_setExpandedState(state, isSilent) {
		// Record the current state of the expander.
		this._currentState = state;
		// If not hiding elements set the expanded and collaposed classes.
		if (this.options.shrinkTo !== 'hidden') {
			this.contentElement.classList.toggle('o-expander--expanded', state === 'expand');
			this.contentElement.classList.remove('o-expander--collapsed', state !== 'expand');
		}
		// If hiding elements set `aria-hidden`.
		if (this.options.shrinkTo === 'hidden') {
			const value = state === 'expand' ? 'false' : 'true';
			this.contentElement.setAttribute('aria-hidden', value);
		}
		// Set the toggle text and `aria-expanded` attribute.
		if (this.options.toggleState !== 'none') {
			this.toggles.forEach(toggle => {
				if (this.options.toggleState !== 'aria') {
					toggle.innerHTML = (state === 'expand' ?
						this.options.expandedToggleText :
						this.options.collapsedToggleText) + '<i></i>';
				}
				toggle.setAttribute('aria-expanded', state === 'expand' ? 'true' : 'false');
			});
		}
		// Dispatch `oExpander.collapse` or `oExpander.expand` event.
		if (!isSilent) {
			this._dispatchEvent(state);
		}
	}

	/**
	 * Fire a bubbling o-expander event with the correct namespace.
	 * @param {string} name The event name. E.g. "example" will fire an "oExpander.example" event.
	 * @access private
	 */
	_dispatchEvent (name) {
		this.oExpanderElement.dispatchEvent(new CustomEvent('oExpander.' + name, { bubbles: true }));
	}

	/**
	 * Get the data attributes from the ExpanderElement. If the component is being set up
	 * declaratively, this method is used to extract the data attributes from the DOM.
	 * @param {HTMLElement} oExpanderElement - The component element in the DOM
	 * @returns {Object} - Data attributes as an object
	 * @access private
	 */
	static _getDataAttributes (oExpanderElement) {
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

	/**
	 * Initialise the component.
	 * @param {(HTMLElement|String)} rootElement - The root element to intialise the component in, or a CSS selector for the root element
	 * @param {Object} [opts={}] - An options object for configuring the component
	 * @returns {(Expander|Array<Expander>)} - Expander instance(s)
	 */
	static init (rootEl, opts) {
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
}

export default Expander;
