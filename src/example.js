import React from 'react';
import SmartBanner from 'react-smartbanner';
import cookie from 'cookie-cutter';

var DemoComponent = React.createClass({
  getInitialState() {
    return {
      deviceType: ''
    };
  },
  changeType(device) {
    this.setState({
      deviceType: device
    });
  },
  deleteCookie() {
    cookie.set('smartbanner-closed', null, { path: '/', expires: new Date(0) });
    cookie.set('smartbanner-installed', null, { path: '/', expires: new Date(0) });
  },
  render() {
    let navButtonStyle = {
      margin: '20px 0 0 0'
    };

    return (
      <div>
        <SmartBanner title={'Facebook'}
                     force={this.state.deviceType} />

        <div className="row" style={navButtonStyle}>
          <div className="col-md-10 col-md-offset-1">
            <div className="btn-group btn-group-justified" role="group">
              <div className="btn-group" role="group">
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.changeType.bind(this, 'android')}>Android</button>
              </div>
              <div className="btn-group" role="group">
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.changeType.bind(this, 'ios')}>iOS</button>
              </div>
              <div className="btn-group" role="group">
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.changeType.bind(this, 'windows')}>Windows Phone</button>
              </div>
            </div>
            <div className="btn-group btn-group-justified" role="group">
              <div className="btn-group" role="group">
                <button type="button"
                        className="btn btn-warning"
                        onClick={this.deleteCookie}>Delete Cookie</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

React.render(<DemoComponent />, document.getElementById('content'));
