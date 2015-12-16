'use strict';

var expect = require('expect.js');

describe('poeditor-client', function () {
	it('cannot be required', function () {
		expect(function () {
			require('poeditor-client');
		}).to.throwException(/cannot find module 'poeditor-client'/i);
	});

	it('can be required from', function () {
		expect(require('poeditor-client/src/Projects')).to.be.a(Function);
	});
});
