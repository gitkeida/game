import React from 'react';
import logo from './logo.svg';
import './App.css';

import Clock from './components/clock';
import Toggle from './components/toggle';
import Greeting from './components/greeting';
import LoginControl from './components/loginControl';
import NumberList from './components/numberList';
import FormControl from './components/formControl';
import Calculator from './components/calculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React 123
        </a>
        <Clock></Clock>
        <Toggle></Toggle>
        <Greeting isLoggedIn={true}></Greeting>
        <LoginControl></LoginControl>
        <NumberList numbers={[1,2,3,4,5]}></NumberList>
        <FormControl></FormControl>
        <Calculator></Calculator>
      </header>
    </div>
  );
}

export default App;
