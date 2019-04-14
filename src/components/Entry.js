import React, { Component } from 'react'
import axios from 'axios'
import ReactHtmlParser from 'react-html-parser'

class Entry extends Component {
    state = {
        entry: null
    }
    componentDidMount(){
        let id = this.props.match.params.entry_id
        axios.get('https://quiet-tor-97113.herokuapp.com/entries/' + id, {withCredentials: true})
            .then(res => {
                this.setState({
                    entry: res.data
                })
            })
    }
    render() {
        const entry = this.state.entry != null ? ( /* Fix this later to check if entry is null or 0 */
            <div className="post center">
                <h4>{this.state.entry.title}</h4>
                <img className="responsive-img" src={this.state.entry.images[0]} alt=""/>
                <p>{this.state.entry.date}</p>
                <div>{ReactHtmlParser(this.state.entry.content)}</div>
            </div>
        ) : (
            <div className="center">Loading entry...</div>
        )

        return (
            <div className="container">
                { entry }
            </div>
        )
    }
}

export default Entry