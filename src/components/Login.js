import React, { Component } from 'react'
import axios from 'axios'
import '../newEntry.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        let user = new FormData();
        user.set('email', this.state.email)
        user.set('password', this.state.password)
        axios({
            method: 'post',
            url: 'https://quiet-tor-97113.herokuapp.com/login',
            withCredentials: true,
            data: user,
            config: { headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then((response) => {
            console.log(response);
            if(response.statusText === "OK"){
                this.props.history.push('/')
            }
		})
		.catch((error) => {
			console.log(error);
		});
        event.preventDefault();
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Email:
                <input type="text" value={this.state.email} onChange={this.handleEmailChange} name="email"/>
                </label>
                <label>
                    Password:
                <input type="password" value={this.state.password} onChange={this.handlePasswordChange} name="password"/>
                </label>
                <input className="btn yellow lighten-2 grey-text text-darken-3" type="submit" value="Submit" />
            </form>
        )
    }
}

export default Login