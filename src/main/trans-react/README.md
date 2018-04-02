# trans-react
> A Server Side Rendering (SSR) aware React example.

## Features
- `Isomorphic - Runs on the Nashorn`
- `Multi-Modulde Node Build`
- `Easy to use Build Scripts`
- `React`
- `Follows Create React App Closely`
- `React Router`
- `HOC's for redirects, errors, and secuity`
- `Redux`
- `Flow`
- `Webpack`
- `Less`
- `Stateless JWT Authentication w/ Spring Security`


## This is the root JavaScript module.

You can run `npm install` and `npm build` for both sub-modules (`trans-react/client` and `trans-react/ssr`) here.

`(Recommended)` Calling `npm install` here will make sure that all npm packages are properly installed.

`(Recommended)` Calling `npm build` here will first build the `trans-react/client` module and then the `trans-reat/ssr`

## Installation

### `How to run the production build`

```
cd iso-web-template/src/main/trans-react
npm install
npm run build
cd ../../../

```
`You can now serve the ssr and client apps with Spring Boot.`

```
cd ../../../
./gradlew bootRun
```


### `How to run the development build`
`This will run a Webpack dev server`

```
cd iso-web-template/src/main/trans-react
npm install
npm run dev
```

`You may want to run the backend, which is Spring Boot, so...`
```
cd ../../../
./gradlew bootRun
```

## Test User:
You can login in with the following credentials:
<br>
jdev: I41LikeBeer!

❤ From the Transempiric Collective