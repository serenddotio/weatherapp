import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import WeatherWrapper from './jsx/weatherWrapper';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<App />, document.getElementById('root'));



// Check to see if container exists - Looking for only the first one 
let container = document.querySelector('#root');
if (typeof(container) !== 'undefined' && container !== null) {
	ReactDOM.render(
		<WeatherWrapper />,
		container
	);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
