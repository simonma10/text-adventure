import _ from 'lodash';
import reducer from '../reducers/input-output-reducer';
import * as types from '../actions/actionTypes';
import { createStore, compose } from 'redux'
var fs = require("fs");


export default class TestStore {
    constructor(){
        this.store = this.initStore();
    }

    initStore(){
    //=====================================================================
    // Set up the store
    // read json file synchronously and load directly to store, using the
    // reducer's RECEIVE_DATA action
    //=====================================================================
        let store = createStore(reducer);

        let data = JSON.parse(fs.readFileSync("data/globals.json"));

        store.dispatch({type: types.RECEIVE_DATA, payload: data});
        return store;
    }


    res(){
        return _.last(this.store.getState().outputText);
    }

    conf(configKey){
        return this.store.getState().config[configKey];
    }

    msg(msgKey){
        return this.store.getState().messages[msgKey];
    }

    stat(){
        return this.store.getState().status;
    }

    input(text){
        this.store.dispatch({type: types.INPUT_SUBMIT, payload: text});
        this.store.dispatch({type: types.INPUT_PARSE});
        this.store.dispatch({type: types.PROCESS_COMMAND});
    }

    resetItems(){
        this.store.items = [
            {
                "id":1,
                "location":1,
                "score":-10,
                "name": "herring",
                "shortdescription":"a red herring",
                "description":"A small red fish.  It smells. It really smells."
            },
            {
                "id":2,
                "location":666,
                "score":20,
                "name":"treasure",
                "shortdescription":"vast quantities of treasure",
                "description":"Vast quantities of treasure - what more do you need to know?"
            },
            {
                "id":3,
                "location":3,
                "score":10,
                "name":"torch",
                "shortdescription":"a really handy torch",
                "description":"What a bright idea!  With this torch, you can really shine."
            }
        ]
    }





}



