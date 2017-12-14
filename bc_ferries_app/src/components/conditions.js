import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Col, Table} from 'react-materialize';
import moment from 'moment';
const axios = require('axios')

class Conditions extends Component {
    constructor () {
        super ()
        this.state = {
            update: '',
            departure_terminal: 'Loading',
            arrival_terminal: 'Loading',
            current_sailing: {
               scheduled_departure: 'Error',
               actual_departure: 'Error',
               percent_full: 'Error',
               car_wait: 'Error',
               oversize_wait: 'Error',
               vessel: 'Error',
               eta: 'Error'
            },
            next_sailing: {
                scheduled_departure: 'Error',
                percent_full: 'Error',
                car_wait: 'Error',
                oversize_wait: 'Error',
                vessel: 'Error',
           },
           next_next_sailing: {
                scheduled_departure: 'Error',
                percent_full: 'Error',
                car_wait: 'Error',
                oversize_wait: 'Error',
                vessel: 'Error',
           }
        }
    }

    getCurrentSailingData = () => {
        let arrivalHyphenated = this.state.arrival_terminal.replace(" ", "-");
        let departureHyphenated = this.state.departure_terminal.replace(" ", '-');
        let url = `http://localhost:8080/conditions/${departureHyphenated}/${arrivalHyphenated}`

        axios.get(url)
            .then(response => {
                let data = response.data;
                
                let currentScheduledDeparture = data.current ? data.current.sailing_time : 'Not Found';
                let currentActualDeparture = data.current ? data.current.actual_departure : 'Not Found';
                let currentPercentFull = data.current_cond ? data.current_cond.percent_full : 'Not Found';
                let currentCarWait = data.current_cond ? data.current_cond.car_waits : 'Not Found';
                let currentOversizeWait = data.current_cond ? data.current_cond.oversize_waits : 'Not Found';
                let currentVessel = data.current ? data.current.vessel : 'Not Found';
                let currentEta = data.current ? data.current.eta : 'Not Found';
                let currentStatus = data.current ? data.current.status : 'Not Found';
                let currentUpdatedAt = data.next_cond ? data.next_cond.created_at : 'Not Found';

                let nextScheduledDeparture = data.next ? data.next.sailing_time : 'Not Found';
                let nextPercentFull = data.next_cond ? data.next_cond.percent_full : 'Not Found';
                let nextCarWait = data.next_cond ? data.next_cond.car_waits : 'Not Found';
                let nextOversizeWait = data.next_cond ? data.next_cond.oversize_waits : 'Not Found';
                let nextVessel = data.next ? data.next.vessel : 'Not Found';

                let nextNextScheduledDeparture = data.next_next ? data.next_next.sailing_time : 'Not Found';
                let nextNextPercentFull = data.next_cond ? data.next_cond.next_percent_full : 'Not Found';
                let nextNextVessel = data.next_next ? data.next_next.vessel : 'Not Found';
                
                this.setState({
                    current_sailing: {
                        scheduled_departure: this.time(currentScheduledDeparture),
                        actual_departure: this.time(currentActualDeparture),
                        percent_full: currentPercentFull,
                        car_wait: currentCarWait,
                        oversize_wait: currentOversizeWait,
                        vessel: currentVessel,
                        eta: currentEta,
                        status: currentStatus,
                        updated_at: currentUpdatedAt
                    }, 
                    next_sailing: {
                        scheduled_departure: this.time(nextScheduledDeparture),
                        percent_full: nextPercentFull,
                        car_wait: nextCarWait,
                        oversize_wait: nextOversizeWait,
                        vessel: nextVessel
                    },
                    next_next_sailing: {
                        scheduled_departure: this.time(nextNextScheduledDeparture),
                        percent_full: nextNextPercentFull,
                        vessel: nextNextVessel
                    }
            });
        });
    }

    setDate = () => {
        let date = new Date();
        let todaysDate = moment(date).format('YYYY-MM-DD h:mm a');
        this.setState({
            update: todaysDate
        })
    }

