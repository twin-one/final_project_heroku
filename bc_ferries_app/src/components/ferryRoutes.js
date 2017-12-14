import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Col} from 'react-materialize';

class FerryRoutes extends Component {
    render () {
        return (
            <Col s={8} offset='s2'>
                <h3>Current Conditions For Popular Routes</h3>
                <Link to={'/conditions/Tsawwassen/Swartz-Bay'} className="waves-effect waves-light btn terminalButton">Tsawwassen to Swartz Bay</Link>
                <Link to={'/conditions/Swartz-Bay/Tsawwassen'} className="waves-effect waves-light btn terminalButton">Swartz Bay to Tsawwassen</Link>
                <Link to={'/conditions/Horseshoe-Bay/Departure-Bay'} className="waves-effect waves-light btn terminalButton">Horseshoe Bay to Departure Bay</Link>
                <Link to={'/conditions/Departure-Bay/Horseshoe-Bay'} className="waves-effect waves-light btn terminalButton">Departure Bay to Horseshoe Bay</Link>
            </Col>
        )
    }
}

export default FerryRoutes;