import React from 'react';

import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import thunk from 'redux-thunk';

import * as Reducers from 'Redux/Reducers';

import App from 'UI/App/App.react';

const middleware = [thunk];

const store = createStore(
	combineReducers({
		...Reducers
	}),
	applyMiddleware(...middleware)
);

export default (
	<Provider store={store}>
		<MemoryRouter initialEntries={['/wizard/1']} initialIndex={0}>
			<App />
		</MemoryRouter>
	</Provider>
);
