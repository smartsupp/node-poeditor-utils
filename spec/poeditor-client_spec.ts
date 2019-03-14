describe('poeditor-client', function () {
	it('can be required', function () {
		expect(function () {
			require('poeditor-client')
		}).not.toThrowError()
	})

	it('returns promises', function () {
		const Client = require('poeditor-client')
		// TODO
		expect(new Client('my token').projects.list().then).toEqual(jasmine.any(Function))
	})
})
