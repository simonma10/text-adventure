import { combineReducers } from 'redux';

import InputOutputReducer from './input-output-reducer'

const rootReducer = combineReducers({
    inputOutput: InputOutputReducer
});

export default rootReducer;

