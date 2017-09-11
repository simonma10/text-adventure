

class Parser {
    constructor (verbList, nounList) {
        //console.log(verbList, nounList);
        this.parsedVerbs = [];
        this.parsedNouns = [];
        this.verbs = verbList;
        this.nouns = nounList;
        //console.log(this.verbs, this.nouns);
    }

    parseInputText (textInput) {
        console.log('Parser::parseInputText', textInput);

        let parsedText = textInput.toLowerCase().split(' ');

        for (let i = 0 ; i < parsedText.length; i++){
            for (let verbKey in this.verbs){
                if(verbKey === parsedText[i]){
                    this.parsedVerbs.push(this.verbs[verbKey]);
                }
            }

            for (let nounKey in this.nouns){
                if(nounKey === parsedText[i]){
                    this.parsedNouns.push(this.nouns[nounKey]);
                }
            }
        }

        console.log('Parser::parseInputText = ', this.parsedVerbs, this.parsedNouns);

    }



}



export default Parser;