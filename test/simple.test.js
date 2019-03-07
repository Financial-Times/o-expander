/* eslint-env mocha, sinon, proclaim */
const proclaim = require('proclaim');
const sinon = require('sinon/pkg/sinon');
const fixtures = require('./helpers/fixtures');

const Expander = require('./../main');

describe("Expander", () => {
	let expSpy;

	before(() => {
		fixtures.simple();
		Expander.init();
		expSpy = sinon.spy(Expander.prototype, 'toggleExpander');
	});

	it('should toggle when "more" is clicked', (done) => {
		document.querySelector('.click-for-testing').click();
		setTimeout(function(){
			proclaim.equal(expSpy.calledWith('expand', undefined), true);
			done();
		}, 100);
	});

	it('should toggle when "less" is clicked', (done) => {
		document.querySelector('.click-for-testing').click();
		setTimeout(function(){
			proclaim.equal(expSpy.calledWith('collapse', undefined), true);
			expSpy.restore();
			done();
		}, 100);
	});
});
