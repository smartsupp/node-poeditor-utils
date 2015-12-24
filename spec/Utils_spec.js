'use strict';

var Promise = require('native-promise-only');
var rewire = require('rewire');

var Utils = rewire('../lib/Utils');

describe('Utils', function () {
	it('passes API token to poeditor-client', function () {
		var Client = jasmine.createSpy('Client');
		Utils.__with__({
			Client: Client
		})(function () {
			new Utils('my token');
		});
		expect(Client).toHaveBeenCalledWith('my token');
	});

	describe('#getProject', function () {
		beforeEach(function () {
			this.utils = new Utils('my token');
			spyOn(this.utils.client.projects, 'list').and.returnValue(Promise.resolve([
				{id: 123, name: 'one'},
				{id: 456, name: 'my project'},
				{id: 789, name: 'three'}
			]));
		});

		it('returns a promise', function () {
			expect(this.utils.getProject('my project').then).toEqual(jasmine.any(Function));
		});

		it('gets project data via API', function (done) {
			this.utils.getProject('my project')
			.then(function (project) {
				expect(project).toEqual(jasmine.objectContaining({
					id: 456,
					name: 'my project'
				}));
				done();
			});
		});
	});
});
