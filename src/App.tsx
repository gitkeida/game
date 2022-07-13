import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Game from './game'
import Home from './home'
import './App.css'

function App() {
    return (
        <div>
            <div className="drag top-drag">
                <p>title</p>
            </div>
            <Routes>
                <Route path="/" element={ <Home></Home> }></Route>
                <Route path="/home" element={ <Home></Home> }></Route>
                <Route path="/game" element={ <Game></Game> }></Route>
            </Routes>
        </div>

    )
}

export default App