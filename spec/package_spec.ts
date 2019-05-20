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
	const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

	beforeEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
	})

	const tmpPath = './spec/tmp'
	fs.mkdirSync(tmpPath)

	it('is as it is', async () => {
		if (apiToken && projectName) {
			const translationsPath = `${tmpPath}/use-case`
			fs.mkdirSync(translationsPath)

			const languages = {
				'en': 'english',
			}
			const getPathCallback = (translation) => {
				const language = languages[translation.languageCode] || translation.languageCode
				return `${translationsPath}/${language}.json`
			}
			const paths = await utils.pullTranslations(apiToken, projectName, getPathCallback)
			expect(paths).toContain(`${translationsPath}/english.json`)
		} else {
			expect().nothing
		}
	})

	it('could be better, as in moar flexible', async () => {
		if (apiToken && projectName) {
			const translationsPath = `${tmpPath}/better-use-case`
			fs.mkdirSync(translationsPath)

			// TODO: get translations for multiple projects at once
			const translations = await Promise.all([projectName].map((projectName) => {
			// TODO: get translations directly with API key, skip project step
				return internalUtils.getProject(apiToken, projectName)
				.then((project) => internalUtils.getTranslations(project))
			}))
			.then((translations) => [].concat(...translations))
			const translationsByLanguage = internalUtils.groupTranslations(translations, (translation) => translation.languageCode)
			const languages = {
				'en': 'english',
			}
			translationsByLanguage.forEach((translations, languageCode) => {
				const language = languages[languageCode] || languageCode
				// TODO: allow whitespace control for JSON formatting
				const data = internalUtils.formatTranslations(translations)
				require('fs').writeFileSync(`${translationsPath}/${language}.json`, data)
			})
		}
	})

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
	})
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
