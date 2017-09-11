import Controller from '../controller';

import * as types from './actionTypes';

export function inputSubmit (inputText) {
    return {
        type: types.INPUT_SUBMIT,
        payload: inputText
    }
}

export function inputParse () {
    return {
        type: types.INPUT_PARSE
    }
}

export function processCommand () {
    return {
        type: types.PROCESS_COMMAND
    }
}

export function loadData (url) {

    return function(dispatch) {
        return Controller.loadDataFile(url).then(data => {
            dispatch(receiveData(data));
        }).catch(error => {
            throw(error);
        });
    };
}

export function receiveData(data){
    return {
        type: types.RECEIVE_DATA,
        payload: data
    }
}

export function getWelcomeMessage(){
    return {
        type: types.GET_WELCOME_MESSAGE
    }
}

export function getLocation(){
    return {
        type: types.GET_LOCATION
    }
}

export function setConfig(key, value){
    return {
        type: types.SET_CONFIG,
        key: key,
        value: value
    }
}

export function getMessage(key){
    return {
        type: GET_MESSAGE,
        payload: key
    }
}