'use strict';

var Client = require('poeditor-client');

var index = require('../index');
var utils = require('../lib/utils');

describe('package', function () {
	it('exports poeditor-client', function () {
		expect(index.Client).toBe(Client);
	});

	it('exports meaningful utils', function () {
		expect(index.getProject).toBe(utils.getProject);
		expect(index.pullTranslations).toBe(utils.pullTranslations);
	});
});
