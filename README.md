# chatham_smart_map

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

#### Run unit tests with suppressed warnings

```
yarn run test
```

#### Run E2E tests using Cypress

```
yarn run build
yarn start & yarn run wait-on http://localhost:3000
```

Then, to open the Cypress Test Runner in interactive mode:

```
yarn run cypress open
```

In the test runner, you can choose your browser and run all or specific tests.
Alternatively, you run run tests headlessly (in Chrome):

```
yarn run cypress run --browser chrome
```

### Lints and fixes files

```
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
