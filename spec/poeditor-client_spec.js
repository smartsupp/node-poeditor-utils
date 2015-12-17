'use strict';

describe('poeditor-client', function () {
	it('cannot be required', function () {
		expect(function () {
			require('poeditor-client');
		}).toThrowError(/cannot find module 'poeditor-client'/i);
	});

	it('can be required from', function () {
		expect(typeof require('poeditor-client/src/Projects')).toBe('function');
	});
});
