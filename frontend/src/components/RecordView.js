import React, { useEffect, useState } from 'react';
import api from "../utils/api";
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecordView = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
    const [filterTime, setFilterTime] = useState('');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filteredRecords, setFilteredRecords] = useState([]);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await api.get('/records');
            setRecords(response.data);
            setFilteredRecords(response.data.filter(record => {
                const recordDate = new Date(record.orderDate);
                return recordDate.toDateString() === new Date().toDateString();
            }));
        } catch (error) {
            console.error('Error fetching records:', error);
            toast.error('Error fetching records');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('Deleting record with ID:', id);
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await api.delete(`/records/${id}`);
                setRecords(records.filter(record => record._id !== id));
                setFilteredRecords(filteredRecords.filter(record => record._id !== id)); // Update filtered records
                toast.success('Record deleted successfully!');
            } catch (error) {
                console.error('Error deleting record:', error);
                toast.error('Error deleting record');
            }
        }
    };

    const handleFilter = () => {
        const filtered = records.filter(record => {
            const recordDate = new Date(record.orderDate);
            const yearMatch = recordDate.getFullYear() === parseInt(filterYear, 10);
            const dateMatch = recordDate.toISOString().slice(0, 10) === filterDate;
            const timeMatch = filterTime ? recordDate.toTimeString().startsWith(filterTime) : true;

            return yearMatch && dateMatch && timeMatch;
        });
        setFilteredRecords(filtered);
    };

    return (
        <Container>
            <h2>Records</h2>
            <ToastContainer />
            <Form inline className="mb-3">
                <Form.Group controlId="filterDate">
                    <Form.Label className="mr-2">Date:</Form.Label>
                    <Form.Control
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="filterYear">
                    <Form.Label className="mr-2">Year:</Form.Label>
                    <Form.Control
                        type="number"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                    />
                </Form.Group>
                <Form.Group controlId="filterTime">
                    <Form.Label className="mr-2">Time (optional):</Form.Label>
                    <Form.Control
                        type="time"
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                    />
                </Form.Group>
                <Button onClick={handleFilter}>Filter</Button>
            </Form>

            {loading ? (
                <p>Loading records...</p>
            ) : filteredRecords.length === 0 ? (
                <p>No records available</p>
            ) : (
                <Row>
                    {filteredRecords.map((record) => (
                        <Col key={record._id} md={6} lg={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>{record.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Phone:</strong> {record.phone}<br />
                                        <strong>Address:</strong> {record.address}<br />
                                        <strong>Order Date:</strong> {new Date(record.orderDate).toLocaleDateString()}<br />
                                        {record.returnDate && (
                                            <>
                                                <strong>Return Date:</strong> {new Date(record.returnDate).toLocaleDateString()}<br />
                                            </>
                                        )}
                                        <strong>Rent Amount:</strong> {record.totalRentAmount}<br />
                                        <strong>Sale Amount:</strong> {record.totalSaleAmount}<br />
                                    </Card.Text>
                                    <Card.Subtitle className="mb-2 text-muted">Rent Items</Card.Subtitle>
                                    {record.rentItems.length > 0 ? (
                                        <ul>
                                            {record.rentItems.map((item) => (
                                                <li key={item._id}>
                                                    {item.item_name} (Quantity: {item.stock})<br />
                                                    <small>{item.description}</small> {/* Display item description */}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No rent items</p>
                                    )}
                                    <Card.Subtitle className="mb-2 text-muted">Sale Items</Card.Subtitle>
                                    {record.saleItems.length > 0 ? (
                                        <ul>
                                            {record.saleItems.map((item) => (
                                                <li key={item._id}>
                                                    {item.item_name} (Quantity: {item.stock})<br />
                                                    <small>{item.description}</small> {/* Display item description */}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No sale items</p>
                                    )}
                                    <Button variant="danger" onClick={() => handleDelete(record._id)}>
                                        Delete Record
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default RecordView;
