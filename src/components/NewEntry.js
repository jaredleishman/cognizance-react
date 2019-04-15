import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import M from 'materialize-css'
import '../newEntry.css'

class NewEntry extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			title: '', 
			content: '', 
			date: new Date().toJSON(), 
			googleImageIds: [], 
			mediaItems: [], 
			nextPageToken: '',
			loggedIn: false,
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.onDateSelect = this.onDateSelect.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleEditorSubmit = this.handleEditorSubmit.bind(this);
		this.onScrollEnd = this.onScrollEnd.bind(this);
	}

	componentWillMount() {
		axios.get("https://quiet-tor-97113.herokuapp.com/cookie", {withCredentials: true})
		.then((response) => {
			console.log(response)
		})
		.catch(error => {
			this.props.history.push('/login')
		})
	}

	componentDidMount() {
		var elem = document.querySelector('.datepicker');
		M.Datepicker.init(elem, { showClearBtn: true, onSelect: this.onDateSelect, defaultDate: new Date(), maxDate: new Date() })

		elem = document.querySelector('.collapsible');
		M.Collapsible.init(elem)
		
		axios.get("https://quiet-tor-97113.herokuapp.com/auth/google/verify")
			.then((response) => {
				this.setState({ loggedIn: response.data.loggedIn })
				if(response.data.loggedIn) {
					axios.get("https://quiet-tor-97113.herokuapp.com/auth/google/mediaitems", {withCredentials: true})
					.then((r) => {
						this.setState({ mediaItems: r.data.mediaItems, nextPageToken: r.data.nextPageToken })
					})
				}
		})

	}

	handleTitleChange(event) {
		this.setState({ title: event.target.value })
	}

	onDateSelect(date) {
		this.setState({ date: new Date(date).toJSON() })
	}

	handleEditorChange(content) {
		this.setState({ content })
	}

	handleEditorSubmit(event) {
		console.log(this.state)
		let entry = {
			title: this.state.title,
			content: this.state.content,
			date: this.state.date,
			images: this.state.googleImageIds
		}
		axios({
            method: 'post',
            url: 'https://quiet-tor-97113.herokuapp.com/entries',
            withCredentials: true,
            data: entry,
            config: { headers: {'Content-Type': 'text/plain'}}
        })
        .then((response) => {
            console.log(response);
            if(response.status === 201){
                this.props.history.push('/')
            }
		})
		.catch((error) => {
			console.log(error);
		});
		event.preventDefault();
	}

	onScrollEnd(event){
		let elem = event.target
		let newScrollLeft = elem.scrollLeft,
			width		  = elem.offsetWidth,
			scrollWidth   = elem.scrollWidth
		if(Math.floor(scrollWidth - newScrollLeft) === width) {
			let nextPageToken = this.state.nextPageToken
			axios.post("https://quiet-tor-97113.herokuapp.com/auth/google/mediaitems", 
				{ nextPageToken: nextPageToken },
				{ headers: {'Content-Type': 'text/plain'} })
				.then((response) => {
					this.setState({ mediaItems: [...this.state.mediaItems, ...response.data.mediaItems], nextPageToken: response.data.nextPageToken })					
				})
		}
	}

	onImageSelect(id, event) {
		let selectedImageIds = [...this.state.googleImageIds]
		if(event.target.classList.contains("selected-image")) {
			event.target.classList.remove("selected-image")
			let index = selectedImageIds.indexOf(id)
			if (index !== -1) {
				selectedImageIds.splice(index, 1)
				this.setState({ googleImageIds: selectedImageIds })
			}
		} else {
			event.target.setAttribute("class", "selected-image gImage")
			selectedImageIds.push(id)
			this.setState({googleImageIds: selectedImageIds})
		}
	}
	

    render() {
		const mediaItems = this.state.mediaItems
		const loggedIn = this.state.loggedIn
		let scrollBar = {
			overflowX: "auto",
			whiteSpace: "nowrap"
		}
        return (
            <div>
				
				<form>
					<input type="text" name="title" placeholder="Title" onChange={this.handleTitleChange} />
					<input id="entryDate" className="datepicker" type="text"  placeholder="Date" onChange={this.handleDateChange} />
					<ul className="collapsible">
							<li>
								<div className="collapsible-header"><i className="material-icons">photo_library</i>Google Photos</div>
								<div className="collapsible-body">
									{loggedIn ? <div id="imageScroll" style={scrollBar} onScroll={this.onScrollEnd}>
										{mediaItems.map((item, index) => 
											<img className="gImage" src={item.baseUrl} alt="" key={item.id} onClick={(e) => this.onImageSelect(item.id, e)} />
										)}
									</div>: 
								<a href="https://quiet-tor-97113.herokuapp.com/auth/google/login" className="btn  blue darken-1">Connect to Google Photos</a>}
								</div> 
							</li>
						</ul>
					<Editor
						className="editor"
						apiKey="0d7fmb4626elbxim4g3vrufgp3pa9ons7qbbl0ltkikc66wy"
						init={{ 
							plugins: 'link table autolink autoresize',
							menubar: false,
							branding: false,
							min_height: 300,
							max_height: 600
						}}
						value={this.state.content} 
						onEditorChange={this.handleEditorChange}
						onSubmit={this.handleEditorSubmit}
					/>
					<input className="btn yellow lighten-2 grey-text text-darken-3" type="submit" value="Save" />
					<span>{this.state.save}</span>
				</form>
			</div>
        )
    }
}

export default NewEntry