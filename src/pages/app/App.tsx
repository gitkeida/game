import React from 'react'
import { HashRouter, BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Game from '../game/game'
import Home from '../home/home'
import Login from '../login/login'
import './App.css'

function App() {
    return (
        <div>
            <div className="drag" style={{width: '100%', height: '31px', lineHeight: '31px', paddingLeft: '10px', fontSize: '12px'}}>
                <img src={require('../../image/icon.ico')} style={{width: '16px', verticalAlign: 'sub', marginRight: '2px'}} alt="" />
                <span>飞机大战</span>
            </div>
            <Routes>
                <Route path="/" element={ <Login></Login> }></Route>
                <Route path="/login" element={ <Login></Login> }></Route>
                <Route path="/home" element={ <Home></Home> }></Route>
                <Route path="/game" element={ <Game></Game> }></Route>
            </Routes>
        </div>

    )
}

export default App