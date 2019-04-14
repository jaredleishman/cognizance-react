import React, { Component } from "react"
import axios from 'axios'
import { Link } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import '../home.css'

class Home extends Component {
    state = {
        entries: []
    }
    componentDidMount(){
        console.log('getting entries...')
        axios.get('https://quiet-tor-97113.herokuapp.com/entries', {withCredentials: true})
            .then(res => {
                this.setState({
                    entries: res.data.slice(0,10)
                })
            })
            .catch(error => {
                this.props.history.push('/login')
            })
    }

    render() {
        const { entries } = this.state
        const entriesList = entries.length ? (
            entries.map(entry => {
                let d = new Date(entry.date)
                let dateString = `${d.toLocaleString('en-us', {month: 'long'})} ${d.getDate()}, ${d.getFullYear()}`
                return (
                    <div className="row" key={entry.id}>
                    <div className="col s6">
                      <div className="card">
                        <div className="card-image">
                            <img src={entry.images !== null ? entry.images[0] : ""} alt=""/>
                            <Link to={'/edit/entries/' + entry.id} className="btn-floating halfway-fab waves-effect waves-light yellow lighten-2"><i className="material-icons grey-text text-darken-3">edit</i></Link>
                        </div>
                        <div className="card-content grey-text text-darken-3">
                          <span className="card-title activator">{entry.title}</span>
                          <p>{dateString}</p>
                        </div>
                        <div className="card-reveal grey-text text-darken-3">
                          <span className="card-title activator">{ entry.title }</span>
                            <div className="content">{ReactHtmlParser(entry.content)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            }) 
        ) : (
            <div className="center">No entries yet</div>
        )
        return (
            <div className="container">
                {entriesList}
            </div>
        );
    }
}

export default Home;
