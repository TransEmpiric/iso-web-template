# iso-web-template

###### [Live Production Example](https://isowebtemplate.transempiric.com)

###### Welcome to the ISO World
>*My dear, here we must run as fast as we can, just to stay in place.<br>
And if you wish to go anywhere you must run twice as fast as that.<br><br>*— Lewis Carroll

###### What is this?
> This is a tool set and example of how to create a production capable **`Spring Boot + React + Isomorphic Web Application`**.
The example template can render any view on the server or browser identically. One of the major draw backs of using React in Nashorn is thread safety.
Keeping the Nashorn Engine thread safe and not shared, causes performance issues. The Nashorn Thread Safety problem is solved here by integrating 
a new Spring View Resolver (`TransView`) with a Blocking Queue Resource Pool of **`THREAD-SAFE WARMED-UP NASHORN ENGINES`**. This repo provides a solution to the 
Nashorn Thread Safety problem as well as a tool set for many other issues you are likely to encounter as you navigate through the ISO World (TransView, TransAuth, and TransReact).

## Instructions

### `How to run the production build`

`Checkout the iso-web-template project via git.`
```
git clone https://github.com/TransEmpiric/iso-web-template.git
```

`Insall all npm packages and run the global build from the trans-react root directory`
```
cd iso-web-template/src/main/trans-react
npm install
npm run build
```

`You can now serve the trans-react/ssr and trans-react/client modules from the iso-web-template root directory with Spring Boot.`

```
cd ../../../
./gradlew bootRun
```
`With the browser navigate to http://localhost:8080`

### `How to run the development build`
`This will run a Webpack dev server`

```
cd iso-web-template/src/main/trans-react/client
npm run dev
```

`You may want to run the backend at the same time, which is Spring Boot, so...`

```
cd ../../../../
./gradlew bootRun
```

`With the browser navigate to http://localhost:3000 to use the WebpackDevServer`

## Back-end Features

### TransView
>Thread Safe, Dynamically Allocated, Warmed Up Nashorn Engine Pool

- Uses Blocking Queue Resource Pool with Reentrant Lock and Dynamic Engine Creation
- TransViewTemplateView.java: New Spring Template Integration
- TransViewTemplateViewResolver.java: New Spring Template Integration 
- TransViewTemplateConfigurer.java - New Spring Integration
- TransViewAssetManifest.java: Reads a JSON asset manifest file
- See [TransView](src/main/java/com/transempiric/transView/README.md) sub-project for details

### TransAuth
>Stateless JWT Authentication Module for Spring Security.

- Access Token and Refresh Token Workflow
- Simple, other options can often be overkill
- See [TransAuth](src/main/java/com/transempiric/transAuth/README.md) sub-project for details

## UI Features

### trans-react
> A React tool set and example with Server Side Rendering (SSR) Components. 
Made up of a Sever Side Rendering (SSR) module, [trans-react-ssr](src/main/trans-react/ssr/README.md)
and a Client Side Render (BSR) module, [trans-react-client](src/main/trans-react/client/README.md).

- Isomorphic, runs on the Nashorn
- Multi-module Node Build
- Easy to use Build Scripts
- React with SSR
- Follows Create React App Closely
- React Router
- HOC's for redirects, errors, and security
- Redux
- Flow
- Webpack
- Less
- Stateless JWT Authentication w/ Spring Security
- Token Authentication and Token Refresh Flow
- See [trans-react](src/main/trans-react/README.md) sub-project for details

## Test User:
You can login in with the following credentials:
<br>
jdev: I41LikeBeer!

## Notes:
The subjects within may be moved to sperate projects eventually and posted on Maven Central or NPM.
There are lot of ideas here and not enough time to explain them all.
Please take a look and help out if you can.

❤ From the Transempiric Collective
