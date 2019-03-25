.PHONY: default install build test release

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

release: install build test
	npm publish --dry-run
