.PHONY: default install build test pack publish release

default:

install:
	rm -rf ./node_modules
	npm install

build:
	rm -rf ./lib
	./node_modules/.bin/tsc

test:
	rm -rf ./spec/tmp
	./node_modules/.bin/ts-node ./node_modules/.bin/jasmine

pack:
	rm ./poeditor-utils-*.tgz || :
	npm pack

publish:
	set -x; npm publish $$(npm pack --dry-run --quiet) --dry-run

release: install build test pack publish
