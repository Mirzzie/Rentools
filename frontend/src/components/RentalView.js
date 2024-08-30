// import React, { useEffect, useState } from 'react';
// import api from '../utils/api';
// import { Card, Alert, Badge, Accordion, Container, Row, Col } from 'react-bootstrap';

// const RentalsTable = () => {
//     const [rentals, setRentals] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchRentals = async () => {
//             try {
//                 const response = await api.get('/rentals');
//                 setRentals(response.data);
//             } catch (error) {
//                 setError('Error fetching rentals.');
//             }
//         };
//         fetchRentals();
//     }, []);

//     return (
//         <Container fluid className="py-4">
//             <Card className="shadow-sm mb-4">
//                 <Card.Header as="h5" className="bg-primary text-white text-center">
//                     Rentals Overview
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                     {error && <Alert variant="danger" className="m-3">{error}</Alert>}
//                     <Accordion defaultActiveKey="0">
//                         {rentals.map((rental, index) => (
//                             <Accordion.Item eventKey={index.toString()} key={rental._id}>
//                                 <Accordion.Header>
//                                     {rental.name} - {rental.phone}
//                                 </Accordion.Header>
//                                 <Accordion.Body>
//                                     <Row className="mb-3">
//                                         <Col md={4}>
//                                             <Card className="h-100 shadow-sm">
//                                                 <Card.Header className="bg-info text-white">
//                                                     Customer Details
//                                                 </Card.Header>
//                                                 <Card.Body>
//                                                     <p><strong>Address:</strong> {rental.address}</p>
//                                                     <p><strong>Rental Date:</strong> {new Date(rental.rentalDate).toLocaleDateString()}</p>
//                                                     <p><strong>Return Date:</strong> {rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : 'N/A'}</p>
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                         <Col md={4}>
//                                             <Card className="h-100 shadow-sm">
//                                                 <Card.Header className="bg-secondary text-white">
//                                                     Rental Items
//                                                 </Card.Header>
//                                                 <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                                                     {rental.rentalItems.length > 0 ? (
//                                                         rental.rentalItems.map(item => (
//                                                             <div key={item._id._id} className="mb-2">
//                                                                 <Badge bg="info" className="me-2">{item._id.item_name}</Badge>
//                                                                 <small className="text-muted">{item._id.description}</small>
//                                                                 <br />
//                                                                 <span>Qty: {item.stock} | Rate: ₹{item._id.rentalRate}</span>
//                                                             </div>
//                                                         ))
//                                                     ) : (
//                                                         <Badge bg="warning">No rental items</Badge>
//                                                     )}
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                         <Col md={4}>
//                                             <Card className="h-100 shadow-sm">
//                                                 <Card.Header className="bg-success text-white">
//                                                     Sale Items
//                                                 </Card.Header>
//                                                 <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                                                     {rental.saleItems.length > 0 ? (
//                                                         rental.saleItems.map(item => (
//                                                             <div key={item._id._id} className="mb-2">
//                                                                 <Badge bg="success" className="me-2">{item._id.item_name}</Badge>
//                                                                 <small className="text-muted">{item._id.description}</small>
//                                                                 <br />
//                                                                 <span>Qty: {item.stock} | Rate: ₹{item._id.saleRate}</span>
//                                                             </div>
//                                                         ))
//                                                     ) : (
//                                                         <Badge bg="warning">No sale items</Badge>
//                                                     )}
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col md={6}>
//                                             <Card className="shadow-sm">
//                                                 <Card.Body>
//                                                     <h6>Total Rent Amount: <Badge bg="primary">₹{rental.totalRentAmount}</Badge></h6>
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                         <Col md={6}>
//                                             <Card className="shadow-sm">
//                                                 <Card.Body>
//                                                     <h6>Total Sale Amount: <Badge bg="primary">₹{rental.totalSaleAmount}</Badge></h6>
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                     <Row className="mt-3">
//                                         <Col>
//                                             <Card className="shadow-sm">
//                                                 <Card.Body>
//                                                     {rental.overdueCharges > 0 ? (
//                                                         <Alert variant="danger">
//                                                             Overdue Charges: ₹{rental.overdueCharges}
//                                                         </Alert>
//                                                     ) : (
//                                                         <Alert variant="success">
//                                                             No overdue charges
//                                                         </Alert>
//                                                     )}
//                                                 </Card.Body>
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                 </Accordion.Body>
//                             </Accordion.Item>
//                         ))}
//                     </Accordion>
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };

