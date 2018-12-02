import 'es5-shim';
import 'es6-shim';
import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './appcontainer';

window.CFG = {
  'API': 'hq.dribbleup.com',
  // 'API': 'http://localhost:8003/v1',
  'CMS': 'YOUR_CMS_LINK_HERE'
};

ReactDOM.render(<AppContainer />, document.getElementById('app'));
