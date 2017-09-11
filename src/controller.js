
import 'isomorphic-fetch';

class Controller {
    constructor(){
        this.msg="";
    }

    processCommand(parsedVerbs, parsedNouns){
        console.log('controller::processCommand', parsedVerbs, parsedNouns);
    }

    static loadDataFile(url){
        return fetch(url).then(response => {
            return response.json();
        }).catch(error => {
            throw new Error(error);
        });
    }

    saveData(){}



}

export default Controller;