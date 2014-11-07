LINT=./node_modules/.bin/jshint
LINT_FLAGS=
TEST=./node_modules/.bin/mocha
SPEC_FLAGS=-R spec
COVERAGE_FLAGS=-R mocha-text-cov

usage:
	@echo lint: lints the source
	@echo spec: runs the test specs
	@echo coverage: runs the code coverage test
	@echo test: lint, spec and coverage threshold test
	@echo build: builds the minified version
	@echo clean: removes the build artifacts

lint:
	@$(LINT) $(LINT_FLAGS) $(SOURCE)

spec:
	@$(TEST) $(SPEC_FLAGS) test/index

coverage:
	@$(TEST) $(COVERAGE_FLAGS) test/index

test:
	@make lint
	@make spec SPEC_FLAGS="-R dot"
	@make coverage COVERAGE_FLAGS="-R travis-cov"

build:
	@webpack --config webpack.dev.js
	@webpack --config webpack.prod.js

watch:
	@webpack --watch --config webpack.dev.js

clean:
	@if [ -d dist ]; then rm -r dist; fi

.PHONY: usage test spec coverage lint build clean
