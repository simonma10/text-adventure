import _ from 'lodash';


export function testConditions(state){
    //console.log('testConditions', state.conditions.length);
    // Process all test conditions first
    for (let i = 0; i < state.conditions.length; i++){
        let result = '';
        let c = state.conditions[i];
        //console.log(i, state.conditions[i]);
        for (let t in c.tests){

            switch (t){
                case "verb":
                    result += matchInput(state.parsedVerbs, c.tests[t]);
                    break;
                case "noun":
                    result += matchInput(state.parsedNouns, c.tests[t]);
                    break;
                case "atLoc":
                    result += matchExact(c.tests[t], state.config['myLoc']);
                    break;
                case "findItems":
                    result += matchItems(state.items,c.tests[t]);
                    break;
                case "getConfig":
                    result += matchExact(state.config[c.tests[t]['key']], c.tests[t]['value']);
                    break;

                default:
                    result += 'x';
                    break;
            }

        }

        //console.log(i, result);

        // If all tests passed for a particular condition, process the corresponding actions
        if (result.indexOf('x') === -1){
            let msg;
            let newItems = _.clone(state.items);
            let newConfig = _.clone(state.config);

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
                    case "setLocation":
                        newConfig['myLoc'] = c.actions[action];
                        newConfig['showLoc'] = "true";
                        break;
                    case "updateConfig":
                        newConfig[c.actions[action]['key']] = c.actions[action]['value'];
                        break;
                    case "updateScore":
                        newConfig['myScore'] += c.actions[action];
                        break;

                    // TODO: playerDead
                    // TODO: updateLocation (add exits, etc)
                    // TODO: updateItem (change description, etc)
                    // TODO: Two-phase interaction

                    default:
                        msg = "Problem with conditional logic (missing break statement?)";
                        break;
                }
            }
            return Object.assign({}, state, {
                outputText: (msg ? state.outputText.concat(msg) : state.outputText),
                items: newItems,
                config: newConfig

            });
        }

    }
    return false;

}


function matchInput(list, testItem){
    if (_.find(list, function (listItem) {
            return listItem === testItem;
        })) {
        return '0';
    } else {
        return 'x';
    }
}

function matchExact(item, testItem){
    if (item === testItem){
        return '0';
    } else {
        return 'x';
    }
}

function matchItems(allItems, testItems){
    for (let itemName in testItems){
        if(_.find(allItems, function(item){
                return (item.name === itemName && item.location === testItems[itemName]);
            })) {
            return '0';
        } else {
             return 'x';
        }
    }
}



/*for (let itemName in c.tests[t]){
 // console.log(itemName, c.tests[t][itemName]);
 if(_.find(state.items, function(item){
 return (item.name === itemName && item.location === c.tests[t][itemName]);
 })) {
 result += '0';
 } else {
 result += 'x';
 }
 }*/