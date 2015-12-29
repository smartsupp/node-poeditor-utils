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
});

describe('Utils', function() {
	beforeEach(function () {
		this.utils = new Utils('my token');
		spyOn(this.utils.client.projects, 'list').and.returnValue(Promise.resolve([
			{id: 123, name: 'one'},
			{id: 456, name: 'my project'},
			{id: 789, name: 'three'}
		]));
	});

	describe('#getProject', function () {
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

	describe('#getTranslations', function () {
		var termsList = jasmine.createSpy('Terms.list').and.callFake(function (languageCode) {
			return Promise.resolve([1, 2].map(function (i) {
				return {term: 'app.title.' + i, __languageCode: languageCode, translation: languageCode + ' ' + i};
			}));
		});
		var languagesList = jasmine.createSpy('Languages.list').and.returnValue(Promise.resolve(['en_US', 'de_DE'].map(function (languageCode) {
			return {
				terms: {list: function() { return termsList(languageCode); }}
			};
		})));
		var project;

		beforeEach(function () {
			project = {
				languages: {list: languagesList}
			};
		});

		it('gets all the translations for all the project languages', function (done) {
			this.utils.getTranslations(project).then(function (translations) {
				expect(languagesList.calls.count()).toBe(1);
				expect(termsList.calls.count()).toBe(2);
				expect(translations.length).toBe(4);
				expect(translations[0]).toEqual(jasmine.any(Object));
				done();
			});
		});
	});
});
