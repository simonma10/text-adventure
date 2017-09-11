import * as vb from './verbTypes';
import _ from 'lodash';

export function switchVerbs(state){


    let storage = window.localStorage;
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
                    let newConfig = _.clone(state.config);
                    for (let i = 0; i < newItems.length; i++){
                        if(newItems[i].id === getItem.id){
                            newItems[i].location = state.config['locInv'];
                            newConfig['myScore'] += newItems[i].score;
                        }
                    }
                    let itemMsg = state.messages['mGet'] + getItem.name + '.';
                    return Object.assign({}, state, {
                        items: newItems,
                        outputText: state.outputText.concat(itemMsg),
                        config: newConfig

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
                try {
                    let tempState = JSON.parse(storage.getItem('adv.js'));
                    if (tempState === null){
                        return{...state, outputText:state.outputText.concat(state.messages['mNotLoaded'])};
                    } else {
                        state = tempState;
                        return{...state, outputText:state.outputText.concat(state.messages['mLoaded'])};
                    }

                } catch (e){
                    console.log(e);
                }
                return{...state, outputText:state.outputText.concat(state.messages['mNotLoaded'])};
                break;
            case vb.SAVE:
                try {
                    storage.setItem('adv.js', JSON.stringify(state));
                    return{...state, outputText:state.outputText.concat(state.messages['mSaved'])};
                } catch (e){
                    console.log(e);
                }
                return{...state, outputText:state.outputText.concat(state.messages['mNotSaved'])};
                break;
            case vb.QUIT:
                window.location.reload(true);
                return{...state, outputText:state.outputText.concat(state.messages['mQuit'])};
                break;
            case vb.SCORE:
                return {...state,
                    outputText:state.outputText.concat(state.messages['mScore'] + state.config['myScore'])};
                break;
            default:
                break;
        }
    }
    return{...state, outputText:state.outputText.concat(state.messages['mConfused'])};

}