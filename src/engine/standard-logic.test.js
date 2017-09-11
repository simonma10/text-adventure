
import _ from 'lodash';
import reducer from '../reducers/input-output-reducer';
import * as types from '../actions/actionTypes';
import { switchVerbs } from './standard-logic';

import TestStore from '../engine/test-store-wrapper';

let ts = new TestStore();

describe ('standard-logic: verb.GO', () => {
    ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});

    it('from loc 1 should not allow exits n or s', () => {
        ts.input('go north');
        expect(ts.res()).toEqual(ts.msg('mNoExit'));
        ts.input('s');
        expect(ts.res()).toEqual(ts.msg('mNoExit'));
    });
    it('from loc 1 should allow exit w to loc 3', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.input('w');
        expect(ts.res()).toEqual(ts.msg('mGo') + 'west.');
        expect(ts.conf('myLoc')).toEqual(3);
    });
    it('from loc 1 should allow exit e to loc 2', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 1});
        ts.input('e');
        expect(ts.res()).toEqual(ts.msg('mGo') + 'east.');
        expect(ts.conf('myLoc')).toEqual(2);
    });
    it('from loc 2 should allow exit w to loc 1', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 2});
        ts.input('w');
        expect(ts.res()).toEqual(ts.msg('mGo') + 'west.');
        expect(ts.conf('myLoc')).toEqual(1);
    });
    it('from loc 2 should allow exit n to loc 3', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 2});
        ts.input('n');
        expect(ts.res()).toEqual(ts.msg('mGo') + 'north.');
        expect(ts.conf('myLoc')).toEqual(3);
    });
    it('from loc 3 should allow exit e to loc 1', () => {
        ts.store.dispatch({type: types.SET_CONFIG, key: 'myLoc', value: 3});
        ts.input('e');
        expect(ts.res()).toEqual(ts.msg('mGo') + 'east.');
        expect(ts.conf('myLoc')).toEqual(1);
    });

});


describe ('standard-logic: verb.GET, verb.DROP, verb.INV', () => {
    ts.initStore();

    it('from loc 1 should not get treasure', () => {
        ts.input('get treasure');
        expect(ts.res()).toEqual(ts.msg('mNoCanDo'));
        ts.input('get torch');
        expect(ts.res()).toEqual(ts.msg('mNoCanDo'));
    });

    it('from loc 1 should get herring', () => {
        ts.input('get herring');
        expect(ts.res()).toEqual(ts.msg('mGet') + 'herring.');
    });

    it('should show item in inventory', () => {
        ts.input('i');
        expect(ts.res()).toEqual(ts.msg('mInv') + 'a red herring.');
    });

    it('from loc 1 should drop herring', () => {
        ts.input('drop herring');
        expect(ts.res()).toEqual(ts.msg('mDrop') + 'herring.');
    });

    it('should show nothing in inventory', () => {
        ts.input('i');
        expect(ts.res()).toEqual(ts.msg('mInv') + ts.msg('mInvEmpty'));
    });


});

