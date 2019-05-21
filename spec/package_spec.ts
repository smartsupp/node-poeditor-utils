import * as fs from 'fs'

import * as utils from '..'
import * as internalUtils from '../lib/utils'

const apiToken = process.env.TEST_API_TOKEN
const projectName = process.env.TEST_PROJECT_NAME

describe('package', () => {
	it('exports meaningful stuff', () => {
		expect(utils.pullTranslations).toBe(internalUtils.pullTranslations)
	})
})

describe('package usage', () => {
	const tmpPath = './spec/tmp'
	fs.mkdirSync(tmpPath)

	const timeout = 10000

	it('is as it is', async () => {
		if (apiToken && projectName) {
			const translationsPath = `${tmpPath}/usage`
			fs.mkdirSync(translationsPath)
			const languageCodeOverrides = {
				'pt-br': 'pt',
			}
			const getPathCallback = (translation) => {
				const language = languageCodeOverrides[translation.languageCode] || translation.languageCode
				return `${translationsPath}/${language}.json`
			}
			await utils.pullTranslations(apiToken, projectName, getPathCallback)
		} else {
			expect().nothing()
		}
	}, timeout)

	it('could be better, as in moar flexible', async () => {
		if (apiToken && projectName) {
			const translationsPath = `${tmpPath}/better-usage`
			fs.mkdirSync(translationsPath)
			const languageCodeOverrides = {
				'pt-br': 'pt',
			}
			const projectNames = [projectName]
			const translations = await internalUtils.getTranslations2(apiToken, projectNames)
			const translationsByLanguage = internalUtils.groupTranslations(translations, (translation) => translation.languageCode)
			translationsByLanguage.forEach((translations, languageCode) => {
				const language = languageCodeOverrides[languageCode] || languageCode
				const data = internalUtils.formatTranslationsAsJson(translations, {
					indent: 2,
				})
				fs.writeFileSync(`${translationsPath}/${language}.json`, data)
			})
		} else {
			expect().nothing()
		}
	}, timeout)
})

describe('package backwards compatibility', () => {
	it('still exports poeditor-client shizz', () => {
		expect(utils.Client).toEqual(jasmine.any(Function))
		expect(utils.getProject).toEqual(jasmine.any(Function))
	})

	it('still exports lib/utils internals', () => {
		let libUtils
		expect(() => {
			libUtils = require('../lib/utils')
		}).not.toThrow()
		expect(libUtils.getProject).toEqual(jasmine.any(Function))
		expect(libUtils.getTranslations).toEqual(jasmine.any(Function))
		expect(libUtils.writeTranslations).toEqual(jasmine.any(Function))
	})
})
