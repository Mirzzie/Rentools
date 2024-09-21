import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Form, Button, Dropdown, Card, InputGroup, FormControl, Row, Col, Badge } from 'react-bootstrap';

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
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        api.get('/items')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    useEffect(() => {
        setTotalRentAmount(selectedRentItems.reduce((total, item) => total + (item.rentalRate * item.stock), 0));
        setTotalSaleAmount(selectedSaleItems.reduce((total, item) => total + (item.saleRate * item.stock), 0));
    }, [selectedRentItems, selectedSaleItems]);

    const handleOrderTypeChange = (e) => {
        setOrderType(e.target.value);
        setSelectedRentItems([]);
        setSelectedSaleItems([]);
    };

    const handleSelectChange = (item, type) => {
        const updatedItems = type === 'rent' ? selectedRentItems : selectedSaleItems;
        const isSelected = updatedItems.some(i => i._id === item._id);

        if (isSelected) {
            const newItems = updatedItems.filter(i => i._id !== item._id);
            type === 'rent' ? setSelectedRentItems(newItems) : setSelectedSaleItems(newItems);
        } else {
            const newItem = { ...item, stock: 1 };
            type === 'rent' ? setSelectedRentItems([...updatedItems, newItem]) : setSelectedSaleItems([...updatedItems, newItem]);
        }
    };

    const handleStockChange = (e, item, type) => {
        const newStock = parseInt(e.target.value, 10) || 1;
        const updatedItems = type === 'rent' ? selectedRentItems : selectedSaleItems;
        const availableStock = items.find(i => i._id === item._id)?.stock || 1;

        const adjustedStock = Math.min(Math.max(newStock, 1), availableStock);

        const newItems = updatedItems.map(i =>
            i._id === item._id ? { ...i, stock: adjustedStock } : i
        );

        type === 'rent' ? setSelectedRentItems(newItems) : setSelectedSaleItems(newItems);
    };

    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(itemSearchQuery.toLowerCase()) &&
        (orderType === 'rent' ? item.rentalRate : orderType === 'sale' ? item.saleRate : true)
    );

    const itemOptions = (items) => {
        return items.map(item => (
            <Dropdown.Item
                key={item._id}
                as="button"
                onClick={() => handleSelectChange(item, item.rentalRate ? 'rent' : 'sale')}
                className={`d-flex align-items-center ${item.stock === 0 ? 'text-muted' : ''}`}
                disabled={item.stock === 0}
            >
                <strong>{item.item_name} {item.stock === 0 && <Badge bg="danger">Out of Stock</Badge>}</strong>
                <small className="text-muted ms-2">{item.description}</small>
                <Badge bg="info" className="ms-2">
                    {item.rentalRate ? `₹${item.rentalRate}/day` : `₹${item.saleRate}`}
                </Badge>
                <Badge bg="secondary" className="ms-2">Available Stock: {item.stock}</Badge>
            </Dropdown.Item>
        ));
    };

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
            rentItems: selectedRentItems.map(item => ({
                _id: item._id,
                stock: item.stock,
                returnTime: returnTime || ''
            })),
            saleItems: selectedSaleItems.map(item => ({ _id: item._id, stock: item.stock })),
            orderDate: new Date().toISOString().split('T')[0],
            returnDate,
            totalRentAmount,
            totalSaleAmount
        };

        api.post('/orders', orderData)
            .then(response => {
                alert('Order created successfully!');
                resetForm();
                refreshItems();
            })
            .catch(error => console.error('Error creating order:', error))
            .finally(() => setLoading(false));
    };

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

    const refreshItems = () => {
        api.get('/items')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
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

                        {orderType !== 'sale' && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Return Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        required={orderType !== 'sale'}
                                        min={new Date().toISOString().split('T')[0]} // Set min to today's date
                                    />
                                    <Form.Control.Feedback type="invalid">Please provide a return date.</Form.Control.Feedback>

                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Return Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={returnTime}
                                        onChange={(e) => setReturnTime(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group className="mb-4">
                            <Form.Label>Search Items</Form.Label>
                            <InputGroup>
                                <Dropdown show={dropdownOpen} onToggle={(nextShow) => setDropdownOpen(nextShow)}>
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                        Select Items
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <Dropdown.ItemText>
                                            <FormControl
                                                placeholder="Search items..."
                                                value={itemSearchQuery}
                                                onChange={(e) => setItemSearchQuery(e.target.value)}
                                            />
                                        </Dropdown.ItemText>
                                        {itemOptions(filteredItems)}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </InputGroup>
                        </Form.Group>

                        <Row className="g-3">
                            <Col md={orderType === 'both' ? 6 : 12}> {/* Adjusts column size based on order type */}
                                {(orderType === 'both' || orderType === 'rent') && selectedRentItems.length > 0 ? (
                                    <>
                                        <h5>{orderType === 'rent' ? 'Selected Rent Items' : 'Selected Items for Rent'}</h5>
                                        {selectedRentItems.map(item => (
                                            <Card key={item._id} className="mb-3">
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <div className="me-2">
                                                        <strong>{item.item_name}</strong>
                                                        <div className="text-muted">{item.description}</div>
                                                        <Badge bg="info" className="me-1">{`₹${item.rentalRate}/day`}</Badge>
                                                        <InputGroup className="mt-2" style={{ width: '100px' }}>
                                                            <FormControl
                                                                type="number"
                                                                value={item.stock}
                                                                onChange={(e) => handleStockChange(e, item, 'rent')}
                                                                min="1"
                                                                max={items.find(i => i._id === item._id)?.stock || 1}
                                                            />
                                                        </InputGroup>
                                                    </div>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleSelectChange(item, 'rent')}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </>
                                ) : (
                                    orderType === 'both' && <p>No rent items selected.</p>
                                )}
                            </Col>
                            <Col md={orderType === 'both' ? 6 : 12}> {/* Adjusts column size based on order type */}
                                {(orderType === 'both' || orderType === 'sale') && selectedSaleItems.length > 0 ? (
                                    <>
                                        <h5>{orderType === 'sale' ? 'Selected Sale Items' : 'Selected Items for Sale'}</h5>
                                        {selectedSaleItems.map(item => (
                                            <Card key={item._id} className="mb-3">
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <div className="me-2">
                                                        <strong>{item.item_name}</strong>
                                                        <div className="text-muted">{item.description}</div>
                                                        <Badge bg="info" className="me-1">{`₹${item.saleRate}`}</Badge>
                                                        <InputGroup className="mt-2" style={{ width: '100px' }}>
                                                            <FormControl
                                                                type="number"
                                                                value={item.stock}
                                                                onChange={(e) => handleStockChange(e, item, 'sale')}
                                                                min="1"
                                                                max={items.find(i => i._id === item._id)?.stock || 1}
                                                            />
                                                        </InputGroup>
                                                    </div>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleSelectChange(item, 'sale')}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </>
                                ) : (
                                    orderType === 'both' && <p>No sale items selected.</p>
                                )}
                            </Col>
                        </Row>

                        <hr />

                        <h5>Total Rent Amount: ₹{totalRentAmount}</h5>
                        <h5>Total Sale Amount: ₹{totalSaleAmount}</h5>
                        <h4>Grand Total: ₹{grandTotal}</h4>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Order'}
                        </Button>
                    </Form>
                </div>
            </Card.Body>
        </Card>
    );
};

export default OrderForm;

