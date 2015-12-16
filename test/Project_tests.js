'use strict';

var expect = require('expect.js');

var Project = require('../lib/Project');

describe('Project', function () {
	beforeEach(function () {
		this.project = new Project('sometoken', 'somename', 2, {
			something: 3,
		});
	});

	afterEach(function () {
		delete this.project;
	});

	it('creates a proxy object for working with a project', function () {
		expect(this.project.apiToken).to.be('sometoken');
		expect(this.project.name).to.be('somename');
		expect(this.project.id).to.be(2);
		expect(this.project.data).to.have.property('something');
	});
});
