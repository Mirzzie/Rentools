import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { PlusCircle, PencilSquare, FileEarmarkText, ListCheck, ClipboardData } from 'react-bootstrap-icons'; // Import an additional Bootstrap icon

const HomePage = () => {
    return (
        <Container className="text-center mt-5">
            <h1 className="mb-4">Welcome to Power Tools Gallery</h1>
            <p className="mb-5">Choose an action to get started:</p>

            <Row className="justify-content-center g-4">
                {/* Add New Items */}
                <Col md={4}>
                    <Card className="shadow h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <PlusCircle size={50} className="mb-3 text-primary" />
                            <Card.Title>Add New Items</Card.Title>
                            <Card.Text>Insert new tools and equipment to your inventory.</Card.Text>
                            <Link to="/additems">
                                <Button variant="primary" className="mt-auto w-100">Add Items</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Modify Items */}
                <Col md={4}>
                    <Card className="shadow h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <PencilSquare size={50} className="mb-3 text-warning" />
                            <Card.Title>Modify Items</Card.Title>
                            <Card.Text>Update existing inventory information.</Card.Text>
                            <Link to="/itemsmodify">
                                <Button variant="warning" className="mt-auto w-100">Modify Items</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* View Orders */}
                <Col md={4}>
                    <Card className="shadow h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <ListCheck size={50} className="mb-3 text-info" />
                            <Card.Title>View Orders</Card.Title>
                            <Card.Text>Track and manage customer orders.</Card.Text>
                            <Link to="/orderview">
                                <Button variant="info" className="mt-auto w-100">View Orders</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center g-4 mt-4">
                {/* Order Form */}
                <Col md={4}>
                    <Card className="shadow h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <FileEarmarkText size={50} className="mb-3 text-success" />
                            <Card.Title>Order Form</Card.Title>
                            <Card.Text>Create new orders for renting or purchasing tools.</Card.Text>
                            <Link to="/orderform">
                                <Button variant="success" className="mt-auto w-100">Go to Order Form</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Record View */}
                <Col md={4}>
                    <Card className="shadow h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <ClipboardData size={50} className="mb-3 text-secondary" />
                            <Card.Title>View Records</Card.Title>
                            <Card.Text>View the complete history of orders and records.</Card.Text>
                            <Link to="/records">
                                <Button variant="secondary" className="mt-auto w-100">Go to Records</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
