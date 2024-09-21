import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import api from '../utils/api';

const ItemForm = () => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [rentalRate, setRentalRate] = useState('');
    const [saleRate, setSaleRate] = useState('');
    const [stock, setstock] = useState('');
    const [orderType, setOrderType] = useState('rent');

    const handleSubmit = (e) => {
        e.preventDefault();
        const itemData = {
            item_name: itemName,
            description,
            rentalRate: orderType !== 'sale' ? parseFloat(rentalRate) : null,
            saleRate: orderType !== 'rent' ? parseFloat(saleRate) : null,
            stock: parseInt(stock, 10),
        };

        api.post('/items', itemData)
            .then(response => {
                alert('Item created successfully!');
                // Reset the form
                setItemName('');
                setDescription('');
                setRentalRate('');
                setSaleRate('');
                setstock('');
                setOrderType('rent'); // Reset order type
            })
            .catch(error => console.error('Error creating item:', error));
    };

    return (
        <div className="container mt-4">
            <Card>
                <Card.Header as="h4">Create Item</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="itemName">
                            <Form.Label column sm={3}>Item Name</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Enter the name of the item.
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="description">
                            <Form.Label column sm={3}>Description</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    Provide a brief description of the item.
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="orderType">
                            <Form.Label column sm={3}>Item Type</Form.Label>
                            <Col sm={9}>
                                <Form.Check
                                    type="radio"
                                    label="Rent"
                                    name="orderType"
                                    id="rentType"
                                    value="rent"
                                    checked={orderType === 'rent'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Sale"
                                    name="orderType"
                                    id="saleType"
                                    value="sale"
                                    checked={orderType === 'sale'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Both"
                                    name="orderType"
                                    id="bothType"
                                    value="both"
                                    checked={orderType === 'both'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        {orderType !== 'sale' && (
                            <Form.Group as={Row} className="mb-3" controlId="rentalRate">
                                <Form.Label column sm={3}>Rental Rate</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="number"
                                        value={rentalRate}
                                        onChange={(e) => setRentalRate(e.target.value)}
                                        required={orderType !== 'sale'}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter the rental rate for this item.
                                    </Form.Text>
                                </Col>
                            </Form.Group>
                        )}

                        {orderType !== 'rent' && (
                            <Form.Group as={Row} className="mb-3" controlId="saleRate">
                                <Form.Label column sm={3}>Sale Rate</Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type="number"
                                        value={saleRate}
                                        onChange={(e) => setSaleRate(e.target.value)}
                                        required={orderType !== 'rent'}
                                    />
                                    <Form.Text className="text-muted">
                                        Enter the sale rate for this item.
                                    </Form.Text>
                                </Col>
                            </Form.Group>
                        )}

                        <Form.Group as={Row} className="mb-3" controlId="stock">
                            <Form.Label column sm={3}>Stock</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setstock(e.target.value)}
                                    required
                                    min="0"
                                />
                                <Form.Text className="text-muted">
                                    Specify the available stock for this item.
                                </Form.Text>
                            </Col>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit">
                                Create Item
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ItemForm;

