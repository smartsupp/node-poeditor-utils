import * as Client from 'poeditor-client'

import * as utils from '..'

describe('package', function () {
	it('exports poeditor-client', function () {
		expect(utils.Client).toBe(Client)
	})

	it('exports meaningful utils', function () {
		expect(utils.getProject).toBe(utils.getProject)
		expect(utils.pullTranslations).toBe(utils.pullTranslations)
	})

	it('is backwards compatible', function() {
		let libUtils
		expect(function () {
			libUtils = require('../lib/utils')
		}).not.toThrow()
		expect(libUtils.getProject).toEqual(jasmine.any(Function))
		expect(libUtils.getProject).toBe(utils.getProject)
		expect(libUtils.getTranslations).toEqual(jasmine.any(Function))
		expect(libUtils.writeTranslations).toEqual(jasmine.any(Function))
	})
})
