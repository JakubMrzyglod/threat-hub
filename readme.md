## General info

Interview task.

## Setup

### Install deps

```
$ npm install
```

### Build

```
$ npm run build
```

### Run

```
$ npm run start
```

### Test
#### All tests
```
$ npm run test
```
##$$ One test
```
$ npm run test <test-file-name>
```


### Generating inputs

To generate inputs can use `run-script.test.ts`.
Set parameters first

```
const PLATFORMS_COUNT = ?;
const ASSERTS_COUNT = ?;
const VULNERABILITIES_COUNT = ?;
const MIN_PLATFORM_RELATIONS_COUNT = ?;
const MAX_PLATFORM_RELATIONS_COUNT = ?;
```

Comment `await expect(execute()).resolves.toBeUndefined();` later,
And run script test:

```
$ npm run test run-script.test
```
