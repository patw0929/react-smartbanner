# React-SmartBanner

Rewrite [Smart App Banner](https://github.com/kudago/smart-app-banner) in React.js.


## Demo & Examples

Live demo: [patw0929.github.io/react-smartbanner](https://patw0929.github.io/react-smartbanner/)

To build the examples locally, run:

```bash
npm install
npm run example
```

or

```bash
yarn
yarn start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-smartbanner is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/main.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-smartbanner --save
```

or

```bash
yarn add react-smartbanner
```

## Usage

Remember to add following meta tags in your HTML page: (Use Facebook app as example)

```html
<head>
  <meta name="apple-itunes-app" content="app-id=284882215">
  <meta name="google-play-app" content="app-id=com.facebook.katana">
  <meta name="msApplication-ID" content="82a23635-5bd9-df11-a844-00237de2db9e">
  <meta name="msApplication-PackageFamilyName" content="facebook_9wzdncrfhv5g">
  <link rel="apple-touch-icon" href="icon.png">
  <link rel="android-touch-icon" href="icon.png">
  <link rel="windows-touch-icon" href="icon.png">
</head>
```

And React-SmartBanner component usage:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import SmartBanner from 'react-smartbanner';

ReactDOM.render(<SmartBanner title={'Facebook'} />, document.getElementById('content'));
```

### Properties

Please see the [Demo Page](https://patw0929.github.io/react-smartbanner/)


## Development (`src` and the build process)

**NOTE:** The source code for the component is in `src`. A UMD bundle is also built to `dist`, which can be included without the need for any build system.

To build, watch and serve the examples (which will also watch the component source), run `npm start`.

If you want to build to the bundle file to `dist/` folder, please run:

```bash
npm run build
```

or

```bash
yarn run build
```

## Contributing

To contribute to react-intl-tel-input, clone this repo locally and commit your code on a separate branch. Please write tests for your code, and run the linter before opening a pull-request:

```bash
npm test
npm run lint
```

or

```bash
yarn test
yarn run lint
```

## Based on

[Smart App Banner](https://github.com/kudago/smart-app-banner)

## License

MIT

Copyright (c) 2015-2017 patw.
