let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}

function simple () {
	const html = `
	<div data-o-component="o-expander" class="o-expander items" data-o-expander-shrink-to="2" data-o-expander-count-selector="li" id="element">
		<h2>Collapsing to number of items in a list</h2>
		<ul class="o-expander__content">
			<li>item</li>
			<li>item</li>
			<li>item</li>
			<li>item</li>
		</ul>
		<a href='#' class="o-expander__toggle o--if-js click-for-testing"></a>
	</div>

	<div data-o-component="o-expander" class="o-expander height" data-o-expander-shrink-to="height">
		<h2>Collapsing to height of content (resize window to see toggle appear and disappear in a content-aware manner)</h2>
		<div class="o-expander__content">
			word word word word word word word word word word word word word word word word word word word word word word
		</div>
		<a href='#' class="o-expander__toggle o--if-js"></a>
	</div>


	<div data-o-component="o-expander" class="o-expander" data-o-expander-shrink-to="hidden">
		<h2>Hiding content</h2>
		<div class="o-expander__content">
			word word word word word word word word word word word word word word word word word word word word word word
		</div>
		<a href='#' class="o-expander__toggle o--if-js"></a>
	</div>

	`;
	insert(html);
}

function accordion () {
	const html = `
	<div data-o-component="o-expander" class="o-expander items" data-o-expander-shrink-to="3" data-o-expander-count-selector="li">
		<h2>Simple List</h2>
		<ul class="o-expander__content">
			<li>item</li>
			<li>item</li>
			<li>item</li>
			<li>item</li>
		</ul>
		<a href='#' class="o-expander__toggle o--if-js click-for-testing"></a>
	</div>

	<div data-o-component="o-expander" class="o-expander items" data-o-expander-shrink-to="2" data-o-expander-count-selector="li" data-o-expander-accordion="true">
		<h2>Accordion behaviour</h2>
		<div class="o-expander__content">
			<a href='#' class="o-expander__toggle o--if-js" data-expand-id="list-1">List 1</a>
			<ul class="o-expander__content" data-id="list-1">
				<li>item1</li>
				<li>item2</li>
				<li>item3</li>
			</ul>
			<a href='#' class="o-expander__toggle o--if-js" data-expand-id="list-2">List 2</a>
			<ul class="o-expander__content" data-id="list-2">
				<li>item4</li>
				<li>item5</li>
				<li>item6</li>
				<li>item7</li>
				<li>item8</li>
				<li>item9</li>
				<li>item10</li>
			</ul>
			<a href='#' class="o-expander__toggle o--if-js" data-expand-id="list-3">List 3</a>
			<ul class="o-expander__content" data-id="list-3">
				<li>item11</li>
				<li>item12</li>
				<li>item13</li>
			</ul>
		</div>
	</div>
	`;
	insert(html);
}

export {
	simple,
	accordion,
	reset
};
