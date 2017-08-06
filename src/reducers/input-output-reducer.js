import _ from 'lodash';

import * as types from '../actions/actionTypes';
import * as vb from './verbTypes';

export default function inputOutputReducer(
    state = {
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
    },
    action
){

    /**
     * Setup various helper objects
     */
    let currentLocation;
    let currentExits;
    for (let i = 0; i < state.locations.length; i++){
        if (state.locations[i].id === state.config['myLoc']){
            currentLocation = state.locations[i];
        }
    }
    if (currentLocation){
        currentExits = currentLocation.exits;
        // console.log(currentLocation, currentExits);
    }
    let visibleItems;
    visibleItems = _.filter(state.items, function(item){
        return item.location === state.config['myLoc'];
    });
    let inventoryItems = _.filter(state.items, function(item){
        return item.location === state.config['locInv'];
    });


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
                /*for (let j = 0; j < state.verbs.length; j++) {
                    if(newParsedText[i] === state.verbs[j].key){
                        //console.log('found verb', newParsedText[i], 'mapped to', state.verbs[j].v);
                        newParsedVerbs.push(state.verbs[j].value);
                    }
                }*/

                for (let nounKey in state.nouns){
                    if(nounKey === newParsedText[i]){
                        newParsedNouns.push(state.nouns[nounKey]);
                    }
                }

                /*for (let k = 0; k < state.nouns.length; k++) {
                    if(newParsedText[i] === state.nouns[k].k){
                        //console.log('found noun', newParsedText[i], 'mapped to', state.nouns[k].v);
                        newParsedNouns.push(state.nouns[k].v);
                    }
                }*/
            }

            console.log('reducer::INPUT_PARSE = ', newParsedVerbs, newParsedNouns);

            return Object.assign({}, state, {
                parsedText: newParsedText,
                parsedVerbs: newParsedVerbs,
                parsedNouns: newParsedNouns
            });

        case types.PROCESS_COMMAND:

            for (let i = 0; i < state.parsedVerbs.length; i++){
                // TODO: process conditions here, before handling general options
                switch (state.parsedVerbs[i]){
                    case vb.GO:
                        for (let key in currentExits){
                            if(key === state.parsedNouns[i]){
                                return Object.assign({}, state, {
                                    outputText: state.outputText.concat(
                                        state.messages['mGo'] + key + '.'
                                    ),
                                    config: Object.assign({}, state.config, {
                                        ['myLoc']: currentExits[key],
                                        ['showLoc']: "true"
                                    })
                                });
                            }
                        }
                        return {...state, outputText:state.outputText.concat(state.messages['mNoExit'])};
                        break;
                    case vb.GET:
                        let visibleItems = _.filter(state.items, function(item){
                            return item.location === state.config['myLoc'];
                        });
                        let getItem = _.find(visibleItems, function(item){
                            return item.name === state.parsedNouns[i];
                        });
                        // console.log(getItem);
                        if (getItem){
                            let newItems = _.clone(state.items);
                            for (let i = 0; i < newItems.length; i++){
                                if(newItems[i].id === getItem.id){
                                    newItems[i].location = state.config['locInv'];
                                }
                            }
                            let itemMsg = state.messages['mGet'] + getItem.name + '.';
                            return Object.assign({}, state, {
                                items: newItems,
                                outputText: state.outputText.concat(itemMsg),
                            });
                        } else {
                            // TODO: if item already in inventory, msg="you already have it"
                            return {...state, outputText:state.outputText.concat(state.messages['mNoCanDo'])};
                        }

                        break;
                    case vb.DROP:
                        //TODO: Drop
                        break;
                    case vb.EXAMINE:
                        // TODO: Examine
                        break;
                    case vb.HELP:
                        return {...state, outputText:state.outputText.concat(state.messages['mHelp'])};
                        break;
                    case vb.INV:
                        let invDescription = state.messages['mInv'];
                        let itemCounter = 0;
                        let invItems = _.filter(state.items, function(item){
                            return item.location === state.config['locInv'];
                        });
                        if(invItems.length > 0){
                            for (let i = 0; i < invItems.length; i++){
                                invDescription += invItems[i].shortdescription;
                                itemCounter += 1;
                                if (itemCounter < invItems.length){
                                    invDescription += ', ';
                                } else {
                                    invDescription += '.';
                                }
                            }
                        } else {
                            invDescription += state.messages['mInvEmpty'];
                        }
                        return {...state, outputText:state.outputText.concat(invDescription)};
                        break;
                    case vb.LOOK:
                        let newLocations = _.clone(state.locations);
                        for (let i = 0; i < newLocations.length; i++){
                            if(newLocations[i].id === currentLocation.id){
                                newLocations[i].visited = "false";
                            }
                        }

                        return Object.assign({}, state, {
                            locations: newLocations,
                            outputText: state.outputText.concat(state.messages['mLook']),
                            config: Object.assign({}, state.config, {
                                ['showLoc']: "true"
                            })
                        });
                        break;
                    case vb.LOAD:
                        // TODO: Load.  Move to console component?  load from localStorage
                        break;
                    case vb.SAVE:
                        // TODO: Save.  Move to console component?  save to localStorage
                        break;
                    case vb.QUIT:
                        // TODO: Quit.
                        break;
                    case vb.SCORE:
                        // TODO: Increment score with item Value when getting items...
                        return {...state,
                            outputText:state.outputText.concat(state.messages['mScore'] + state.config['myScore'])};
                        break;
                    default:
                        break;
                }
            }
            return{...state, outputText:state.outputText.concat(state.messages['mConfused'])};

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
            console.log(state.config[configKey]);
            return Object.assign({}, state, {
               config: Object.assign({}, state.config, {
                   [configKey]: configValue
               })
            });
        default:
            return state;

    }
}
