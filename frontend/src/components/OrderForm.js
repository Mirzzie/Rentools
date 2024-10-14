import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Form, Button, Dropdown, Card, InputGroup, FormControl, Row, Col, Badge, ListGroup } from 'react-bootstrap';

const OrderForm = () => {
    const [items, setItems] = useState([]);
    const [selectedRentItems, setSelectedRentItems] = useState([]);
    const [selectedSaleItems, setSelectedSaleItems] = useState([]);
    const [orderType, setOrderType] = useState('rent');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [totalRentAmount, setTotalRentAmount] = useState(0);
    const [totalSaleAmount, setTotalSaleAmount] = useState(0);
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Fetch items from backend
    useEffect(() => {
        api.get('/items')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    // Calculate total amounts
    useEffect(() => {
        setTotalRentAmount(selectedRentItems.reduce((total, item) => total + (item.rentalRate * item.stock), 0));
        setTotalSaleAmount(selectedSaleItems.reduce((total, item) => total + (item.saleRate * item.stock), 0));
    }, [selectedRentItems, selectedSaleItems]);

    const handleOrderTypeChange = (e) => {
        setOrderType(e.target.value);
        setSelectedRentItems([]);
        setSelectedSaleItems([]);
        setReturnDate('');
        setReturnTime('');
    };

    // Handle selection or deselection of items
    const handleSelectChange = (item, type) => {
        const isRent = type === 'rent';
        const updatedItems = isRent ? selectedRentItems : selectedSaleItems;
        const isSelected = updatedItems.some(i => i._id === item._id);

        if (isSelected) {
            const newItems = updatedItems.filter(i => i._id !== item._id);
            isRent ? setSelectedRentItems(newItems) : setSelectedSaleItems(newItems);
        } else {
            const newItem = { ...item, stock: 1 };
            isRent ? setSelectedRentItems([...updatedItems, newItem]) : setSelectedSaleItems([...updatedItems, newItem]);
        }
    };

    // Handle changes in stock quantity
    const handleStockChange = (e, item, type) => {
        const newStock = parseInt(e.target.value, 10) || 1;
        const availableStock = items.find(i => i._id === item._id)?.stock || 1;
        const adjustedStock = Math.min(Math.max(newStock, 1), availableStock);

        const updatedItems = (type === 'rent' ? selectedRentItems : selectedSaleItems).map(i =>
            i._id === item._id ? { ...i, stock: adjustedStock } : i
        );

        type === 'rent' ? setSelectedRentItems(updatedItems) : setSelectedSaleItems(updatedItems);
    };

    // Filter items based on search query
    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(itemSearchQuery.toLowerCase()) &&
        (orderType === 'rent' ? item.rentalRate : orderType === 'sale' ? item.saleRate : true)
    );

    // Generate item options for the dropdown
    const itemOptions = (items, type) => {
        return items.map(item => (
            <Dropdown.Item
                key={item._id}
                className={`d-flex align-items-center ${item.stock === 0 ? 'text-muted' : ''}`}
                disabled={item.stock === 0}
            >
                <Form.Check
                    checked={type === 'rent' ? selectedRentItems.some(i => i._id === item._id) : selectedSaleItems.some(i => i._id === item._id)}
                    onChange={() => handleSelectChange(item, type)}
                    label={
                        <span className="d-flex justify-content-between w-100">
                            <span>
                                <strong>{item.item_name}</strong>
                                {item.stock === 0 && <Badge bg="danger" className="ms-2">Out of Stock</Badge>}
                                <small className="text-muted ms-2">{item.description}</small>
                            </span>
                            <Badge bg="info" className="ms-2">
                                {type === 'rent' ? `₹${item.rentalRate}/day` : `₹${item.saleRate}`}
                            </Badge>
                            <Badge bg="secondary" className="ms-2">Stock: {item.stock}</Badge>
                        </span>
                    }
                />
            </Dropdown.Item>
        ));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false ||
            ((orderType === 'rent' || orderType === 'both') && selectedRentItems.length === 0) ||
            ((orderType === 'sale' || orderType === 'both') && selectedSaleItems.length === 0)) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setLoading(true);

        const orderData = {
            name,
            phone,
            address,
            rentItems: selectedRentItems.map(item => ({ _id: item._id, stock: item.stock })),
            saleItems: selectedSaleItems.map(item => ({ _id: item._id, stock: item.stock })),
            orderDate: new Date().toISOString().split('T')[0],
            returnDate,
            returnTime,
            totalRentAmount,
            totalSaleAmount
        };

        console.log("Submitting order data: ", orderData);

        api.post('/orders', orderData)
            .then(() => {
                alert('Order created successfully!');
                resetForm();
            })
            .catch(error => {
                console.error('Error creating order:', error.response.data || error.message);
                alert(`Error creating order: ${error.response.data.message || error.message}`);
            })
            .finally(() => setLoading(false));

    };

    // Reset form after successful submission
    const resetForm = () => {
        setName('');
        setPhone('');
        setAddress('');
        setOrderType('rent');
        setSelectedRentItems([]);
        setSelectedSaleItems([]);
        setReturnDate('');
        setReturnTime('');
        setValidated(false);
    };

    const grandTotal = totalRentAmount + totalSaleAmount;

    return (
        <Card className="mt-3">
            <Card.Body>
                <div className="container mt-4">
                    <h2 className="mb-4">Create an Order</h2>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Please provide a name.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        pattern="^\d{10}$"
                                    />
                                    <Form.Control.Feedback type="invalid">Please provide a valid 10-digit phone number.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Please provide an address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Order Type</Form.Label>
                            <Form.Control as="select" value={orderType} onChange={handleOrderTypeChange} required>
                                <option value="rent">Rent Only</option>
                                <option value="sale">Sale Only</option>
                                <option value="both">Rent and Sale</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">Please select an order type.</Form.Control.Feedback>
                        </Form.Group>

                        {(orderType === 'rent' || orderType === 'both') && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Return Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        required
                                        min={new Date().toISOString().split('T')[0]} // Set min to today's date
                                    />
                                    <Form.Control.Feedback type="invalid">Please provide a return date.</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group

                                    className="mb-3">
                                    <Form.Label>Return Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={returnTime}
                                        onChange={(e) => setReturnTime(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Please provide a return time.</Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )}


                        {(orderType === 'rent' || orderType === 'both') && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Rent Items</Form.Label>
                                <Dropdown onToggle={(isOpen) => setShowSearch(isOpen)}>
                                    <Dropdown.Toggle variant="outline-primary" id="dropdown-rent">
                                        Rent Items
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        <InputGroup className={`p-2 ${showSearch ? '' : 'd-none'}`}>
                                            <FormControl
                                                placeholder="Search Rent Items"
                                                value={itemSearchQuery}
                                                onChange={(e) => setItemSearchQuery(e.target.value)}
                                            />
                                        </InputGroup>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredItems.length > 0 ? (
                                                itemOptions(filteredItems.filter(item => item.rentalRate), 'rent')
                                            ) : (
                                                <Dropdown.Item className="text-muted">No rent items found</Dropdown.Item>
                                            )}
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        )}

                        {(orderType === 'sale' || orderType === 'both') && (
                            <Form.Group className="mb-3">
                                <Form.Label>Select Sale Items</Form.Label>
                                <Dropdown onToggle={(isOpen) => setShowSearch(isOpen)}>
                                    <Dropdown.Toggle variant="outline-primary" id="dropdown-sale">
                                        Sale Items
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        <InputGroup className={`p-2 ${showSearch ? '' : 'd-none'}`}>
                                            <FormControl
                                                placeholder="Search Sale Items"
                                                value={itemSearchQuery}
                                                onChange={(e) => setItemSearchQuery(e.target.value)}
                                            />
                                        </InputGroup>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredItems.length > 0 ? (
                                                itemOptions(filteredItems.filter(item => item.saleRate), 'sale')
                                            ) : (
                                                <Dropdown.Item className="text-muted">No sale items found</Dropdown.Item>
                                            )}
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        )}



                        {selectedRentItems.length > 0 && (
                            <Card className="mb-4">
                                <Card.Header>Selected Rent Items</Card.Header>
                                <ListGroup variant="flush">
                                    {selectedRentItems.map(item => (
                                        <ListGroup.Item key={item._id}>
                                            <Row>
                                                <Col md={8}>{item.item_name}</Col>
                                                <Col md={2}>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.stock}
                                                        min={1}
                                                        max={items.find(i => i._id === item._id)?.stock || 1}
                                                        onChange={(e) => handleStockChange(e, item, 'rent')}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    <Button variant="danger" onClick={() => handleSelectChange(item, 'rent')}>Remove</Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        )}


                        {selectedSaleItems.length > 0 && (
                            <Card className="mb-4">
                                <Card.Header>Selected Sale Items</Card.Header>
                                <ListGroup variant="flush">
                                    {selectedSaleItems.map(item => (
                                        <ListGroup.Item key={item._id}>
                                            <Row>
                                                <Col md={8}>{item.item_name}</Col>
                                                <Col md={2}>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.stock}
                                                        min={1}
                                                        max={items.find(i => i._id === item._id)?.stock || 1}
                                                        onChange={(e) => handleStockChange(e, item, 'sale')}
                                                    />
                                                </Col>
                                                <Col md={2}>
                                                    <Button variant="danger" onClick={() => handleSelectChange(item, 'sale')}>Remove</Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        )}

                        {/* Order Summary */}
                        <Row className="mb-4">
                            <Col>
                                <h5>Total Rent Amount: ₹{totalRentAmount}</h5>
                            </Col>
                            <Col>
                                <h5>Total Sale Amount: ₹{totalSaleAmount}</h5>
                            </Col>
                            <Col>
                                <h5>Grand Total: ₹{grandTotal}</h5>
                            </Col>
                        </Row>

                        {/* Submit Button */}
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </Form>
                </div>
            </Card.Body>
        </Card>
    );
};

export default OrderForm;




