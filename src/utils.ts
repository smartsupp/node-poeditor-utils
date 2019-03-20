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

export async function getTranslations(project: Project) {
	return bluebird.Promise.resolve(project.languages.list())
	.map(function (language) {
		return bluebird.Promise.resolve(language.terms.list())
		.map(function (term) {
			return new Translation(term.term, language.code, term.translation)
		})
	})
	.then(function (translations) {
		return Immutable.fromJS(translations).flatten(1).toJS()
	})
}

export class Translation {
	term: string
	language: string
	value: string

	constructor(term, language, value) {
		this.term = term
		this.language = language
		this.value = value
	}
}

export type getPathCallback = (translation: Translation) => string

export async function writeTranslations(translations: Translation[], getPathCallback: getPathCallback) {
	var writes = Immutable.List(translations)
	.groupBy(getPathCallback)
	.map(function (translations) {
		return Immutable.List<any>(translations)
		.reduce(function (result, translation) {
			return result.set(translation.term, translation.value)
		}, Immutable.Map())
	})
	.map(function (translations, file: string) {
		var data = stringify(translations, {
			space: '\t'
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
