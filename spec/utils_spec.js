'use strict';

var Promise = require('native-promise-only');
var rewire = require('rewire');
var fs = require('fs');
var stringify = require('json-stable-stringify');

var utils = rewire('../lib/utils');
var Translation = require('../lib/Translation');

describe('utils', function () {
	describe('#clientFactory', function () {
		it('delegates to poeditor-client', function () {
			var client = {};
			var Client = jasmine.createSpy().and.returnValue(client);
			utils.__with__({
				Client: Client
			})(function () {
				utils.clientFactory('my token');
				expect(utils.clientFactory('my token')).toBe(client);
			})
			expect(Client).toHaveBeenCalledWith('my token');
		});
	});
});

describe('utils', function() {
	describe('#getProject', function () {
		beforeEach(function () {
			var client = {
				projects: {
					list: jasmine.createSpy().and.returnValue(Promise.resolve([
						{id: 123, name: 'one'},
						{id: 456, name: 'my project'},
						{id: 789, name: 'three'}
					]))
				}
			};
			var clientFactory = spyOn(utils, 'clientFactory').and.returnValue(client);
		});

		it('returns a promise', function () {
			expect(utils.getProject('my token', 'my project').then).toEqual(jasmine.any(Function));
		});

		xit('delegates to poeditor-client');

		it('resolves with project data', function (done) {
			utils.getProject('my token', 'my project')
			.then(function (project) {
				expect(project).toEqual(jasmine.objectContaining({
					id: 456,
					name: 'my project'
				}));
				done();
			})
			.catch(done.fail);
		});
	});

	describe('#getTranslations', function () {
		beforeEach(function () {
			var termsList = jasmine.createSpy('Terms.list').and.callFake(function (language) {
				return Promise.resolve([1, 2].map(function (i) {
					return {term: 'app.title.' + i, translation: language.code + ' ' + i};
				}));
			});
			this.termsList = termsList;
			var languagesList = jasmine.createSpy('Languages.list').and.returnValue(Promise.resolve(['en', 'de'].map(function (languageCode) {
				var language = {
					code: languageCode,
					terms: {}
				};
				language.terms.list = function() { return termsList(language); };
				return language;
			})));
			this.languagesList = languagesList;
			this.project = {
				languages: {list: languagesList}
			};
		});

		it('returns a promise', function () {
			expect(utils.getTranslations(this.project).then).toEqual(jasmine.any(Function));
		});

		it('resolves with all the translations for all the available project languages', function (done) {
			utils.getTranslations(this.project)
			.then(function (translations) {
				expect(this.languagesList.calls.count()).toBe(1);
				expect(this.termsList.calls.count()).toBe(2);
				expect(translations.length).toBe(4);
				expect(translations).toContain(jasmine.any(Translation));
				expect(translations).toContain(jasmine.objectContaining({
					term: 'app.title.1',
					language: 'en',
					value: 'en 1'
				}));
				done();
			}.bind(this))
			.catch(done.fail);
		});
	});

	describe('#writeTranslations', function () {
		beforeEach(function () {
			this.translations = [
				{term: 'app.title.3', language: 'en', value: 'en title three'},
				{term: 'app.title.2', language: 'en', value: 'en title two'},
				{term: 'app.title.1', language: 'en', value: 'en title one'},
				{term: 'app.title.1', language: 'de', value: 'de title one'}
			];
			this.writeFileAsync = spyOn(fs, 'writeFileAsync').and.callFake(function (file) {
				return Promise.resolve(file);
			});
			this.getFile = function (translation) {
				return './my-translations/' + translation.language + '.json';
			};
		});

		it('returns a promise', function () {
			expect(utils.writeTranslations(this.translations, this.getFile).then).toEqual(jasmine.any(Function));
		});

		it('writes translations to files by language', function (done) {
			utils.writeTranslations(this.translations, this.getFile)
			.then(function (files) {
				expect(this.writeFileAsync.calls.count()).toBe(2);
				done();
			}.bind(this))
			.catch(done.fail);
		});

		it('writes alphabetically sorted JSON', function (done) {
			utils.writeTranslations(this.translations, this.getFile)
			.then(function () {
				expect(this.writeFileAsync.calls.first().args).toEqual([
					'./my-translations/en.json',
					stringify({
						'app.title.1': 'en title one',
						'app.title.2': 'en title two',
						'app.title.3': 'en title three'
					}, {
						space: '\t'
					})
				]);
				done();
			}.bind(this))
			.catch(done.fail);
		});

		it('resolves with a list of output files', function (done) {
			utils.writeTranslations(this.translations, this.getFile)
			.then(function (files) {
				expect(files).toEqual([
					'./my-translations/en.json',
					'./my-translations/de.json'
				]);
				done();
			})
			.catch(done.fail);
		});
	});

	describe('#pullTranslations', function () {
		beforeEach(function () {
			this.project = {};
			this.getProject = spyOn(utils, 'getProject').and.returnValue(Promise.resolve(this.project));
			this.translations = [];
			this.getTranslations = spyOn(utils, 'getTranslations').and.returnValue(Promise.resolve(this.translations));
			this.files = [];
			this.writeTranslations = spyOn(utils, 'writeTranslations').and.returnValue(Promise.resolve(this.files));
			this.getFile = jasmine.createSpy();
		});

		it('returns a promise', function () {
			expect(utils.pullTranslations('my token', 'my project', this.getFile).then).toEqual(jasmine.any(Function));
		});

		it('delegates to helper functions', function (done) {
			utils.pullTranslations('my token', 'my project', this.getFile)
			.then(function (files) {
				expect(this.getProject).toHaveBeenCalledWith('my token', 'my project');
				expect(this.getTranslations).toHaveBeenCalledWith(this.project);
				expect(this.writeTranslations).toHaveBeenCalledWith(this.translations, this.getFile);
				expect(files).toEqual(this.files);
				done();
			}.bind(this))
			.catch(done.fail);
		});
	});
});
