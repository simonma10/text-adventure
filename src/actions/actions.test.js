import * as actions from './index';
import * as types from './actionTypes';
import Controller from '../controller';

describe('actions', () => {
    it('should submit input text', () => {
        const payload = 'my input text'
        const expectedAction = {
            type: types.INPUT_SUBMIT,
            payload
        }
        expect(actions.inputSubmit(payload)).toEqual(expectedAction)
    })

    it('should parse input text', () => {
        const expectedAction = {
            type: types.INPUT_PARSE,
        }
        expect(actions.inputParse()).toEqual(expectedAction)
    })

    it('should process commands', () => {
        const expectedAction = {
            type: types.PROCESS_COMMAND
        }
        expect(actions.processCommand()).toEqual(expectedAction)
    })


    /*it('should send a request to load data', () => {
        const url = '../../data/globals.json'
        const expectedAction = {
            type: types.RECEIVE_DATA,
            payload
        }
        expect(actions.loadData(url)).to
    })
*/
    it('should receive data', () => {
        const payload = 'data'
        const expectedAction = {
            type: types.RECEIVE_DATA,
            payload
        }
        expect(actions.receiveData(payload)).toEqual(expectedAction)
    })

    it('should get a welcome message', () => {
        const expectedAction = {
            type: types.GET_WELCOME_MESSAGE,
        }
        expect(actions.getWelcomeMessage()).toEqual(expectedAction)
    })

    it('should get location', () => {
        const expectedAction = {
            type: types.GET_LOCATION
        }
        expect(actions.getLocation()).toEqual(expectedAction)
    })

    it('should set config', () => {
        const key = 'key';
        const val = 'val';
        const expectedAction = {
            type: types.SET_CONFIG,
            key: key,
            value: val
        }
        expect(actions.setConfig(key, val)).toEqual(expectedAction)
    })

})