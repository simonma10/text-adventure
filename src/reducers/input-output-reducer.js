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
   /* let visibleItems;
    visibleItems = _.filter(state.items, function(item){
        return item.location === state.config['myLoc'];
    });
    let inventoryItems = _.filter(state.items, function(item){
        return item.location === state.config['locInv'];
    });
*/

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

            console.log('reducer::INPUT_PARSE = ', newParsedVerbs, newParsedNouns);

            return Object.assign({}, state, {
                parsedText: newParsedText,
                parsedVerbs: newParsedVerbs,
                parsedNouns: newParsedNouns
            });

        case types.PROCESS_COMMAND:

            // Process all test conditions first
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

            // If no special conditions met, apply standardised logic, according to verb
            for (let i = 0; i < state.parsedVerbs.length; i++){
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
                            let inventoryItems = _.filter(state.items, function(item){
                                return item.location === state.config['locInv'];
                            });
                            let getItem = _.find(inventoryItems, function(item){
                                return item.name === state.parsedNouns[i];
                            });
                            if (getItem){
                                return {...state, outputText:state.outputText.concat(state.messages['mGotAlready'])};
                            } else {
                                return {...state, outputText:state.outputText.concat(state.messages['mNoCanDo'])};
                            }
                        }
                        break;
                    case vb.DROP:
                        let inventoryItems = _.filter(state.items, function(item){
                            return item.location === state.config['locInv'];
                        });
                        let dropItem = _.find(inventoryItems, function(item){
                            return item.name === state.parsedNouns[i];
                        });

                        if (dropItem){
                            let newItems = _.clone(state.items);
                            for (let i = 0; i < newItems.length; i++){
                                if(newItems[i].id === dropItem.id){
                                    newItems[i].location = state.config['myLoc'];
                                }
                            }
                            let itemMsg = state.messages['mDrop'] + dropItem.name + '.';
                            return Object.assign({}, state, {
                                items: newItems,
                                outputText: state.outputText.concat(itemMsg),
                            });
                        } else {
                            return {...state, outputText:state.outputText.concat(state.messages['mNoCanDo'])};
                        }
                        break;
                    case vb.EXAMINE:
                        let examinableItems = _.filter(state.items, function(item){
                            return (
                                item.location === state.config['locInv'] ||
                                item.location === state.config['myLoc']);
                        });
                        let examineItem = _.find(examinableItems, function(item){
                            return item.name === state.parsedNouns[i];
                        });
                        if(examineItem){
                            return {...state, outputText:state.outputText.concat(examineItem.description)};
                        } else {
                            return {...state, outputText:state.outputText.concat(state.messages['mExamineNotHere'])};
                        }

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
