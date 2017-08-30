import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/style.scss';

const isClient = typeof window !== 'undefined';
let ua;
let cookie;

class SmartBanner extends Component {
  static propTypes = {
    daysHidden: PropTypes.number,
    daysReminder: PropTypes.number,
    appStoreLanguage: PropTypes.string,
    button: PropTypes.string,
    storeText: PropTypes.objectOf(PropTypes.string),
    price: PropTypes.objectOf(PropTypes.string),
    force: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    ignoreIosVersion: PropTypes.bool,
    appMeta: PropTypes.shape({
      android: PropTypes.string,
      ios: PropTypes.string,
      windows: PropTypes.string,
      kindle: PropTypes.string,
    }),
    onClose: PropTypes.func,
    onInstall: PropTypes.func,
  };

  static defaultProps = {
    daysHidden: 15,
    daysReminder: 90,
    appStoreLanguage: isClient ?
      (window.navigator.language || window.navigator.userLanguage).slice(-2) || 'us' : 'us',
    button: 'View',
    storeText: {
      ios: 'On the App Store',
      android: 'In Google Play',
      windows: 'In Windows Store',
      kindle: 'In the Amazon Appstore',
    },
    price: {
      ios: 'Free',
      android: 'Free',
      windows: 'Free',
      kindle: 'Free',
    },
    force: '',
    title: '',
    author: '',
    appMeta: {
      ios: 'apple-itunes-app',
      android: 'google-play-app',
      windows: 'msApplication-ID',
      kindle: 'kindle-fire-app',
    },
  };

  constructor(props) {
    super(props);

    if (!__SERVER__) {
      ua = require('ua-parser-js'); // eslint-disable-line global-require
      cookie = require('cookie-cutter'); // eslint-disable-line global-require
    }

    this.state = {
      type: '',
      appId: '',
      settings: {},
    };
  }

  componentWillMount() {
    this.setType(this.props.force);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.force !== this.props.force) {
      this.setType(nextProps.force);
    }
  }

  setType(deviceType) {
    let type;

    if (isClient) {
      const agent = ua(window.navigator.userAgent);

      if (deviceType) { // force set case
        type = deviceType;
      } else if (agent.os.name === 'Windows Phone' || agent.os.name === 'Windows Mobile') {
        type = 'windows';
      // iOS >= 6 has native support for Smart Banner
      } else if (agent.os.name === 'iOS'
        && (this.props.ignoreIosVersion
          || parseInt(agent.os.version, 10) < 6
          || agent.browser.name !== 'Mobile Safari')
      ) {
        type = 'ios';
      } else if (agent.device.vender === 'Amazon' || agent.browser.name === 'Silk') {
        type = 'kindle';
      } else if (agent.os.name === 'Android') {
        type = 'android';
      }
    }

    this.setState({
      type,
    }, () => {
      if (type) {
        this.setSettingsByType();
      }
    });
  }

  setSettingsByType() {
    const mixins = {
      ios: {
        appMeta: () => this.props.appMeta.ios,
        iconRels: ['apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () =>
          `https://itunes.apple.com/${this.props.appStoreLanguage}/app/id`,
      },
      android: {
        appMeta: () => this.props.appMeta.android,
        iconRels: ['android-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () =>
          'http://play.google.com/store/apps/details?id=',
      },
      windows: {
        appMeta: () => this.props.appMeta.windows,
        iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () =>
          'http://www.windowsphone.com/s?appid=',
      },
      kindle: {
        appMeta: () => this.props.appMeta.kindle,
        iconRels: ['windows-touch-icon', 'apple-touch-icon-precomposed', 'apple-touch-icon'],
        getStoreLink: () =>
          'amzn://apps/android?asin=',
      },
    };

    this.setState({
      settings: mixins[this.state.type],
    }, () => {
      if (this.state.type) {
        this.parseAppId();
      }
    });
  }

  parseAppId() {
    if (!isClient) {
      return '';
    }

    const meta = window.document.querySelector(
      `meta[name="${this.state.settings.appMeta()}"]`);

    if (!meta) {
      return '';
    }

    let appId = '';

    if (this.state.type === 'windows') {
      appId = meta.getAttribute('content');
    } else {
      appId = /app-id=([^\s,]+)/.exec(meta.getAttribute('content'))[1];
    }

    this.setState({
      appId,
    });

    return appId;
  }

  hide = () => {
    if (isClient) {
      window.document.querySelector('html').classList.remove('smartbanner-show');
    }
  }

  show = () => {
    if (isClient) {
      window.document.querySelector('html').classList.add('smartbanner-show');
    }
  }

  close = () => {
    this.hide();
    cookie.set('smartbanner-closed', 'true', {
      path: '/',
      expires: +new Date() + this.props.daysHidden * 1000 * 60 * 60 * 24,
    });

    if (this.props.onClose && typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  install = () => {
    this.hide();
    cookie.set('smartbanner-installed', 'true', {
      path: '/',
      expires: +new Date() + this.props.daysReminder * 1000 * 60 * 60 * 24,
    });

    if (this.props.onInstall && typeof this.props.onInstall === 'function') {
      this.props.onInstall();
    }
  }

  retrieveInfo() {
    const link = this.props.url || this.state.settings.getStoreLink() + this.state.appId;
    const inStore = `
      ${this.props.price[this.state.type]} - ${this.props.storeText[this.state.type]}`;
    let icon;

    if (isClient) {
      for (let i = 0, max = this.state.settings.iconRels.length; i < max; i++) {
        const rel = window.document.querySelector(
          `link[rel="${this.state.settings.iconRels[i]}"]`);

        if (rel) {
          icon = rel.getAttribute('href');
          break;
        }
      }
    }

    return {
      icon,
      link,
      inStore,
    };
  }

  render() {
    if (!isClient) {
      return <div />;
    }

    // Don't show banner when:
    // 1) if device isn't iOS or Android
    // 2) website is loaded in app,
    // 3) user dismissed banner,
    // 4) or we have no app id in meta
    if (!this.state.type
      || window.navigator.standalone
      || cookie.get('smartbanner-closed')
      || cookie.get('smartbanner-installed')) {
      return <div />;
    }

    if (!this.state.appId) {
      return <div />;
    }

    this.show();

    const { icon, link, inStore } = this.retrieveInfo();
    const wrapperClassName = `smartbanner smartbanner-${this.state.type}`;
    const iconStyle = {
      backgroundImage: `url(${icon})`,
    };

    return (
      <div className={ wrapperClassName }>
        <div className="smartbanner-container">
          <a className="smartbanner-close" onClick={ this.close }>&times;</a>
          <span className="smartbanner-icon" style={ iconStyle } />
          <div className="smartbanner-info">
            <div className="smartbanner-title">{this.props.title}</div>
            <div className="smartbanner-author">{this.props.author}</div>
            <div className="smartbanner-description" >{inStore}</div>
          </div>
          <div className="smartbanner-wrapper">
            <a href={ link } onClick={ this.install } className="smartbanner-button">
              <span className="smartbanner-button-text">{this.props.button}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SmartBanner;
