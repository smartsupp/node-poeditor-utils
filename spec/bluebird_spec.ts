import * as bluebird from 'bluebird'

describe('bluebird', function () {
	it('can demultiplex and multiplex a promise', function (done) {
		bluebird.Promise.resolve(['a', 'b', 'c'])
		.map((item)  =>{
			return Promise.resolve(item.toUpperCase())
		})
		.then((items) => {
			expect(items).toEqual(['A', 'B', 'C'])
			done()
		})
	})
})
