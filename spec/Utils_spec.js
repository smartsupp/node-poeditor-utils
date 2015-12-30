'use strict';

var helpers = require('../lib/helpers');

var Utils = require('../lib/Utils');

describe('Utils', function() {
	beforeEach(function () {
		this.utils = new Utils('my token');
	});

	describe('#getProject', function () {
		it('delegates to helpers.getProject', function () {
			var helper = spyOn(helpers, 'getProject');
			this.utils.getProject('my project');
			expect(helper).toHaveBeenCalledWith('my token', 'my project');
		});
	});
});
