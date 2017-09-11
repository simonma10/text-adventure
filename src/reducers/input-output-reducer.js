import _ from 'lodash';

import * as types from '../actions/actionTypes';

import { testConditions } from '../engine/conditions-logic';
import { switchVerbs } from '../engine/standard-logic';

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

export default function inputOutputReducer( state = initialState, action ){

    let currentLocation;
    let currentExits;
    for (let i = 0; i < state.locations.length; i++){
        if (state.locations[i].id === state.config['myLoc']){
            currentLocation = state.locations[i];
        }
    }
    if (currentLocation){
        currentExits = currentLocation.exits;
    }

    /**
     * Reducer main switch
     */
    switch (action.type){
        case types.INPUT_SUBMIT:
            let newOutput = _.clone(state.outputText);
            let prompt = state.config['prompt'];
            newOutput.push(prompt + action.payload);
            return Object.assign({}, state, {
                inputText: action.payload,
                outputText: newOutput
            });

        case types.INPUT_PARSE:
            let newParsedText = [];
            newParsedText = state.inputText.toLowerCase().split(' ');

            let newParsedVerbs = [];
            let newParsedNouns = [];

            for (let i = 0 ; i < newParsedText.length; i++){
                for (let verbKey in state.verbs){
                    if(verbKey === newParsedText[i]){
                        newParsedVerbs.push(state.verbs[verbKey]);
                    }
                }

                for (let nounKey in state.nouns){
                    if(nounKey === newParsedText[i]){
                        newParsedNouns.push(state.nouns[nounKey]);
                    }
                }
            }

            //console.log('reducer::INPUT_PARSE = ', newParsedVerbs, newParsedNouns);

            return Object.assign({}, state, {
                parsedText: newParsedText,
                parsedVerbs: newParsedVerbs,
                parsedNouns: newParsedNouns
            });

        case types.PROCESS_COMMAND:

            // If no special conditions met, apply standardised logic, according to verb
            let tc = testConditions(_.clone(state));
            return Object.assign({}, state, (
                tc ? tc : switchVerbs(_.clone(state))
            ));


        case types.RECEIVE_DATA:
            let data = action.payload;
            return Object.assign({}, state, {
                config: data.config,
                messages: data.messages,
                verbs: data.verbs,
                nouns: data.nouns,
                locations: data.locations,
                items: data.items,
                conditions: data.conditions,
                status: "loaded"
            });

        case types.GET_WELCOME_MESSAGE:
            return Object.assign({}, state, {
                config: Object.assign({}, state.config, {
                    ['header']: state.config['engineName'] + ' v ' + state.config['engineVersion']
                }),
                outputText: state.outputText.concat(state.config['msgWelcome']),
                status: "ready"
            });

        case types.GET_LOCATION:
            let locDescription = [];

            if(currentLocation.visited === "true"){
                locDescription.push(currentLocation.name)
            } else {
                locDescription.push(currentLocation.description);
            }

            let exitDescription = '';
            let exitCounter = 0;
            for (let key in currentExits){
                exitDescription += key;
                exitCounter += 1;
                if (exitCounter < _.size(currentExits)){
                    exitDescription += ', ';
                } else {
                    exitDescription += '.';
                }
            }
            locDescription.push(state.messages['mExits'] + exitDescription);

            let newLocations = _.clone(state.locations);
            for (let i = 0; i < newLocations.length; i++){
                if(newLocations[i].id === currentLocation.id){
                    newLocations[i].visited = "true";
                }
            }

            let itemDescription = state.messages['mVisibleItems'];
            let itemCounter = 0;
            let visibleItems = _.filter(state.items, function(item){
                return item.location === state.config['myLoc'];
            });
            if(visibleItems.length > 0){
                for (let i = 0; i < visibleItems.length; i++){
                    itemDescription += visibleItems[i].shortdescription;
                    itemCounter += 1;
                    if (itemCounter < visibleItems.length){
                        itemDescription += ', ';
                    } else {
                        itemDescription += '.';
                    }
                }
            } else {
                itemDescription += state.messages['mVisibleItemsEmpty'];
            }
            locDescription.push(itemDescription);

            return Object.assign({}, state, {
                outputText: state.outputText.concat(locDescription),
                status: "ready",
                config: Object.assign({}, state.config, {
                    ['showLoc']: "false"
                }),
                locations: newLocations
            }) ;

        case types.GET_MESSAGE:
            return state.messages[action.payload];

        case types.SET_CONFIG:
            let configKey = action.key;
            let configValue = action.value;
            return Object.assign({}, state, {
               config: Object.assign({}, state.config, {
                   [configKey]: configValue
               })
            });
        default:
            return state;

    }
}



/*  // Process all test conditions first
 for (let i = 0; i < state.conditions.length; i++){
 let result = '';
 let c = state.conditions[i];
 for (let t in c.tests){

 switch (t){
 case "verb":
 if (_.find(state.parsedVerbs, function (verb) {
 return verb === c.tests[t];
 })) {
 result += '0';
 } else {
 result += 'x';
 }
 break;

 case "noun":
 if (_.find(state.parsedNouns, function(noun){
 return noun === c.tests[t];
 })) {
 result += '0';
 } else {
 result += 'x';
 }
 break;

 case "atLoc":
 if (c.tests[t] === state.config['myLoc']){
 result += '0';
 } else {
 result += 'x';
 }
 break;

 case "findItems":
 for (let itemName in c.tests[t]){
 // console.log(itemName, c.tests[t][itemName]);
 if(_.find(state.items, function(item){
 return (item.name === itemName && item.location === c.tests[t][itemName]);
 })) {
 result += '0';
 } else {
 result += 'x';
 }
 }
 break;

 default:
 result += 'x';
 break;
 }

 }

 // console.log(i, result);
 // If all tests passed for a particular condition, process the corresponding actions
 if (result.indexOf('x') === -1){
 let msg;
 let newItems = _.clone(state.items);

 for (let action in c.actions){
 switch (action){
 case "msg":
 msg = c.actions[action];
 break;
 case "moveItems":
 for (let itemName in c.actions[action]){
 for (let i = 0; i < newItems.length; i++){
 if(newItems[i].name === itemName){
 newItems[i].location = c.actions[action][itemName];
 }
 }
 }
 break;
 // TODO: setLocation
 // TODO: playerDead
 // TODO: updateLocation
 // TODO: Update score

 default:
 msg = "Problem with conditional logic (missing break statement?)";
 break;
 }
 }

 return Object.assign({}, state, {
 outputText: (msg ? state.outputText.concat(msg) : state.outputText),
 items: newItems

 });
 }

 }
 */