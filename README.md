# ChainGuardians.io


## Features

* React 16
* Webpack 4
* Babel 7
* Hot Module Replacement
* Styled Components
* Mob X Store
* React Router
* i18n Translation

## Installation

* npm install
* npm start
* visit `http://0.0.0.0:8080/`

## Stores

Available stores are located in src/App/Stores

* AuthStore (Authentication)
* BalanceStore (Balance requests)
* HistoryStore (History requests)
* MiningStore  (Mining requests)
* ParticipationStore (Participation requests)

Each store serves it's own purpose and can be accessed via the associated property,
the stores are created via Mob-X, it would be worthwhile to read up on the way MobX stores observables throughout the project.[https://mobx.js.org/README.html]

## Pages

Pages can be found in App/Pages
Please note that pages relate to each route that is created via the ReactRouter,
You can find more about the routing within App.js

Pages are made up of multiple components. Read more about Components and the methodology below.

## Components

Each component can be found within App/Components
A component can be seen as a module, which can be used in multiple pages or views,
sometimes components have multiple purposes.

##Partials

Partials can be defined as global blocks, such as header and footer.




