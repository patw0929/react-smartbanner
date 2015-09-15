import React, { Component, PropTypes } from 'react';
import { default as ua } from 'ua-parser-js';

class SmartBanner extends Component {
  constructor(props) {
    super(props);

    this.setType();
  }

  static propTypes = {
    daysHidden: PropTypes.number,
    daysReminder: PropTypes.number,
    appStoreLanguage: PropTypes.string,
    button: PropTypes.string,
    storeText: PropTypes.objectOf(PropTypes.string),
    price: PropTypes.objectOf(PropTypes.string),
    force: PropTypes.string
  }

  static defaultProps = {
    daysHidden: 15,
    daysReminder: 90,
    appStoreLanguage: 'us',
    button: 'View',
    storeText: {
      ios: 'On the App Store',
      android: 'In Google Play',
      windows: 'In Windows Store'
    },
    price: {
      ios: 'Free',
      android: 'Free',
      windows: 'Free'
    },
    force: ''
  }

  type = '';
  appId = '';
  settings = {};

  parseAppId() {
    let meta = document.querySelector('meta[name="' + this.settings.appMeta + '"]');
    if (!meta) {
      return;
    }

    if (this.type === 'windows') {
      this.appId = meta.getAttribute('content');
    } else {
      this.appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
    }

    return this.appId;
  }

  setType() {
    let mixins = {
      ios: {
        appMeta: 'apple-itunes-app',
        iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () => {
          return 'https://itunes.apple.com/' + this.props.appStoreLanguage + '/app/id' + this.appId;
        }
      },
      android: {
        appMeta: 'google-play-app',
        iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () => {
          return 'http://play.google.com/store/apps/details?id=' + this.appId;
        }
      },
      windows: {
        appMeta: 'msApplication-ID',
        iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () => {
          return 'http://www.windowsphone.com/s?appid=' + this.appId;
        }
      }
    };

    let agent = ua(navigator.userAgent);

    if (this.props.force.length) {
      this.type = this.props.force;
    } else if (agent.os.name === 'Windows Phone' || agent.os.name === 'Windows Mobile') {
      this.type = 'windows';
    //iOS >= 6 has native support for SmartAppBanner
    } else if (agent.os.name === 'iOS' && parseInt(agent.os.version, 10) < 6) {
      this.type = 'ios';
    } else if (agent.os.name === 'Android') {
      this.type = 'android';
    }

    this.settings = mixins[this.type];

    if (!this.parseAppId()) {
      return;
    }
  }

  render() {
    let link = this.settings.getStoreLink();
    let inStore = this.props.price[this.type] + ' - ' + this.props.storeText[this.type];
    let icon;
    for (let i = 0; i < this.settings.iconRels.length; i++) {
      let rel = document.querySelector('link[rel="' + this.settings.iconRels[i]+'"]');
      if (rel) {
        icon = rel.getAttribute('href');
        break;
      }
    }

    let wrapperClassName = 'smartbanner smartbanner-' + this.type;
    let iconStyle = {
      backgroundImage: 'url(' + icon + ')'
    };

    return (
      <div className={wrapperClassName}>
        <div className="smartbanner-container">
          <a className="smartbanner-close">&times;</a>
          <span className="smartbanner-icon" style={iconStyle}></span>
          <div className="smartbanner-info">
            <div className="smartbanner-title">{this.props.title}</div>
            <div>{this.props.author}</div>
            <span>{inStore}</span>
          </div>

          <a href={link} className="smartbanner-button">
            <span className="smartbanner-button-text">{this.props.button}</span>
          </a>
        </div>
      </div>
    );
  }
}

export default SmartBanner;
