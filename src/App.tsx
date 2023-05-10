import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import './App.css';

const api = 'https://restcountries.com/v3.1/all';

interface name {
  common: string;
  official: string;
}

interface CountryProps {
  name: name;
  population: number;
}

function App() {
  const [ countries, setCountries ] = useState<Array<CountryProps>>([]); // list of all countries data
  const [ order, setOrder ] = useState(0); // ascending vs descending
  const [ detailed, setDetailed ] = useState(true); // detailed view vs general view
  const [ options, setOptions ] = useState({
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '100%',
        barHeight: '100%',
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: [ '#000000' ],
    xaxis: {
      categories: [] as string[] // list of countries
    }
  });
  const [ series, setSeries ] = useState([
    {
      name: "population",
      data: [] as number[] // list of populations
    }
  ]);

  // sets the chart and sorts the countries based on population if order is set
  const setChart = () => {
    // descending is set OR if general is set and neither ascending/descending is set
    if (order === -1 || (!detailed && order === 0)) {
      countries.sort((a, b) => (a.population > b.population ? -1 : 1));
      setOrder(-1);
    }
    if (order === 1) {
      countries.sort((a, b) => (a.population < b.population ? -1 : 1));
    }
    var populationList = [] as number[];
    var countryList = [] as string[];
    countries.forEach(country => {
      populationList.push(country.population);
      countryList.push(country.name.common);
    });
    if (populationList.length && countryList.length) {
      setOptions(previousState => {
        return {
          ...previousState,
          xaxis: {
            categories: detailed ? countryList : countryList.slice(0, 20)
          }
        }
      });
      setSeries([
        {
          name: "population",
          data: detailed ? populationList : populationList.slice(0, 20)
        }
      ]);
    }
  }

  // API fetch
  useEffect(() => {
    fetch(api)
      .then((resp) => resp.json())
      .then((data) => setCountries(data));
  }, []);

  // Sets the chart whenever order is changed or list of countries is updated
  useEffect(() => {
    setChart();
  }, [order, detailed, countries]);

  return (
    <div className="App">
      <h1 className="App-heading">
        World Populations
      </h1>
      <h3 className="App-author">
        by: Rohit Chhatre
      </h3>
      <div className="App-buttons">
        <button className={ detailed ? "App-button selected" : "App-button" } onClick={ () => { setDetailed(true) } }>
          All Countries
        </button>
        <button className={ !detailed ? "App-button selected" : "App-button" } onClick={ () => { setDetailed(false) } }>
          By Population (Top 20)
        </button>
      </div>
      <div className="App-orders">
        <button className={ order === 1 ? "App-order selected" : "App-order" } onClick={ () => { setOrder(1) } }>
          Ascending
        </button>
        <button className={ order === -1 ? "App-order selected" : "App-order" } onClick={ () => { setOrder(-1) } }>
          Descending
        </button>
      </div>
      <Chart
        options={ options }
        series={ series }
        type="bar"
        height={ detailed ? "4000px" : "auto" }
      />
    </div>
  );
}

export default App;
