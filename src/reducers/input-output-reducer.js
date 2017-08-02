import _ from 'lodash';

import { INPUT_SUBMIT, INPUT_PARSE } from '../actions'

export default function inputOutputReducer(
    state = {
        promptText: '> ',
        outputText: ['Output Text from da reducer!','Some more text, just for testing porpoises...'],
        headerText: 'Here is the header (courtesy of da reducer)',
        inputText:'',
        parsedText: [],
        parsedVerbs:[],
        parsedNouns:[],
        config:[
            {k: "myScore", v:0},
            {k: "myLoc", v:0}

        ],
        verbs:[
            {k: "n", v: "go"},
            {k: "s", v:"go"},
            {k: "w", v:"go"},
            {k: "e", v:"go"},
            {k: "nw", v:"go"},
            {k: "ne", v:"go"},
            {k: "sw", v:"go"},
            {k: "se", v:"go"},
            {k: "north", v:"go"},
            {k: "south", v:"go"},
            {k: "west", v:"go"},
            {k: "east", v:"go"},
            {k: "northwest", v:"go"},
            {k: "northeast", v:"go"},
            {k: "southwest", v:"go"},
            {k: "southeast", v:"go"},
            {k: "up", v:"go"},
            {k: "u", v:"go"},
            {k: "down", v:"go"},
            {k: "d", v:"go"},
            {k: "in", v:"go"},
            {k: "out", v:"go"},
            {k: "go", v:"go"}

        ],
        nouns:[
            {k: "n", v: "north"},
            {k: "s", v:"south"},
            {k: "w", v:"west"},
            {k: "e", v:"east"},
            {k: "nw", v:"northwest"},
            {k: "ne", v:"northeast"},
            {k: "sw", v:"southwest"},
            {k: "se", v:"southeast"},
            {k: "north", v:"north"},
            {k: "south", v:"south"},
            {k: "west", v:"west"},
            {k: "east", v:"east"},
            {k: "northwest", v:"northwest"},
            {k: "northeast", v:"northeast"},
            {k: "southwest", v:"southwest"},
            {k: "southeast", v:"southeast"},
            {k: "up", v:"up"},
            {k: "u", v:"up"},
            {k: "down", v:"down"},
            {k: "d", v:"down"},
            {k: "in", v:"in"},
            {k: "out", v:"out"}
        ],
        locations:[
            {id: 666,
            visited: false,
            name: "limbo",
            description: "a place for things that no longer exist, or don't exist yet.",
            exits:[]
            },
            {id: 0,
                visited: false,
                name: "inventory",
                description: "a place for items that the player is carrying.",
                exits:[]
            }
        ]



    },
    action
){
    switch (action.type){
        case INPUT_SUBMIT:
            let newOutput = _.clone(state.outputText);
            newOutput.push(state.promptText + action.payload);
            return Object.assign({}, state, {
                inputText: action.payload,
                outputText: newOutput
            });

        case INPUT_PARSE:
            let newParsedText = [];
            newParsedText = state.inputText.toLowerCase().split(' ');

            let newParsedVerbs = [];
            let newParsedNouns = [];

            for (let i = 0 ; i < newParsedText.length; i++){
                for (let j = 0; j < state.verbs.length; j++) {
                    if(newParsedText[i] === state.verbs[j].k){
                        //console.log('found verb', newParsedText[i], 'mapped to', state.verbs[j].v);
                        newParsedVerbs.push(state.verbs[j].v);
                    }
                }
                for (let k = 0; k < state.nouns.length; k++) {
                    if(newParsedText[i] === state.nouns[k].k){
                        //console.log('found noun', newParsedText[i], 'mapped to', state.nouns[k].v);
                        newParsedNouns.push(state.nouns[k].v);
                    }
                }
            }

            console.log(newParsedVerbs, newParsedNouns);

            return Object.assign({}, state, {
                parsedText: newParsedText,
                parsedVerbs: newParsedVerbs,
                parsedNouns: newParsedNouns
            });
        default:
            return state;

    }

}

/*

 "score":"score",
 "take":"get",
 "get":"get",
 "drop":"drop",
 "l":"look",
 "look":"look",
 "i":"inv",
 "inv":"inv",
 "inventory":"inv",
 "carrying":"inv",

 "quit":"quit",
 "exit":"quit",
 "bye":"quit",
 "help":"help",
 "hint":"help",
 "save":"save",
 "load":"load"


 */