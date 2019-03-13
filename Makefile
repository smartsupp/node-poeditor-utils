.PHONY: default

default:

install:
	npm install

test:
	./node_modules/.bin/jasmine

publish: test
	npm publish
