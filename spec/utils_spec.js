'use strict';

var helpers = require('../lib/helpers');

var utils = require('../lib/utils');

describe('utils', function() {
	describe('#getProject', function () {
		it('delegates to helpers.getProject', function () {
			var helper = spyOn(helpers, 'getProject');
			utils.getProject('my token', 'my project');
			expect(helper).toHaveBeenCalledWith('my token', 'my project');
		});
	});
});
