import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Game from './game'
import Home from './home'

function App() {
    return (
        <Routes>
            <Route path="/" element={ <Home></Home> }></Route>
            <Route path="/home" element={ <Home></Home> }></Route>
            <Route path="/game" element={ <Game></Game> }></Route>
        </Routes>
    )
}

export default App