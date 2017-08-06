import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import Console from './components/console';
import reducers from './reducers';
import { loadData, getWelcomeMessage, getLocation, setConfig } from './actions';

// create redux store using thunk middleware
const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension && window.devToolsExtension()
    )
);

// set up calllback
const unsubscribe = store.subscribe(handleChange);

// load global data file into store
store.dispatch(loadData('../data/globals.json'));

ReactDOM.render(
    <Provider store={store}>
        <Console/>
    </Provider>
    , document.querySelector('.container')

);

function handleChange(){
    let tempState = store.getState();
    if (tempState.inputOutput.status === 'loaded'){
        store.dispatch(getWelcomeMessage());
    } else if (tempState.inputOutput.config['showLoc'] === "true"){
        store.dispatch(getLocation());
    }
}


/*

 //const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
 store={createStoreWithMiddleware(reducers)}
 */