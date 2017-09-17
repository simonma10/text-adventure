
import _ from 'lodash';
import reducer from '../reducers/input-output-reducer';
import * as types from '../actions/actionTypes';
import { testConditions } from './conditions-logic';

import TestStore from '../engine/test-store-wrapper';

let ts = new TestStore();

describe ('conditions-logic', () => {


    it('should offer sarcastic help at loc 1', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.input('help');
        expect(ts.res()).toEqual("You can't possibly need help already?!");
    });


    it('should offer help at loc 2', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 2});
        ts.input('help');
        expect(ts.res()).toEqual("It's really dark... with a bit more light you might be able to look around.");
    });

    it('should respond to shining the torch in various places', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 3});
        ts.resetItems();
        ts.input('get torch');
        expect(ts.res()).toEqual(ts.msg('mGet') + 'torch.');
        //ts.input('use torch');
        //expect(ts.res()).toEqual("You experience a moment of illumination.");
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 2});
        ts.input('use torch');
        expect(ts.res()).toEqual("You scan the room with the torch, and its light reveals vast amounts of shining treasure!");

    });
/*
    it('should offer help at loc 2', () => {
        ts.input('use torch');
        expect(ts.res()).toEqual("Maybe you should look around to see what the torch has already revealed...");
    });
*/

    it('should not allow get teleporter', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.input('get teleporter');
        expect(ts.res()).toEqual("It looks rather heavy, and is probably bolted to the floor.");
    });

    it('should allow use of the teleporter', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.store.dispatch({type: types.SET_CONFIG, key: 'usedTeleporter', value: "false"});
        ts.input('use teleporter');
        expect(ts.res()).toEqual("The world suddenly turns very... wavy.  You get the impression you have been... translated.");
        expect(ts.conf('myLoc')).toEqual(4);
    });

    it('should update the score', () => {
        let score = ts.conf('myScore');
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.store.dispatch({type: types.SET_CONFIG, key: 'usedTeleporter', value:"false"});
        ts.input('use teleporter');
        expect(ts.conf('myScore')).toBeGreaterThan(score);
    });

    it('should update config', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.store.dispatch({type: types.SET_CONFIG, key: 'usedTeleporter', value:"false"});
        ts.input('use teleporter');
        expect(ts.conf('usedTeleporter')).toEqual("true");
    });

    it('should not update score once a flag has been set', () => {
        let score = ts.conf('myScore');
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.store.dispatch({type: types.SET_CONFIG, key: 'usedTeleporter', value:"true"});
        ts.input('use teleporter');
        expect(ts.conf('myScore')).toEqual(score);
        expect(ts.res()).toEqual("Ah yes, teleportation.  You're really an old hand at this now.");
    });

    it('should update item properties', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 4});
        ts.input('get match');
        ts.input('examine match');
        expect(ts.res()).toEqual("A strike anywhere match.");
        ts.input('strike match');
        expect(ts.res()).toEqual("The match burns brightly, revealing a secret exit!");
        ts.input('examine match');
        expect(ts.res()).toEqual("A used match.");
    });

    it('should kill the player if they are silly enough to eat the herring', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.input('get herring');
        ts.input('eat herring');
        expect(ts.res()).toEqual("That probably wasn't a very good idea.");
        expect(ts.conf('myLoc')).toEqual(999);
    });


});
