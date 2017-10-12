import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import Console from './components/console';
import reducers from './reducers';
import { loadData, getWelcomeMessage, getLocation} from './actions';

// create redux store using thunk middleware
let store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension && window.devToolsExtension()
    )
);

// set up calllback
let unsubscribe = store.subscribe(handleChange);

// load global data file into store
store.dispatch(loadData('../data/jungle-adv-v01.json'));


// store change handler
function handleChange(){
    let tempState = store.getState();
    if (tempState.inputOutput.status === 'loaded'){
        renderConsole(store);
        store.dispatch(getWelcomeMessage());
    } else if (tempState.inputOutput.config['showLoc'] === "true"){
        store.dispatch(getLocation());
    }
}



// render UI
function renderConsole(){
    ReactDOM.render(
        <Provider store={store}>
            <Console/>
        </Provider>
        , document.querySelector('.container')
    );
}








/*

 //const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
 store={createStoreWithMiddleware(reducers)}
 */