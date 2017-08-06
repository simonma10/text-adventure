import { bindActionCreators } from 'redux';


class Controller {
    constructor(){
        this.msg="";
    }

    processCommand(parsedVerbs, parsedNouns){
        console.log('controller::processCommand', parsedVerbs, parsedNouns);
    }

    static loadData(url){
        return fetch(url).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }

    saveData(){}



}

export default Controller;