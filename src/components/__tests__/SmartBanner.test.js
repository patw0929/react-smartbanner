/* eslint-disable import/first, react/no-find-dom-node, no-eval */
jest.mock('cookie-cutter', () => {
  return {
    set: jest.fn(),
    get: jest.fn(),
  };
});

import React from 'react';
import { mount } from 'enzyme';
import SmartBanner from '../SmartBanner';

describe('SmartBanner', function () { // eslint-disable-line func-names
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
      url: '',
    };

    this.makeSubject = (_props = {}) => {
      const props = {
        ...this.params,
        ..._props,
      };

      return mount(
        <SmartBanner
          { ...props }
        />,
        {
          attachTo: document.getElementById('root'),
        },
      );
    };
  });

  it('should be rendered', () => {
    const subject = this.makeSubject();

    expect(subject.length).toBeTruthy();
  });

  describe('snapshots', () => {
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
    it('should change html classList and set cookie after click the close button', () => {
      const subject = this.makeSubject({
        force: 'android',
      });

      subject.find('.smartbanner-close').simulate('click');

      expect(window.document.querySelector('html').classList).not.toContain('smartbanner-show');
      expect(cookie.set).toBeCalledWith('smartbanner-closed', 'true', {
        path: '/',
        expires: 1495756800000,
      });
    });
  });

  describe('click install on smartbanner', () => {
    it('should change html classList and set cookie after click the close button', () => {
      const subject = this.makeSubject({
        force: 'android',
      });

      subject.find('.smartbanner-button').simulate('click');

      expect(window.document.querySelector('html').classList).not.toContain('smartbanner-show');
      expect(cookie.set).toBeCalledWith('smartbanner-installed', 'true', {
        path: '/',
        expires: 1502236800000,
      });
    });
  });
});
