'use strict';

var Utils = require('../lib/Utils');

var index = require('../index');

describe('index', function () {
	it('exports Utils', function () {
		expect(index).toBe(Utils);
	});
});
