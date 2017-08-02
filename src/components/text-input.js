import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { inputSubmit } from '../actions';

class TextInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        this.setState({value: e.target.value});
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.handleInputSubmit(this.state.value);
        this.setState({value: ''});
    }

    render(){
        return(
            <div className="console__text-block">
                <form onSubmit={this.handleSubmit}>
                    <span className="console__text">{this.props.prompt}</span>
                    <input
                        autoFocus
                        className="console__text-input"
                        type="text"
                        size="60"
                        maxLength="40"
                        onChange={this.handleChange}
                        value={this.state.value}

                    />
                </form>
            </div>
        );
    }
}

export default TextInput;

