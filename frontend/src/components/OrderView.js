import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

const OrderView = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);

    const acknowledgeReturn = async (orderId, itemId) => {
        try {
            const response = await api.post(`/order/acknowledge-item-return/${orderId}/${itemId}`);
            if (response.data.allItemsReturned) {
                setOrders(orders.filter(order => order._id !== orderId));
            } else {
                const updatedOrders = orders.map(order => {
                    if (order._id === orderId) {
                        return {
                            ...order,
                            rentItems: order.rentItems.filter(item => item._id._id !== itemId)
                        };
                    }
                    return order;
                });
                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Error acknowledging return', error);
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Order View</h2>
            {orders.map(order => (
                <Card className="mb-3" key={order._id}>
                    <Card.Header>
                        <h5>{order.name}</h5>
                        <p className="mb-0"><strong>Phone:</strong> {order.phone}</p>
                        <p className="mb-0"><strong>Address:</strong> {order.address}</p>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <h6>Rent Items</h6>
                                {order.rentItems.length > 0 ? (
                                    order.rentItems.map(item => (
                                        <div key={item._id._id}>
                                            <p className="mb-0">{item._id.item_name} (Qty: {item.stock})</p>
                                            <p className="text-muted small">Rental Rate: ₹{item._id.rentalRate}</p>
                                            <Button
                                                variant="success"
                                                onClick={() => acknowledgeReturn(order._id, item._id._id)}
                                            >
                                                Acknowledge Return
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No rent items.</p>
                                )}
                            </Col>
                            <Col md={6}>
                                <h6>Sale Items</h6>
                                {order.saleItems.length > 0 ? (
                                    order.saleItems.map(item => (
                                        <div key={item._id._id}>
                                            <p className="mb-0">{item._id.item_name} (Qty: {item.stock})</p>
                                            <p className="text-muted small">Sale Rate: ₹{item._id.saleRate}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No sale items.</p>
                                )}
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col md={6}>
                                <p><strong>Total Rent Amount:</strong> ₹{order.totalRentAmount}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Total Sale Amount:</strong> ₹{order.totalSaleAmount}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <p><strong>Overdue Charges:</strong> ₹{order.overdueCharges}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default OrderView;

