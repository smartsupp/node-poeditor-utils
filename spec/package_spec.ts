import * as utils from '..'

const apiToken = process.env.TEST_API_TOKEN
const projectName = process.env.TEST_PROJECT_NAME

describe('package', () => {
	it('exports meaningful stuff', () => {
		expect(utils.pullTranslations).toBe(utils.pullTranslations)
	})
})

describe('package usage', () => {
	const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

	beforeEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
	})

	it('works as intended', async () => {
		if (apiToken && projectName) {
			const languages = {
				'en': 'english',
			}
			const paths = await utils.pullTranslations(apiToken, projectName, (translation) => {
				const language = languages[translation.languageCode] || translation.languageCode
				return `./spec/tmp/${language}.json`
			})
			expect(paths).toContain(`./spec/tmp/english.json`)
		} else {
			expect().nothing
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
