import React, {Component} from 'react';
import {Row} from 'react-materialize';

class About extends Component {
    render() {
        return (
            <Row className="container"> 
                <h3>About This BC Ferries App</h3>
                <p>Bcferries.com sucks for mobile, you know it, I know it, even they know it, so
                    I built this little web app. Now when you’re on the way to the ferry you just
                    load this page, pick your sailing and get the latest details on the ferry you’re
                    trying to catch.
                </p>
                <p>But wait there’s more!
                </p>
                <p>We’re not just giving the bc ferries site a facelift, we’re also collecting
                    data, lot’s of data to help you better plan your bc ferries trip. Using data
                    scraping techniques and complex algorithms we are working towards letting you
                    know exactly when you need to get to the ferry to make sure you aren’t pushed to
                    the next sailing. It’s not a perfect science yet, but we’re getting there,
                    trying to save you time and money.
                </p>
                <p>I should say we have no association with BC Ferries whatsoever and we only
                    use and collect publicly available information.
                </p>
                <p>So thanks for visiting our site, and hit us up below if you have any
                    questions or feedback.
                    <br/>
                    <br/>
                    Thanks,
                    <br/>Twin One Development Team</p>

                <a href='mailto:info@twin-one.com' className='btn'>Email</a>
            </Row>
        )
    }
};

export default About;