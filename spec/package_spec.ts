import * as utils from '..'

describe('package', function () {
	it('exports meaningful stuff', function () {
		expect(utils.getProject).toEqual(jasmine.any(Function))
		expect(utils.pullTranslations).toBe(utils.pullTranslations)
	})

	describe('backwards compatibility', function () {
		it('still exports poeditor-client constructor', function () {
			expect(utils.Client).toEqual(jasmine.any(Function))
		})

		it('still exports lib/utils internals', function() {
			let libUtils
			expect(function () {
				libUtils = require('../lib/utils')
			}).not.toThrow()
			expect(libUtils.getProject).toEqual(jasmine.any(Function))
			expect(libUtils.getTranslations).toEqual(jasmine.any(Function))
			expect(libUtils.writeTranslations).toEqual(jasmine.any(Function))
		})
	})
})
