'use strict';

var Promise = require('bluebird');

describe('bluebird', function () {
	it('can demultiplex and multiplex a promise', function (done) {
		var promise = Promise.resolve(['a', 'b', 'c'])
		.map(function (item) {
			return new Promise.resolve(item.toUpperCase());
		})
		.then(function (items) {
			expect(items).toEqual(['A', 'B', 'C']);
			done();
		});
	});
});
