import React from 'react';
import Weather from './weather';

const searchInput = 'input.zipcode__input';

// Weather wrapper component
class WeatherWrapper extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		// States
		this.state = {
			error: false,
			cities: [],
			ids: []
		};
		// Bind functions
		this.handleChange = this.handleChange.bind(this);
		this.removeCity = this.removeCity.bind(this);
	}

	handleChange(e) {
		// Stop default behaviour
		e.preventDefault(e);
		// Let's use the value from the input as zipcode
		let id = document.querySelector(searchInput).value;
		// Validate US zipcode with length and regex
		if (id.length === 5 && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(id)) {	
			if (this.state.ids.indexOf(id) === -1) {
				this.setState({ 
					cities: [<Weather removeCity={this.removeCity} zip={id} key={id} />, ...this.state.cities],
					ids: [id, ...this.state.ids],
				});
			}
		}
	}

	removeCity(e) {
		// Remove the city if id is found from the array
		if (this.state.ids.indexOf(e) !== -1) {
			this.setState({
				cities: this.state.cities.filter((_, i) => i !== this.state.ids.indexOf(e)),
				ids: this.state.ids.filter((_, i) => i !== this.state.ids.indexOf(e))
			});
		}
	}

	componentDidMount() {
		this._isMounted = true;
		
		if (this._isMounted) {
			// Default city will be san franciso
			this.setState({ cities: [<Weather removeCity={this.removeCity} zip="94016" key="94016" />], ids: ["94016"]});
		}
	}

	componentWillUnmount() {
	    this._isMounted = false;
	}

	render() {
		
		return (
			<React.Fragment>
				<h1 className="weather__app--title">Weather App</h1>
				<h2 className="weather__country">Country : USA</h2>
				<input type="text" name="title" className="zipcode__input" placeholder="ZIP code" onChange={this.handleChange.bind(this)} />
				{this.state.cities}
				{this.state.isLoading === true ? 
					<div className="loader__container">
						<div className="loader">Loading...</div>
					</div> 
				: null}
				{this.state.cities.length === 0 ?
					<h2>Please type in the ZIP code to get weather information</h2>
				: null}
			</React.Fragment>
		);
	}
}

export default WeatherWrapper;