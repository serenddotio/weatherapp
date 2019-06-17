import React from 'react';
import Superagent from 'superagent';

const endPoint = 'http://api.openweathermap.org/data/2.5/forecast?';
const appID = '14f8b10c854e8cc508dc03098e99368c';
const weatherDay = 'div.weather__day';
let zipcode;

// Sort JSON with dates
function sortByDates(items) {
	// Emtpy object
	let sorted = {};
	// Iterate through object
	items.forEach(day => {
		let date = new Date(day.dt * 1000);
    	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    	let name = days[date.getDay()];
    	if (!sorted[name]) {
    		sorted[name] = [];
    	}
    	sorted[name].push(day);
    });	

    return sorted;
}

// Weather components
class Weather extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		// States
		this.state = {
			items: {},
			error: false,
			hasMore: true,
			isLoading: false,
			paginate: 1,
			city: null,
			country: null,
			zipcode: null,
			date: null,
		};
		// Bind functions
		this.handleInteraction = this.handleInteraction.bind(this);
		this.loadWeather = this.loadWeather.bind(this);
		this.remove = this.remove.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;

		this.loadWeather();
		// Refresh every 5 minutes		
		setInterval(this.loadWeather, 50000);
		
	}

	componentWillUnmount() {
	    this._isMounted = false;
	}

	remove(e) {
		this.props.removeCity(e);
	}

	handleInteraction(e) {
		// Stop default behaviour
		e.preventDefault(e);
		// Clear css handle from other opened elements
		let parent = e.currentTarget.parentElement.parentElement;
		let allDays = parent.querySelectorAll(weatherDay);
		let currentDay = e.currentTarget.dataset.day;
		allDays.forEach(function(item, index) {
			
			if (item.dataset.day !== currentDay) {
				item.classList.remove('opened');
			} else {
				if (item.classList.contains('selected')) {
					// Let's move the viewpoint to selected day
					item.parentElement.scrollIntoView({behavior: "smooth", block: "start"});
				}
				item.classList.toggle('opened');
			}
		});
	}

	loadWeather() {

		// Assign zipcode
		zipcode = this.props.zip;

		if (this._isMounted) {	
			// Set zipcode
			this.setState({ zipcode: zipcode });
			// Set isLoading to true while we do ajax
			this.setState({ isLoading: true }, () => {
				Superagent
			    .get(endPoint)
			    .query('zip='+this.state.zipcode)
			    .query('APPID='+appID)
			    .query('&units=imperial')
			    .query('&cnt=40')
			    .on('error', err => {
			    	//console.error(err);
			    })
			    .end((error, response) => {
			    	if (response.status === 200) {
				    	// Sort weather data and group it with the day
				    	let sorted = sortByDates(response.body.list);
				    	this.setState({
				    		city: response.body.city.name, 
				    		country: response.body.city.country,
				    		items: { sorted },
				    		isLoading: false
				    	});
				    }
			    });
			});
		}
	}

	render() {
		return (
			<React.Fragment>
				{(typeof(this.state.items.sorted) != 'undefined' && this.state.items.sorted != null) ? 
				<div className="weather__city-wrapper">								
					<h3 className="weather__city--title">City : { this.state.city }</h3>
					<span className="weather__city--remove" data-id={this.state.zipcode} onClick={() => this.remove(this.state.zipcode)}>Remove</span>
					{Object.keys(this.state.items.sorted).map((keyName, index) => (
						<div className="weather__wrapper" key={index}>
					    	<h5 className="weather__day-title">{keyName}</h5>					    	
					    	{this.state.items.sorted[keyName].map((item, index) => (
					    		<div className={(index === 0) ? 
					    				"weather__day weather__"+keyName.toLowerCase()+ " selected" 
					    				: ' ' + "weather__day weather__"+keyName.toLowerCase()}  
					    			key={index} 
					    			onClick={this.handleInteraction.bind(this)}
					    			data-day={keyName.toLowerCase()}
					    			>
					    			<p>{(new Date(item.dt_txt)).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
						    		<p>Temperature : {item.main.temp} &deg;F</p>
									<img src={"http://openweathermap.org/img/w/"+item.weather[0].icon+".png"} alt="icons" />
									<div className="weather__day--details">
										<p>{item.weather[0].main}</p>
										<p>{item.weather[0].description}</p>
										<p>Humidity : {item.main.humidity} %</p>
										<p>Pressure : {item.main.pressure} hpa</p>
									</div>
								</div>
					    	))}
				    	</div>
				    ))}
					
					{this.state.isLoading === true ? 
						<div className="loader__container">
							<div className="loader">Loading...</div>
						</div> 
					: null}
				</div>
				: null}
			</React.Fragment>
		);
	}
}

export default Weather;