// export default RentalsTable;


import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card, Alert, Badge, Accordion, Container, Row, Col, Button } from 'react-bootstrap';

const RentalsTable = () => {
    const [rentals, setRentals] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = await api.get('/rentals');
            setRentals(response.data);
        } catch (error) {
            setError('Error fetching rentals.');
        }
    };

    const handleReturnAllItems = async (rentalId) => {
        try {
            // Update the rental to mark all items as returned and restore stock
            const response = await api.put(`/rentals/${rentalId}/return-all`);

            if (response.data.allReturned) {
                setSuccessMessage('All items returned and rental removed.');
            } else {
                setSuccessMessage('Returned available items. Pending items are still in the rental.');
            }

            // Refresh the rentals data
            fetchRentals();
        } catch (error) {
            setError('Failed to return all items.');
        }
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm mb-4">
                <Card.Header as="h5" className="bg-primary text-white text-center">
                    Rentals Overview
                </Card.Header>
                <Card.Body className="p-0">
                    {error && <Alert variant="danger" className="m-3">{error}</Alert>}
                    {successMessage && <Alert variant="success" className="m-3">{successMessage}</Alert>}
                    <Accordion defaultActiveKey="0">
                        {rentals.map((rental, index) => (
                            <Accordion.Item eventKey={index.toString()} key={rental._id}>
                                <Accordion.Header>
                                    {rental.name} - {rental.phone}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row className="mb-3">
                                        <Col md={4}>
                                            <Card className="h-100 shadow-sm">
                                                <Card.Header className="bg-info text-white">
                                                    Customer Details
                                                </Card.Header>
                                                <Card.Body>
                                                    <p><strong>Address:</strong> {rental.address}</p>
                                                    <p><strong>Rental Date:</strong> {new Date(rental.rentalDate).toLocaleDateString()}</p>
                                                    <p><strong>Return Date:</strong> {rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : 'N/A'}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="h-100 shadow-sm">
                                                <Card.Header className="bg-secondary text-white">
                                                    Rental Items
                                                </Card.Header>
                                                <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {rental.rentalItems.length > 0 ? (
                                                        rental.rentalItems.map(item => (
                                                            <div key={item._id._id} className="mb-2">
                                                                <Badge bg="info" className="me-2">{item._id.item_name}</Badge>
                                                                <small className="text-muted">{item._id.description}</small>
                                                                <br />
                                                                <span>Qty: {item.stock} | Rate: ₹{item._id.rentalRate}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <Badge bg="warning">No rental items</Badge>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="h-100 shadow-sm">
                                                <Card.Header className="bg-success text-white">
                                                    Sale Items
                                                </Card.Header>
                                                <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {rental.saleItems.length > 0 ? (
                                                        rental.saleItems.map(item => (
                                                            <div key={item._id._id} className="mb-2">
                                                                <Badge bg="success" className="me-2">{item._id.item_name}</Badge>
                                                                <small className="text-muted">{item._id.description}</small>
                                                                <br />
                                                                <span>Qty: {item.stock} | Rate: ₹{item._id.saleRate}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <Badge bg="warning">No sale items</Badge>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Card className="shadow-sm">
                                                <Card.Body>
                                                    <h6>Total Rent Amount: <Badge bg="primary">₹{rental.totalRentAmount}</Badge></h6>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card className="shadow-sm">
                                                <Card.Body>
                                                    <h6>Total Sale Amount: <Badge bg="primary">₹{rental.totalSaleAmount}</Badge></h6>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <Card className="shadow-sm">
                                                <Card.Body>
                                                    {rental.overdueCharges > 0 ? (
                                                        <Alert variant="danger">
                                                            Overdue Charges: ₹{rental.overdueCharges}
                                                        </Alert>
                                                    ) : (
                                                        <Alert variant="success">
                                                            No overdue charges
                                                        </Alert>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col className="text-center">
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => handleReturnAllItems(rental._id)}
                                                disabled={rental.rentalItems.length === 0}
                                            >
                                                Return All Items
                                            </Button>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RentalsTable;
