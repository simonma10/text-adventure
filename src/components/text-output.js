import React, { Component } from 'react';


class TextOutput extends Component{
    constructor(props){
        super(props);
    }

    componentDidUpdate(){
        this.scrollToEnd();
    }



    renderOutput(textOutputItem, index){
        return(
            <p key={index}>
                {textOutputItem}
            </p>
        );
    }

    render(){
        const textOutput = this.props.outputText;
        return(
            <div
                className="console__text-output-container console__text"
                ref={(div) => {
                    this.textOutputContainer = div;
                }}
            >
                {textOutput.map(this.renderOutput)}
            </div>

        );
    }

    scrollToEnd(){
        const scrollHeight = this.textOutputContainer.scrollHeight;
        const height = this.textOutputContainer.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.textOutputContainer.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
}

export default TextOutput;

/*
 <textarea
 className="console__textarea console__text"
 value={this.props.outputText}
 onChange={this.handleChange}
 >
 </textarea>

 */
