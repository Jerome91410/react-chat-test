import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home from './screens/Home';
import store from './AppStore';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path="/" component={Home} />
        </Router>
      </Provider>
    );
  }
}

export default App;
