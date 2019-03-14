.PHONY: default install build test release

default:

install:
	rm -rf ./node_modules
	npm install

build:
	rm -rf ./lib ./index.js ./index.d.ts
	./node_modules/.bin/tsc

test:
	./node_modules/.bin/ts-node ./node_modules/.bin/jasmine

release: install build test
	npm publish --dry-run
