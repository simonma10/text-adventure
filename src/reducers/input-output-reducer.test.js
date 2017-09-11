import _ from 'lodash';

import reducer from './input-output-reducer';
import * as types from '../actions/actionTypes';
import TestStore from '../engine/test-store-wrapper';


let ts = new TestStore();

describe ('store', () => {
    it('should load data from file', () => {
        expect(ts.stat()).toEqual('ready');
    });
    it('should have config items', () => {
        expect(ts.conf('locLimbo')).toEqual(666);
        expect(ts.conf('engineName')).toEqual('adventure.js');
    });
    it('should have messages items', () => {
        expect(ts.msg('mScore')).toEqual('Your score is ');
        expect(ts.msg('mHelp')).toEqual('Yes, you certainly need it.');
    });
    it('should have verbs', () => {
        expect(ts.store.getState().verbs['north']).toEqual('go');
        expect(ts.store.getState().verbs['take']).toEqual('get');
    });
    it('should have nouns', () => {
        expect(ts.store.getState().nouns['e']).toEqual('east');
        expect(ts.store.getState().nouns['vast']).toEqual('treasure');
    });

});

const initialState= {
    outputText: [
        "#=============================#",
        "# Welcome back to the 1980s!! #",
        "#=============================#"],
    inputText:'',
    parsedText: [],
    parsedVerbs:[],
    parsedNouns:[],
    config:{
        "prompt":"> ",
        "header":"[Header Text from reducer]"
    },
    messages:[],
    verbs:[],
    nouns:[],
    locations:[],
    items:[],
    conditions:[],
    status: "loading"
}


describe('input-output reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    });
    //store.dispatch({type: types.RECEIVE_DATA, payload: data});
    ts.store.dispatch({type: types.GET_WELCOME_MESSAGE});
    it('should return a welcome message', () => {
        expect(ts.res()).toEqual(ts.conf('msgWelcome'));
    });


});


/*import { createStore } from 'redux'
 var fs = require("fs");

 //=====================================================================
 // Set up the store
 // read json file synchronously and load directly to store, using the
 // reducer's RECEIVE_DATA action
 //=====================================================================
 let store = createStore(reducer);
 let data = JSON.parse(fs.readFileSync("data/globals.json"));

 store.dispatch({type: types.RECEIVE_DATA, payload: data});*/