import React from 'react';
import SmartBanner from 'react-smartbanner';
import './styles/style.scss';

var DemoComponent = React.createClass({
  render() {
    return (
      <div>
        <SmartBanner force={'android'} />
      </div>
    );
  }
});

React.render(<DemoComponent />, document.getElementById('content'));
