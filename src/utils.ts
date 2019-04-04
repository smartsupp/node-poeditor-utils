import * as util from 'util'

import * as bluebird from 'bluebird'
import * as Immutable from 'immutable'
import * as stringify from 'json-stable-stringify'

import {createClient, Project} from './client'
import * as fs from './fs'

export async function getProject(apiToken: string, projectName: string): Promise<Project> {
	var client = createClient(apiToken)
	return bluebird.Promise.resolve(client.projects.list())
	.then(function (projects) {
		return Immutable.List(projects)
		.find(function (project) {
			return project.name == projectName
		})
	})
}

export async function getTranslations(project: Project): Promise<Translation[]> {
	return bluebird.Promise.resolve(project.languages.list())
	.map(function (language) {
		return bluebird.Promise.resolve(language.terms.list())
		.map(function (term) {
			const translation = new LegacyTranslation()
			translation.projectName = project.name
			translation.languageCode = language.code
			translation.term = term.term
			translation.value = term.translation
			return translation
		})
	})
	.then(function (translations) {
		return Immutable.fromJS(translations).flatten(1).toJS()
	})
}

export interface Translation {
	projectName: string
	languageCode: string
	language: string
	term: string
	value: string
}

export class LegacyTranslation implements Translation {
	projectName: string
	languageCode: string
	term: string
	value: string

	get language(): string {
		return translationGetLanguageDeprecation(this)
	}

	set language(value: string) {
		translationSetLanguageDeprecation(this, value)
	}
}

const translationLanguageDeprecate = (fn) => util.deprecate(fn, 'poeditor-utils Translation.language is deprecated and will be removed in future versions. Please use Translation.languageCode instead.')
const translationGetLanguageDeprecation = translationLanguageDeprecate((translation: Translation) => translation.languageCode)
const translationSetLanguageDeprecation = translationLanguageDeprecate((translation: Translation, value: string) => translation.languageCode = value)

export type getPathCallback = (translation: Translation) => string

	var writes = Immutable.List(translations)
export async function writeTranslations(translations: Translation[], getPathCallback: getPathCallback) {
	.groupBy(getPathCallback)
	.map(function (translations) {
		return Immutable.List<any>(translations)
		.reduce(function (result, translation) {
			return result.set(translation.term, translation.value)
		}, Immutable.Map())
	})
	.map(function (translations, file: string) {
		var data = stringify(translations, {
			space: '\t',
		})
		return (<any>fs.writeFileAsync)(file, data)
		.then(function () {
			return file
		})
	})
	.toList()
	.toJS()
	return bluebird.Promise.all(writes)
}

export async function pullTranslations(apiToken: string, projectName: string, getPathCallback: getPathCallback) {
	return exports.getProject(apiToken, projectName)
	.then(function (project) {
		return exports.getTranslations(project)
	})
	.then(function (translations) {
		return exports.writeTranslations(translations, getPathCallback)
	})
}
