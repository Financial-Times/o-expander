/* eslint-env mocha, sinon, proclaim */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';

const Expander = require('./../main');

describe("Expander accordion", () => {
	let expSpy;

	before(() => {
		fixtures.accordion();
		Expander.init();
		expSpy = sinon.spy(Expander.prototype, 'toggleExpander');
	});

	xit('should toggle when a collapsed list is clicked', () => {

	});

	xit('should toggle when a expanded list is clicked', () => {

	});

	xit('should collapse the other lists when one is clicked', () => {

	});

	xit('should toggle when "less" is clicked', () => {

	});
});
