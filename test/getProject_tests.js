'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var Promise = require('bluebird');

var Projects = require('poeditor-client/src/Projects');

var getProject = require('../lib/getProject');

describe('getProject', function () {
	beforeEach(function () {
		this.sandbox = sinon.sandbox.create();
		this.sandbox.stub(Projects.prototype, 'list').returns(new Promise.resolve([
			{id: 1, name: '1'},
			{id: 2, name: 'somename'},
			{id: 3, name: '3'}
		]));
	});

	afterEach(function () {
		this.sandbox.restore();
	});

	it('returns a promise', function () {
		expect(getProject('sometoken', 'somename').then).to.be.a(Function);
	});

	it('gets project data via POEditor API', function (done) {
		getProject('sometoken', 'somename')
		.then(function (project) {
			done();
			expect(project).to.be.an('object');
			expect(project.apiToken).to.be('sometoken');
			expect(project.id).to.be(2);
			expect(project.data.name).to.be('somename');
		});
	});
});
