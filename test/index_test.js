'use strict';

var expect = require('expect.js');

describe('index', function () {
	it('fails to require poeditor-client', function () {
		expect(function () {
			require('../index.js');
		}).to.throwException(/cannot find module 'poeditor-client'/i);
	});
});
