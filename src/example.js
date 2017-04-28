import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SmartBanner from 'react-smartbanner'; // eslint-disable-line import/no-extraneous-dependencies
import cookie from 'cookie-cutter';

class DemoComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceType: '',
    };
  }

  changeType(device) {
    this.setState({
      deviceType: device,
    });
  }

  deleteCookie = () => {
    cookie.set('smartbanner-closed', null, { path: '/', expires: new Date(0) });
    cookie.set('smartbanner-installed', null, { path: '/', expires: new Date(0) });
  }

  render() {
    const navButtonStyle = {
      margin: '20px 0 0 0',
    };

    return (
      <div>
        <SmartBanner
          title={ 'Facebook' }
          force={ this.state.deviceType }
        />

        <div className="row" style={ navButtonStyle }>
          <div className="col-md-10 col-md-offset-1">
            <div className="btn-group btn-group-justified" role="group">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => { this.changeType('android'); } }
                >
                  Android
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => { this.changeType('ios'); } }
                >
                  iOS
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => { this.changeType('windows'); } }
                >
                  WinPhone
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => { this.changeType('kindle'); } }
                >
                  Kindle
                </button>
              </div>
            </div>
            <div className="btn-group btn-group-justified" role="group">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={ this.deleteCookie }
                >
                  Delete Cookie
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DemoComponent />,
  document.getElementById('content'));
