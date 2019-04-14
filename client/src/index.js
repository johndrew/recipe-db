import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as reducers from './store/reducers';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
    blueGrey,
    grey,
    deepOrange,
} from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
    palette: {
        primary: blueGrey,
        secondary: grey,
        error: deepOrange,
    },
    typography: {
        useNextVariants: true,
    },
});

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
