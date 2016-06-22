[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-readings-realtime-aggregator.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-readings-realtime-aggregator)
[![codecov.io](https://codecov.io/github/innowatio/iwwa-lambda-readings-realtime-aggregator/coverage.svg?branch=master)](https://codecov.io/github/innowatio/iwwa-lambda-readings-realtime-aggregator?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-readings-realtime-aggregator.svg)](https://david-dm.org/innowatio/iwwa-lambda-readings-realtime-aggregator)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-readings-realtime-aggregator/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-readings-realtime-aggregator#info=devDependencies)

# iwwa-lambda-readings-realtime-aggregator

Aggregate readings in real time.

## Deployment

### Configuration

The following environment variables are needed to configure the function:

- `MONGODB_URL`

### Run test

In order to run tests locally a MongoDB instance and a `MONGODB_URL` environment
param are needed.
Then, just run `npm run test` command.
