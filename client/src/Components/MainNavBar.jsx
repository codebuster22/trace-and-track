import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {Nav, Navbar, Container, Row, Col} from 'react-bootstrap';

const TRANSIT = process.env.REACT_APP_TRANSIT.toLowerCase() === 'true';
const PRODUCT = process.env.REACT_APP_PRODUCT.toLowerCase() === 'true';

const MainNavBar = ({changeService}) => {

    const [selectedService, setSelectedState] = useState(PRODUCT);

    const toggleService = (service) => {
        setSelectedState(service)
        changeService(service);
    }

    return (
        <Navbar bg="dark" expand="lg" variant={"dark"}>
            <Container fluid>
                <Row style={{width: '100%'}} className={'justify-content-center m-0'} >
                    <Col xs={{order: 'last', span: 12}} md={{order: 'first'}} className={'tl'} >
                        {
                            !selectedService?
                                <>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">

                                          <Nav className="mr-auto">
                                            <Nav.Link href="#home">Home</Nav.Link>
                                            <Nav.Link href="#link">Register Part</Nav.Link>
                                            <Nav.Link href="#home">Register Car</Nav.Link>
                                            <Nav.Link href="#link">Trace Part</Nav.Link>
                                            <Nav.Link href="#home">Trace Car</Nav.Link>
                                          </Nav>

                                    </Navbar.Collapse>
                                </>
                                :
                                <>
                                </>
                        }

                    </Col>
                    <Col xs={{order: 'first', span: 'auto'}}>
                        <div className={'toggle-sections d-flex'}>
                            <Navbar.Brand className={'m-0 pointer'} onClick={()=>toggleService(PRODUCT)}>Product</Navbar.Brand>
                            <div className={'toggler mr-3 ml-3 mt-auto mb-auto pointer'} onClick={()=>toggleService(!selectedService)}>
                                <FontAwesomeIcon icon={!selectedService ? faToggleOff : faToggleOn } className={'color-white'} />
                            </div>
                            <Navbar.Brand className={'m-0 pointer'} onClick={()=>toggleService(TRANSIT)}>Transit</Navbar.Brand>
                        </div>
                    </Col>
                    <Col xs={{order: 'last', span: 12}} md={{order: 'last'}} className={'tr'}>
                        {
                            selectedService?
                                        <>
                                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                            <Navbar.Collapse id="basic-navbar-nav">

                                                  <Nav className="ml-auto">
                                                    <Nav.Link href="#home">Home</Nav.Link>
                                                    <Nav.Link href="#link">New Consignment</Nav.Link>
                                                    <Nav.Link href="#link">Track</Nav.Link>
                                                    <Nav.Link href="#link">Cancel</Nav.Link>
                                                    <Nav.Link href="#link">Operate</Nav.Link>
                                                  </Nav>

                                            </Navbar.Collapse>
                                        </>
                                        :
                                        <>
                                        </>
                        }
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}

export default MainNavBar;