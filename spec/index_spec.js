'use strict';

var utils = require('../lib/utils');

var index = require('../index');

describe('index', function () {
	it('exports utils', function () {
		expect(index).toBe(utils);
	});
});
