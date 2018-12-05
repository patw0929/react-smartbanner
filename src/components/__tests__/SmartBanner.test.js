/* eslint-disable import/first, max-len, no-restricted-properties */
jest.mock('cookie-cutter', () => {
  return {
    set: jest.fn(),
    get: jest.fn(),
  };
});

import React from 'react';
import { mount } from 'enzyme';
import SmartBanner from '../SmartBanner';

// eslint-disable-next-line func-names
describe('SmartBanner', function() {
  let cookie;

  beforeEach(() => {
    jest.resetModules();

    cookie = require('cookie-cutter'); // eslint-disable-line global-require

    document.querySelector('head').innerHTML = `
      <meta name="apple-itunes-app" content="app-id=284882215">
      <meta name="google-play-app" content="app-id=com.facebook.katana">
      <meta name="kindle-fire-app" content="app-id=B0094BB4TW">
      <meta name="msApplication-ID" content="82a23635-5bd9-df11-a844-00237de2db9e">
      <meta name="msApplication-PackageFamilyName" content="facebook_9wzdncrfhv5g">`;
    document.body.innerHTML = '<div id="root"></div>';

    this.params = {
      force: '',
      title: '',
      author: '',
      url: {},
    };

    this.makeSubject = (_props = {}) => {
      const props = {
        ...this.params,
        ..._props,
      };

      return mount(<SmartBanner {...props} />, {
        attachTo: document.getElementById('root'),
      });
    };
  });

  it('should be rendered', () => {
    const subject = this.makeSubject();

    expect(subject.length).toBeTruthy();
  });

  describe('type snapshots', () => {
    it('should be matched the snapshot (no type)', () => {
      const subject = this.makeSubject();

      expect(subject.html()).toMatchSnapshot();
    });

    it('should be matched the snapshot (android)', () => {
      const subject = this.makeSubject({
        force: 'android',
      });

      expect(subject.state('type')).toBe('android');
      expect(subject.html()).toMatchSnapshot();
    });

    it('should be matched the snapshot (ios)', () => {
      const subject = this.makeSubject({
        force: 'ios',
      });

      expect(subject.state('type')).toBe('ios');
      expect(subject.html()).toMatchSnapshot();
    });

    it('should be matched the snapshot (kindle)', () => {
      const subject = this.makeSubject({
        force: 'kindle',
      });

      expect(subject.state('type')).toBe('kindle');
      expect(subject.html()).toMatchSnapshot();
    });

    it('should be matched the snapshot (windows)', () => {
      const subject = this.makeSubject({
        force: 'windows',
      });

      expect(subject.state('type')).toBe('windows');
      expect(subject.html()).toMatchSnapshot();
    });
  });

  describe('close smartbanner', () => {
    it('should change html classList and set cookie after invoke the close function', () => {
      const spy = jest.fn();
      const subject = this.makeSubject({
        force: 'android',
        onClose: spy,
      });

      subject.instance().close();

      expect(window.document.querySelector('html').classList).not.toContain(
        'smartbanner-show'
      );
      expect(cookie.set).toBeCalledWith('smartbanner-closed', 'true', {
        path: '/',
        expires: 'Fri, 26 May 2017 00:00:00 GMT',
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('click install on smartbanner', () => {
    it('should change html classList and set cookie after invoke the install function', () => {
      const spy = jest.fn();
      const subject = this.makeSubject({
        force: 'android',
        onInstall: spy,
      });

      subject.instance().install();

      expect(window.document.querySelector('html').classList).not.toContain(
        'smartbanner-show'
      );
      expect(cookie.set).toBeCalledWith('smartbanner-installed', 'true', {
        path: '/',
        expires: 'Thu, 24 Aug 2017 00:00:00 GMT',
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should only render div in SERVER env', () => {
    global.window = undefined;
    document.querySelector('head').innerHTML = '';
    const subject = this.makeSubject();

    expect(subject.html()).toBe('<div></div>');
  });

  it('should change type in state after receiving new force props', () => {
    const subject = this.makeSubject({
      force: 'android',
    });

    expect(subject.state('type')).toBe('android');

    subject.setProps({
      force: 'ios',
    });

    expect(subject.state('type')).toBe('ios');
  });

  it('should remove html class names on unload', () => {
    const subject = this.makeSubject();

    subject.unmount();
    expect(window.document.querySelector('html').classList).not.toContain(
      'smartbanner-show'
    );
    expect(window.document.querySelector('html').classList).not.toContain(
      'smartbanner-margin-top'
    );
    expect(window.document.querySelector('html').classList).not.toContain(
      'smartbanner-margin-bottom'
    );
  });

  describe('userAgent', () => {
    it('should change type to "ios" if we set iOS user agent', () => {
      window.navigator.__defineGetter__('userAgent', () => {
        return 'OperaMobile/12.02 (iPad; CPU OS 9_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 Mobile Safari/537.36';
      });

      const subject = this.makeSubject();

      expect(subject.state('type')).toBe('ios');
    });

    it('should change type to "android" if we set android user agent', () => {
      window.navigator.__defineGetter__('userAgent', () => {
        return 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19';
      });

      const subject = this.makeSubject();

      expect(subject.state('type')).toBe('android');
    });

    it('should change type to "windows" if we set windows phone user agent', () => {
      window.navigator.__defineGetter__('userAgent', () => {
        return 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 810)';
      });

      const subject = this.makeSubject();

      expect(subject.state('type')).toBe('windows');
    });

    it('should change type to "kindle" if we set kindle user agent', () => {
      window.navigator.__defineGetter__('userAgent', () => {
        return 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.1.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true';
      });

      const subject = this.makeSubject();

      expect(subject.state('type')).toBe('kindle');
    });
  });
});
