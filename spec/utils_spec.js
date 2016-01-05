'use strict';

var helpers = require('../lib/helpers');

var utils = require('../lib/utils');

describe('utils', function() {
	describe('#getProject', function () {
		it('delegates to helpers.getProject', function () {
			var helper = spyOn(helpers, 'getProject');
			utils.getProject('my token', 'my project');
			expect(helper).toHaveBeenCalledWith('my token', 'my project');
		});
	});

	describe('#pullTranslations', function () {
		beforeEach(function () {
			this.project = {};
			this.getProject = spyOn(helpers, 'getProject').and.returnValue(Promise.resolve(this.project));
			this.translations = [];
			this.getTranslations = spyOn(helpers, 'getTranslations').and.returnValue(Promise.resolve(this.translations));
			this.files = [
				'my-translations/en.json',
				'my-translations/de.json'
			];
			this.writeTranslations = spyOn(helpers, 'writeTranslations').and.returnValue(Promise.resolve(this.files));
			this.getFile = function (translation) {
				return './my-translations/' + translation.language + '.json';
			};
		});

		it('returns a promise', function () {
			expect(utils.pullTranslations('my token', 'my project', this.getFile).then).toEqual(jasmine.any(Function));
		});

		it('delegates to helper functions', function (done) {
			var options = {};
			utils.pullTranslations('my token', 'my project', this.getFile, options)
			.then(function (files) {
				expect(this.getProject).toHaveBeenCalledWith('my token', 'my project');
				expect(this.getTranslations).toHaveBeenCalledWith(this.project);
				expect(this.writeTranslations).toHaveBeenCalledWith(this.translations, this.getFile, options);
				expect(files).toEqual(this.files);
				done();
			}.bind(this))
			.catch(done.fail);
		});
	});
});
