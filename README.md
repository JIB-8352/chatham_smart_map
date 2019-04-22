# chatham_smart_map

## Release Notes (v1.0)

### New Software Features

1. Added graphs for all datastreams reported by each sensor. Graphs also respond to events triggered by the timelapse feature.
2. Timelapse components conditionally render based on whether a sensor is selected and if the user is on the Inundation layer or not.
3. Added a responsive heatmap as part of the Inundation layer.
4. New look for the date-picker! The component now resembles the date-picker used by Google Flights.
5. Minor UI and positioning changes to console components.

### Bug Fixes

1. A sensor's observations are now reset whenever new data is fetched form the API.
2. Fixed the hover popup flickering issue for sensors at the edge of the screen.

### Known Bugs

1. The graphs' tooltips sometimes cover the y-axis labels making text hard to read.
2. The plot line that moves on the graphs as the timelapse advances may not disappear when the tooltip disappears.
3. The x-axis date labels may have some text cut-off due to limited space.
4. Water inundation values don't use actual LIDAR elevation data.

## Install Guide

### Pre-requisites

There is no special hardware configuration needed. On the software side, you require `node` and `yarn` installed on your machine. The project was developed using `node v10.15.0` and `yarn v1.15.2` however any LTS version of `node` and any version of `yarn`, respectively, should work.

### Dependent Libraries

A list of project dependencies can be found in the `package.json` file.

### Download Instructions

Download this project from Github or clone it using `git`:

```
git clone https://github.com/JIB-8352/chatham_smart_map.git
```

### Building, Installation and Deploying

Once you have the project cloned, you may follow the following instructions to install dependencies, build the project and deploying it.

#### Install dependencies

```
yarn install
```

#### Compiles and hot-reloads for development

```
yarn run serve
```

#### Compiles and minifies for production

```
yarn run build
```

#### Run your tests

##### Run unit tests

Note that warning are suppressed by default

```
yarn run test
```

##### Run E2E tests using Cypress

```
yarn run build
yarn start & yarn run wait-on http://localhost:3000
```

Then, to open the Cypress Test Runner in interactive mode (recommended for debugging purposes):

```
yarn run cypress open
```

In the test runner, you can choose your browser and run all or specific tests.
Alternatively, you run run tests headlessly (in Chrome):

```
yarn run cypress run --browser chrome
```

Note that Cypress tests can be a bit flaky and require the [Sea Level Sensors API](https://api.sealevelsensors.org/) to be up and running. If you fail a Cypress test while the API is up, and you think that your code should not break the tests, re-running them might be a good idea.

All Cypress tests run by [Travis CI](https://travis-ci.com/JIB-8352/chatham_smart_map) are recorded and can be accessed at the [Cypress dashboard](https://dashboard.cypress.io/#/projects/45s3w7/runs).

#### Lints and fixes files

```
yarn run lint
```

#### Deploying

Note that by default, the `master` branch of this repository gets deployed to Heroku whenever commits are made to the branch. The app is deployed to [https://chatham-smart-map.herokuapp.com/](https://chatham-smart-map.herokuapp.com/)

#### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Troubleshooting

1. If Cypress fails to install, you may need to do the following:

```
yarn install
yarn run cypress install
```

2. If you encounter other errors with installing the package dependencies, switch to `node 10.15.0`. We recommend installing and using [`nvm`](https://github.com/creationix/nvm#installation-and-update) to manage node versions.
