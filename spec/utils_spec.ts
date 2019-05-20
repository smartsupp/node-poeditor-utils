import * as utils from '../src/utils'
import * as client from '../src/client'
import * as fs from '../src/fs'

describe('utils', function () {
	describe('Translation', function () {
		const translation = new utils.LegacyTranslation()
		translation.projectName = 'test project'
		translation.languageCode = 'en'
		translation.term = 'app.title'
		translation.value = 'en title'

		it('is mutable', function () {
			// no magic, just possible real world operation over term string
			translation.term = translation.term.split('.').slice(1).join()
			expect(translation.term).toBe('title')
		})

		it('is backwards compatible', function () {
			expect(translation.language).toBe('en')
			translation.language = 'lala'
			expect(translation.languageCode).toBe('lala')
		})
	})

	describe('getProject', function () {
		beforeEach(function () {
			this.client = {
				projects: {
					list: jasmine.createSpy().and.returnValue(Promise.resolve([
						{id: 123, name: 'one'},
						{id: 456, name: 'my project'},
						{id: 789, name: 'three'},
					])),
				},
			}
			this.createClient = spyOn(client, 'createClient').and.returnValue(this.client)
		})

		it('delegates to poeditor-client', function (done) {
			utils.getProject('my token', 'my project')
			.then(function () {
				expect(this.createClient).toHaveBeenCalledWith('my token')
				expect(this.client.projects.list).toHaveBeenCalled()
				done()
			}.bind(this))
			.catch(done.fail)
		})

		it('resolves with required project data', function (done) {
			utils.getProject('my token', 'my project')
			.then(function (project) {
				expect(project).toEqual(jasmine.objectContaining({
					id: 456,
					name: 'my project',
				}))
				done()
			})
			.catch(done.fail)
		})
	})

	describe('getTranslations', function () {
		beforeEach(function () {
			const termsList = jasmine.createSpy('Terms.list').and.callFake(function (language) {
				return Promise.resolve([1, 2].map(function (i) {
					return {
						term: 'app.title.' + i,
						translation: language.code + ' ' + i,
					}
				}))
			})
			this.termsList = termsList
			const languagesList = jasmine.createSpy('Languages.list').and.returnValue(Promise.resolve(['en', 'de'].map(function (languageCode) {
				const language = {
					code: languageCode,
					terms: {
						list: function () {
							return termsList(language)
						},
					},
				}
				return language
			})))
			this.languagesList = languagesList
			this.project = {
				name: 'test project',
				languages: {
					list: languagesList,
				},
			}
		})

		it('delegates to poeditor-client', function (done) {
			utils.getTranslations(this.project)
			.then(function () {
				expect(this.languagesList.calls.count()).toBe(1)
				expect(this.termsList.calls.count()).toBe(2)
				done()
			}.bind(this))
			.catch(done.fail)
		})

		it('resolves with translations for all the available project languages', function (done) {
			utils.getTranslations(this.project)
			.then(function (translations) {
				expect(translations.length).toBe(4)
				expect(translations).toContain(jasmine.any(utils.LegacyTranslation))
				expect(translations).toContain(jasmine.objectContaining({
					projectName: 'test project',
					languageCode: 'en',
					term: 'app.title.1',
					value: 'en 1',
				}))
				done()
			})
			.catch(done.fail)
		})
	})

	describe('getTranslations2', function () {
		beforeEach(function () {
			this.project1 = {name: 'test project 1'}
			this.project2 = {name: 'test project 2'}
			this.project3 = {name: 'test project 3'}
			this.createClient = spyOn(client, 'createClient').and.returnValue({
				projects: {
					list: jasmine.createSpy('projects.list').and.returnValue(Promise.resolve([
						this.project1,
						this.project2,
						this.project3,
					])),
				},
			})
			this.getTranslations = spyOn(utils, 'getTranslations').and.callFake((project) => Promise.resolve(<any>[
				{value: project.name + ' translation'},
			]))
		})

		it('works with API token directly', function (done) {
			utils.getTranslations2('test token', ['test project 1', 'test project 2'])
			.then(() => {
				expect(this.createClient).toHaveBeenCalledWith('test token')
				done()
			})
			.catch(done.fail)
		})

		it('works with multiple projects', function (done) {
			utils.getTranslations2('test token', ['test project 1', 'test project 2'])
			.then((translations) => {
				expect(this.getTranslations).toHaveBeenCalledWith(this.project1)
				expect(this.getTranslations).toHaveBeenCalledWith(this.project2)
				expect(this.getTranslations).not.toHaveBeenCalledWith(this.project3)
				expect(translations.length).toBe(2)
				expect(translations).toContain(<any>{value: 'test project 1 translation'})
				expect(translations).not.toContain(<any>{value: 'test project 3 translation'})
				done()
			})
			.catch(done.fail)
		})
	})

	describe('groupTranslations', function () {
		it('works', function () {
			const translations = [
				{languageCode: 'en', term: 'term1', value: 'en value'},
				{languageCode: 'de', term: 'term1', value: 'de value'},
			]
			const grouper = (translation: utils.Translation) => translation.languageCode
			const translationsByLanguageCode = utils.groupTranslations(<any>translations, grouper)
			expect(translationsByLanguageCode.size).toBe(2)
			expect(translationsByLanguageCode.has('en'))
			expect(translationsByLanguageCode.has('de'))
			expect(translationsByLanguageCode.get('en')).toEqual([
				<any>{languageCode: 'en', term: 'term1', value: 'en value'},
			])
		})
	})

	describe('formatTranslations', function () {
		it('works', function () {
			const translations = [
				{languageCode: 'en', term: 'term1', value: 'value1'},
				{languageCode: 'en', term: 'term2', value: 'value2'},
			]
			const data = utils.formatTranslations(<any>translations)
			expect(data).toEqual('{\n\t"term1": "value1",\n\t"term2": "value2"\n}')
		})
	})

	describe('writeTranslations', function () {
		beforeEach(function () {
			this.translations = [
				{languageCode: 'en', term: 'app.title.3', value: 'en title three'},
				{languageCode: 'en', term: 'app.title.2', value: 'en title two'},
				{languageCode: 'en', term: 'app.title.1', value: 'en title one'},
				{languageCode: 'de', term: 'app.title.1', value: 'de title one'},
			]
			this.writeFile = spyOn(fs, 'writeFileAsync').and.returnValue(Promise.resolve())
			this.getFile = function (translation) {
				return './my-translations/' + translation.languageCode + '.json'
			}
		})

		it('writes translations to files by language', function (done) {
			utils.writeTranslations(this.translations, this.getFile)
			.then(function (files) {
				expect(this.writeFile.calls.count()).toBe(2)
				done()
			}.bind(this))
			.catch(done.fail)
		})

		it('writes alphabetically sorted JSON', function (done) {
			utils.writeTranslations(this.translations, this.getFile)
			.then(function () {
				expect(this.writeFile.calls.first().args).toEqual([
					'./my-translations/en.json',
					'{\n\t"app.title.1": "en title one",\n\t"app.title.2": "en title two",\n\t"app.title.3": "en title three"\n}',
				])
				done()
			}.bind(this))
			.catch(done.fail)
		})

		it('resolves with a list of output files', function (done) {
			utils.writeTranslations(this.translations, this.getFile)
			.then(function (files) {
				expect(files).toEqual([
					'./my-translations/en.json',
					'./my-translations/de.json',
				])
				done()
			})
			.catch(done.fail)
		})
	})

	describe('pullTranslations', function () {
		beforeEach(function () {
			this.project = {}
			this.getProject = spyOn(utils, 'getProject').and.returnValue(Promise.resolve(this.project))
			this.translations = []
			this.getTranslations = spyOn(utils, 'getTranslations').and.returnValue(Promise.resolve(this.translations))
			this.files = []
			this.writeTranslations = spyOn(utils, 'writeTranslations').and.returnValue(Promise.resolve(this.files))
			this.getFile = jasmine.createSpy()
		})

		it('delegates to helper functions', function (done) {
			utils.pullTranslations('my token', 'my project', this.getFile)
			.then(function (files) {
				expect(this.getProject).toHaveBeenCalledWith('my token', 'my project')
				expect(this.getTranslations).toHaveBeenCalledWith(this.project)
				expect(this.writeTranslations).toHaveBeenCalledWith(this.translations, this.getFile)
				expect(files).toEqual(this.files)
				done()
			}.bind(this))
			.catch(done.fail)
		})
	})
})
