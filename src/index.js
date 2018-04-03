import React from 'react';
import App from './components/App';
import Dummy from './components/dummy';
import registerServiceWorker from './registerServiceWorker';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';
import parkings from './reducer/index';

const store = createStore(
  	parkings,
  	applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <Dummy />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
