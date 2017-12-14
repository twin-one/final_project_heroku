import React, { Component } from 'react';
import './App.css';
import {Navbar, Row} from 'react-materialize';
import {Link} from 'react-router-dom';
import {Route} from 'react-router-dom';
import FerryRoutes from './components/ferryRoutes';
import Conditions from './components/conditions';
import About from './components/about'


class App extends Component {
  render() {
    return (
      <div>
        <Row>
          <Navbar brand='BC Ferries App' right>
              <li><Link to='/'>Routes</Link></li>
              <li><Link to='/about'>About</Link></li>
          </Navbar>
          <Route exact path='/' render={() => <FerryRoutes/>}/>
          <Route path='/conditions/:departure/:arrival' render={(props) => <Conditions {...props}/>}/>
          <Route path='/about' render={() => <About/>}/>
        </Row>
      </div>
    );
  }
}

export default App;
