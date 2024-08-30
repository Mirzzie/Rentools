import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Form, Button, Dropdown, Card, InputGroup, FormControl, Alert, Row, Col, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';

const RentalForm = () => {
    const [items, setItems] = useState([]);
    const [selectedRentItems, setSelectedRentItems] = useState([]);
    const [selectedSaleItems, setSelectedSaleItems] = useState([]);
    const [orderType, setOrderType] = useState('rent');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [returnDateTime, setReturnDateTime] = useState('');
    const [totalRentAmount, setTotalRentAmount] = useState(0);
    const [totalSaleAmount, setTotalSaleAmount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [validated, setValidated] = useState(false);

    useEffect(() => {
        api.get('/items')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    useEffect(() => {
        if (orderType === 'rent' || orderType === 'both') {
            setTotalRentAmount(selectedRentItems.reduce((total, item) => total + (item.rentalRate * item.stock), 0));
        } else {
            setTotalRentAmount(0);
        }

        if (orderType === 'sale' || orderType === 'both') {
            setTotalSaleAmount(selectedSaleItems.reduce((total, item) => total + (item.saleRate * item.stock), 0));
        } else {
            setTotalSaleAmount(0);
        }
    }, [selectedRentItems, selectedSaleItems, orderType]);

    const handleOrderTypeChange = (e) => {
        setOrderType(e.target.value);
        setSelectedRentItems([]);
        setSelectedSaleItems([]);
    };

    const handleSelectChange = (item, type) => {
        const updatedItems = type === 'rent'
            ? selectedRentItems
            : selectedSaleItems;

        const isSelected = updatedItems.some(i => i._id === item._id);
        if (isSelected) {
            const newItems = updatedItems.filter(i => i._id !== item._id);
            type === 'rent' ? setSelectedRentItems(newItems) : setSelectedSaleItems(newItems);
        } else {
            const newItem = { ...item, stock: 1 }; // Default stock to 1
            type === 'rent' ? setSelectedRentItems([...updatedItems, newItem]) : setSelectedSaleItems([...updatedItems, newItem]);
        }
    };

    const handlestockChange = (e, item, type) => {
        const newstock = parseInt(e.target.value, 10) || 1;
        const updatedItems = type === 'rent' ? selectedRentItems : selectedSaleItems;
        const newItems = updatedItems.map(i => i._id === item._id ? { ...i, stock: newstock } : i);

        type === 'rent' ? setSelectedRentItems(newItems) : setSelectedSaleItems(newItems);
    };

    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Select the order type to see the relevant items.
        </Tooltip>
    );

    const itemOptions = (items, isRent) =>
        items.map(item => (
            <Dropdown.Item
                key={item._id}
                as="button"
                onClick={() => handleSelectChange(item, isRent ? 'rent' : 'sale')}
                className="d-flex align-items-center"
            >
                <input
                    type="checkbox"
                    checked={isRent
                        ? selectedRentItems.some(i => i._id === item._id)
                        : selectedSaleItems.some(i => i._id === item._id)}
                    readOnly
                    className="me-2"
                />
                <div className="flex-grow-1">
                    <strong>{item.item_name}</strong><br />
                    <small className="text-muted">{item.description}</small><br />
                    <Badge bg="info">{isRent ? `₹${item.rentalRate}/day` : `₹${item.saleRate}`}</Badge>
                </div>
            </Dropdown.Item>
        ));

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

        const rentalData = {
            name,
            phone,
            address,
            rentalItems: selectedRentItems.map(item => ({ _id: item._id, stock: item.stock })),
            saleItems: selectedSaleItems.map(item => ({ _id: item._id, stock: item.stock })),
            returnDate: returnDateTime.split('T')[0],
            returnTime: returnDateTime.split('T')[1],
            totalRentAmount,
            totalSaleAmount
        };

        api.post('/rentals', rentalData)
            .then(response => {
                alert('Rental created successfully!');
                setName('');
                setPhone('');
                setAddress('');
                setOrderType('rent');
                setSelectedRentItems([]);
                setSelectedSaleItems([]);
                setReturnDateTime('');
                setValidated(false);
            })
            .catch(error => console.error('Error creating rental:', error));
    };

    const grandTotal = totalRentAmount + totalSaleAmount;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Create Rental</h2>
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
                            <Form.Control.Feedback type="invalid">
                                Please provide a name.
                            </Form.Control.Feedback>
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
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid 10-digit phone number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide an address.
                    </Form.Control.Feedback>
                </Form.Group>

                <OverlayTrigger placement="right" overlay={renderTooltip}>
                    <Form.Group className="mb-4">
                        <Form.Label>Order Type</Form.Label>
                        <Form.Select
                            value={orderType}
                            onChange={handleOrderTypeChange}
                            required
                        >
                            <option value="rent">Rent Only</option>
                            <option value="sale">Sale Only</option>
                            <option value="both">Rent and Sale</option>
                        </Form.Select>
                    </Form.Group>
                </OverlayTrigger>

                {(orderType === 'rent' || orderType === 'both') && (
                    <Form.Group className="mb-4">
                        <Form.Label>Rent Items</Form.Label>
                        {items.length > 0 ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Select Rent Items
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </InputGroup>
                                    {itemOptions(filteredItems.filter(item => item.rentalRate), true)}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Alert variant="warning">No items found.</Alert>
                        )}
                        {selectedRentItems.length > 0 && (
                            <Card className="mt-3">
                                <Card.Header>Selected Rent Items</Card.Header>
                                <Card.Body>
                                    {selectedRentItems.map((item, index) => (
                                        <div key={item._id} className="d-flex align-items-center mb-3">
                                            <div className="flex-grow-1">
                                                <strong>{item.item_name}</strong><br />
                                                <small className="text-muted">{item.description}</small><br />
                                                <Badge bg="info">₹{item.rentalRate}/day</Badge>
                                            </div>
                                            <InputGroup className="ms-3" style={{ width: '150px' }}>
                                                <InputGroup.Text>Qty</InputGroup.Text>
                                                <FormControl
                                                    type="number"
                                                    min="1"
                                                    value={item.stock}
                                                    onChange={(e) => handlestockChange(e, item, 'rent')}
                                                    required
                                                />
                                            </InputGroup>
                                            <Button
                                                variant="danger"
                                                className="ms-3"
                                                onClick={() => handleSelectChange(item, 'rent')}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </Card.Body>
                                <Card.Footer>
                                    <strong>Total Rent Amount: ₹{totalRentAmount}</strong>
                                </Card.Footer>
                            </Card>
                        )}
                    </Form.Group>
                )}

                {(orderType === 'sale' || orderType === 'both') && (
                    <Form.Group className="mb-4">
                        <Form.Label>Sale Items</Form.Label>
                        {items.length > 0 ? (
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Select Sale Items
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </InputGroup>
                                    {itemOptions(filteredItems.filter(item => item.saleRate), false)}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Alert variant="warning">No items found.</Alert>
                        )}
                        {selectedSaleItems.length > 0 && (
                            <Card className="mt-3">
                                <Card.Header>Selected Sale Items</Card.Header>
                                <Card.Body>
                                    {selectedSaleItems.map((item, index) => (
                                        <div key={item._id} className="d-flex align-items-center mb-3">
                                            <div className="flex-grow-1">
                                                <strong>{item.item_name}</strong><br />
                                                <small className="text-muted">{item.description}</small><br />
                                                <Badge bg="info">₹{item.saleRate}</Badge>
                                            </div>
                                            <InputGroup className="ms-3" style={{ width: '150px' }}>
                                                <InputGroup.Text>Qty</InputGroup.Text>
                                                <FormControl
                                                    type="number"
                                                    min="1"
                                                    value={item.stock}
                                                    onChange={(e) => handlestockChange(e, item, 'sale')}
                                                    required
                                                />
                                            </InputGroup>
                                            <Button
                                                variant="danger"
                                                className="ms-3"
                                                onClick={() => handleSelectChange(item, 'sale')}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </Card.Body>
                                <Card.Footer>
                                    <strong>Total Sale Amount: ₹{totalSaleAmount}</strong>
                                </Card.Footer>
                            </Card>
                        )}
                    </Form.Group>
                )}

                {(orderType === 'rent' || orderType === 'both') && (
                    <Form.Group className="mb-3">
                        <Form.Label>Return Date and Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={returnDateTime}
                            onChange={(e) => setReturnDateTime(e.target.value)}
                            required={orderType !== 'sale'}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid return date and time.
                        </Form.Control.Feedback>
                    </Form.Group>
                )}

                <Card className="mt-4">
                    <Card.Header>Summary</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>
                                <strong>Total Rent Amount: </strong>₹{totalRentAmount}
                            </Col>
                            <Col>
                                <strong>Total Sale Amount: </strong>₹{totalSaleAmount}
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <h5>
                            <strong>Grand Total: ₹{grandTotal}</strong>
                        </h5>
                    </Card.Footer>
                </Card>

                <Button variant="primary" type="submit" className="mt-4">
                    Create Rental
                </Button>
            </Form>
        </div>
    );
};

export default RentalForm;

