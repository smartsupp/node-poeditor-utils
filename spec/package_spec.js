'use strict';

var index = require('../index');
var utils = require('../lib/utils');

describe('package', function () {
	xit('exports poeditor-client Client');

	xit('exports Translation');

	it('exports meaningful utils', function () {
		expect(index.getProject).toBe(utils.getProject);
		expect(index.pullTranslations).toBe(utils.pullTranslations);
	});
});
