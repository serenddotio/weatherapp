import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Superagent from 'superagent';
import WeatherWrapper from './jsx/weatherWrapper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// Basic test to see react will render
it('weather app wrapper test', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WeatherWrapper />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// Basic test of API
test("simple ajax test", done => {
    Superagent
        .get("http://api.openweathermap.org/data/2.5/forecast?&zip=94016&APPID=14f8b10c854e8cc508dc03098e99368c&&units=imperial&&cnt=40")
        .set("Content-Type", "application/json")
        .end(function(err, res) {
            expect.any(res)
            done()
        })
});