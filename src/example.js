import React from 'react';
import ReactDOM from 'react-dom';
import SmartBanner from '../dist/main.js'; // eslint-disable-line import/no-extraneous-dependencies

ReactDOM.render(
  <SmartBanner
    title="Coorpacademy"
    author="Coorpacademy"
    position="top"
    button="Hey"
    ignoreIosVersion
    appMeeta={{ ios: 'apple-itunes-app', android: 'google-play-app' }}
  />,
  document.getElementById('content'),
);
