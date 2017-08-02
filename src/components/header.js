import React, { Component } from 'react';


class Header extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="console__text-block">
                <span className="console__text">{this.props.headerText}</span>
            </div>
        );
    }
}

export default Header;