    time = (time) => {
        time = moment(moment(this.state.update).format('YYYY-MM-DD') + ' ' + time).format('h:mm a')
        return(time)
    }

    setRoute = () => {
        this.setState({
            departure_terminal: this.props.match.params.departure.replace(/-/g, " "),
            arrival_terminal: this.props.match.params.arrival.replace(/-/g, " ")
        })
    }

    componentWillMount() {
        this.setDate();
        this.setRoute()
    };

    componentDidMount() {
        this.getCurrentSailingData()
    }

    render() {
        setInterval(this.getCurrentSailingData(), 300000)
        return(
            <div>
                <Col m={8} offset='m2'>
                    <div className="row">
                        <div className="col m8">
                            <h3>{this.state.departure_terminal} to {this.state.arrival_terminal}</h3>
                        </div>
                        <div className="col m4">
                            <Link to='/' className="waves-effect waves-light btn terminalButton backButton">Back To Routes</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className='card'>
                            <h5>Current Sailing</h5>
                            <p>Last Refresh: {this.state.update}</p>
                            <p>Last Updated: {moment(this.state.current_sailing.updated_at).format('YYYY-MM-DD h:mm a')}</p>
                            <hr/>
                            <table className='striped'>
                                <tbody>
                                    <tr>
                                        <th>Scheduled Departure:</th>
                                        <td>{this.state.current_sailing.scheduled_departure}</td>
                                    </tr>
                                    <tr>
                                        <th>Actual Departure:</th>
                                        <td>{this.state.current_sailing.actual_departure}</td>
                                    </tr>
                                    <tr>
                                        <th>Percent Full:</th>
                                        <td>{this.state.current_sailing.percent_full}</td>
                                    </tr>
                                    <tr>
                                        <th>Car Wait:</th>
                                        <td>{this.state.current_sailing.car_wait}</td> 
                                    </tr>
                                    <tr>
                                        <th>Oversize Wait:</th>
                                        <td>{this.state.current_sailing.oversize_wait}</td> 
                                    </tr>
                                    <tr>    
                                        <th>Vessel:</th>
                                        <td>{this.state.current_sailing.vessel}</td>
                                    </tr>
                                    <tr>
                                        <th>Arrival Time/ETA:</th>
                                        <td>{this.state.current_sailing.eta}</td>  
                                    </tr>
                                    <tr>
                                        <th>Status:</th>
                                        <td>{this.state.current_sailing.status}</td>  
                                    </tr>
                                </tbody>    
                            </table>
                        </div>
                        <div className='card'>
                            <h5>Next Sailing</h5>
                            <p>Last Update: {this.state.update}</p>
                            <hr/>
                            <table className='striped'>
                                <tbody>
                                    <tr>
                                        <th>Scheduled Departure:</th>
                                        <td>{this.state.next_sailing.scheduled_departure}</td>
                                    </tr>
                                    <tr>
                                        <th>Percent Full:</th>
                                        <td>{this.state.next_sailing.percent_full}</td>
                                    </tr>
                                    <tr>
                                        <th>Car Wait:</th>
                                        <td>{this.state.next_sailing.car_wait}</td> 
                                    </tr>
                                    <tr>
                                        <th>Oversize Wait:</th>
                                        <td>{this.state.next_sailing.oversize_wait}</td> 
                                    </tr>
                                    <tr>    
                                        <th>Vessel:</th>
                                        <td>{this.state.next_sailing.vessel}</td>
                                    </tr>
                                </tbody>    
                            </table>
                        </div>
                        <div className='card'>
                            <h5>Next Next Sailing</h5>
                            <p>Last Update: {this.state.update}</p>
                            <hr/>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <th>Scheduled Departure:</th>
                                        <td>{this.state.next_next_sailing.scheduled_departure}</td>
                                    </tr>
                                    <tr>
                                        <th>Percent Full:</th>
                                        <td>{this.state.next_next_sailing.percent_full}</td>
                                    </tr>
                                    <tr>    
                                        <th>Vessel:</th>
                                        <td>{this.state.next_next_sailing.vessel}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>    
                </Col>
            </div>    
        )
    }
}

export default Conditions;