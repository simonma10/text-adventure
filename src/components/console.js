import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { inputSubmit, inputParse, processCommand } from '../actions';

import TextInput from './text-input';
import Header from './header';
import TextOutput from './text-output';
import Controller from '../controller';

/**
 * Console = App container object.  Only this component needs to be wired to redux state.
 */

class Console extends Component{
    //TODO: add horizontal line monitor fx
    constructor(props){
        super(props);
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        //this.controller = new Controller();
        this.state = {
        };
    }

    handleInputSubmit(textInput){
        this.props.handleInputSubmit(textInput);
        this.props.handleInputParse(textInput);
        this.props.processCommand();
    }


    render(){
        return(
            <div className="console__container">

                <Header headerText={this.props.headerText}/>

                <hr className="console__line"/>

                <TextOutput outputText={this.props.outputText} />

                <hr className="console__line"/>

                <TextInput
                    prompt={this.props.promptText}
                    handleInputSubmit={this.handleInputSubmit}
                />
          </div>
        );
    }
}

function mapStateToProps(state){
    // whenever application state changes:
    //  - component will auto re-render
    //  - the object in the state function will be assigned as props to the component
    return {
        headerText: state.inputOutput.config['header'],
        outputText: state.inputOutput.outputText,
        promptText: state.inputOutput.config['prompt'],
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        handleInputSubmit:inputSubmit,
        handleInputParse:inputParse,
        processCommand:processCommand
    }, dispatch)

}

export default connect(mapStateToProps, mapDispatchToProps)(Console);