import viewport from 'o-viewport';

// Used to create a unique o-expander id.
let count = 0;

class ExpanderUtility {
	/**
	 * Class constructor.
	 * @param {HTMLElement} [oExpanderElement] - The component element in the DOM
	 * @param {Object} - An options object for configuring the component.
	 */
	constructor(oExpanderElement, opts) {
		// Set expander state.
		// 'expanded', 'collapsed', or 'null';
		this._currentState = null;

		// Get configurable options.
		this.options = Object.assign({}, {
			shrinkTo: 'height',
			toggleState: 'all',
		}, opts);

		// If `shrinkTo` is a number, cast to an actual number using the
		// unary operator `+`. I.e so `typeof` returns `number`.
		if (!isNaN(this.options.shrinkTo)) {
			this.options.shrinkTo = +this.options.shrinkTo;
		}

		// Validate the required selectors are configured.
		// The `contentItem` selector is only required if this expander is a
		// "number" expander, i.e. based on the number of visible content items.
		const requiredSelectors = ['toggle', 'content'];
		if (typeof this.options.shrinkTo === 'number') {
			requiredSelectors.push(`contentItem`);
		}
		const actualSelectors = Object.keys(opts.selectors);
		const missingSelectors = requiredSelectors.filter(s => actualSelectors.indexOf(s) === -1);
		if (typeof opts.selectors !== 'object' || missingSelectors.length) {
			throw new Error(`Expected the following "selectors" to be specified within the options object "${requiredSelectors}", missing "${missingSelectors}".`);
		}

		// Validate the required classnames are configured.
		const requiredClassnames = [
			'initialised',
			'inactive',
			'expanded',
			'collapsed',
			'collapsibleItem'
		];
		const actualClassnames = Object.keys(opts.classnames);
		const missingClassnames = requiredClassnames.filter(s => actualClassnames.indexOf(s) === -1);
		if (typeof opts.selectors !== 'object' || missingClassnames.length) {
			throw new Error(`Expected the following "classnames" to be specified within the options object "${requiredClassnames}", missing "${missingClassnames}".`);
		}

		// If the user has not configured toggle text for the expanded state,
		// set it based on the "shrinkTo" option: "hide" when hiding collapsed
		// items; "less" when obscuring by reducing the container height by a
		// given value; "fewer" otherwise.
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

		// If the user has not configured toggle text for the collapsed state,
		// set it based on the "shrinkTo" option: "show" hiding collapsed items;
		// or "more" when collapsing to a height.
		if (!this.options.collapsedToggleText) {
			this.options.collapsedToggleText = this.options.shrinkTo === 'hidden' ? 'show' : 'more';
		}

		// Elements.
		this.oExpanderElement = oExpanderElement;
		this.contentElement = this.oExpanderElement.querySelector(this.options.selectors.content);
		this.toggles = [].slice.apply(this.oExpanderElement.querySelectorAll(this.options.selectors.toggle));
		if (!this.toggles.length) {
			throw new Error(
				'o-expander needs a toggle link or button.' +
				`None were found for toggle selector "${this.options.selectors.toggle}".`
			);
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

		// Add a class to indicate the expander is initialised, which
		// may be styled against for progressive enhancement (we shouldn't hide
		// content when the expander fails to load).
		this.contentElement.classList.add(this.options.classnames.initialised);

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
	apply(isSilent) {
		if (!this._isActive()) {
			this.oExpanderElement.classList.add(this.options.classnames.inactive);
		} else {
			//Remove the inactive class, this expander may be toggled.
			this.oExpanderElement.classList.remove(this.options.classnames.inactive);
			// Mark collapsible items with the `o-expander__collapsible-item` classnames.
			if (typeof this.options.shrinkTo === 'number') {
				const allCountElements = this.oExpanderElement.querySelectorAll(this.options.selectors.contentItem);
				const collapsibleCountElements = Array.from(allCountElements).splice(this.options.shrinkTo);
				collapsibleCountElements.forEach(el => el.classList.add(this.options.classnames.collapsibleItemClass));
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
	 * Toggle the expander so expands or, if it's already expanded, collapses.
	 */
	toggle() {
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
	expand(isSilent) {
		this._setExpandedState('expand', isSilent);
	}

	/**
	 * Collapse the expander.
	 * @param {Boolean} isSilent [false] Set to true to avoid firing the `oExpander.collapse` event.
	 */
	collapse(isSilent) {
		this._setExpandedState('collapse', isSilent);
	}

	/**
	 * Return true if the expander is currently collapse.
	 * @returns {Boolean}
	 */
	isCollapsed() {
		// If the expander has been run we store the current state.
		if (this._currentState) {
			return this._currentState === 'collapse';
		}
		// If not check for dom attributes to decide if the user intends
		// the expander to be expanded or collapsed by default.
		if (this.options.shrinkTo === 'hidden') {
			return this.contentElement.getAttribute('aria-hidden') === 'true';
		}
		return !this.contentElement.classList.contains(this.options.classnames.expanded);
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
		this.contentElement.classList.remove(this.options.classnames.expanded);
		this.contentElement.classList.remove(this.options.classnames.collapsed);
		this.contentElement.classList.remove(this.options.classnames.initialised);
	}

	/**
	 * Return whether the expander has something to hide / show.
	 * i.e. if expanding/collapsing would do anything.
	 * @returns {Boolean}
	 * @access private
	 */
	_isActive() {
		// An expander may always toggle an expander which hides items.
		if (this.options.shrinkTo === 'hidden') {
			return true;
		}
		// An expander based on the number of items in a container may only
		// collapse if the items length exceeds the number to shrink to. I.e.
		// a list of 2 can't collapse to 5.
		if (typeof this.options.shrinkTo === 'number') {
			const expandableElements = this.oExpanderElement.querySelectorAll(this.options.selectors.contentItem);
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
		// If not hiding elements set the expanded and collapsed classes.
		if (this.options.shrinkTo !== 'hidden') {
			this.contentElement.classList.toggle(this.options.classnames.expanded, state === 'expand');
			this.contentElement.classList.remove(this.options.classnames.collapsed, state !== 'expand');
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
	_dispatchEvent(name) {
		this.oExpanderElement.dispatchEvent(new CustomEvent('oExpander.' + name, { bubbles: true }));
	}

}

export default ExpanderUtility;
