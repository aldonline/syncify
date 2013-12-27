MOCHA_OPTS= -w
REPORTER = spec

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		test_out/test_src