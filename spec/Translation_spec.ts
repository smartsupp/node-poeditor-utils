import {default as Translation} from '../src/lib/Translation'

describe('Translation', function () {
	it('is mutable', function () {
	    const translation = new Translation('app.title', 'en', 'en title')
		translation.term = translation.term.split('.').slice(1).join()
		expect(translation.term).toBe('title')
	})
})
