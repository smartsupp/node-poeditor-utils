'use strict';

var Client = require('poeditor-client');
var Promise = require('native-promise-only');
var rewire = require('rewire');
var fs = require('fs');
var stringify = require('json-stable-stringify');

var helpers = rewire('../lib/helpers');
var Translation = require('../lib/Translation');

describe('helpers', function () {
	describe('#clientFactory', function () {
		it('creates poeditor-client Client', function () {
			expect(helpers.clientFactory('my token')).toEqual(jasmine.any(Client));
		});

		it('passes API token to client', function () {
			var Client = jasmine.createSpy();
			helpers.__with__({
				Client: Client
			})(function () {
				helpers.clientFactory('my token');
			})
			expect(Client).toHaveBeenCalledWith('my token');
		});
	});
});

describe('helpers', function() {
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
			var clientFactory = spyOn(helpers, 'clientFactory').and.returnValue(client);
		});

		it('returns a promise', function () {
			expect(helpers.getProject('my token', 'my project').then).toEqual(jasmine.any(Function));
		});

		xit('delegates to poeditor-client Client', function () {
		});

		it('resolves with project data', function (done) {
			helpers.getProject('my token', 'my project')
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
			expect(helpers.getTranslations(this.project).then).toEqual(jasmine.any(Function));
		});

		it('resolves with all the translations for all the available project languages', function (done) {
			helpers.getTranslations(this.project)
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
			expect(helpers.writeTranslations(this.translations, this.getFile).then).toEqual(jasmine.any(Function));
		});

		it('writes translations to files by language', function (done) {
			helpers.writeTranslations(this.translations, this.getFile)
			.then(function (files) {
				expect(this.writeFileAsync.calls.count()).toBe(2);
				done();
			}.bind(this))
			.catch(done.fail);
		});

		it('writes alphabetically sorted JSON', function (done) {
			helpers.writeTranslations(this.translations, this.getFile)
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
			helpers.writeTranslations(this.translations, this.getFile)
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
});
