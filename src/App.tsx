import React from 'react'
import { HashRouter, Router, Route, Link } from 'react-router-dom'
import Game from './game'
import Home from './home'
import './App.css'

function App() {
    return (
        <div>
            <div className="drag top-drag">
                <p>title</p>
            </div>
            <Router>
                <Route path="/" element={ <Home></Home> }></Route>
                <Route path="/home" element={ <Home></Home> }></Route>
                <Route path="/game" element={ <Game></Game> }></Route>
            </Router>
        </div>

    )
}

export default App