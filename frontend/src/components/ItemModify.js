// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';
// import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';

// const ItemsPage = () => {
//     const [items, setItems] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [editItem, setEditItem] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [filteredItems, setFilteredItems] = useState([]);

//     useEffect(() => {
//         api.get('/items')
//             .then(response => setItems(response.data))
//             .catch(error => console.error('Error fetching items:', error));
//     }, []);

//     useEffect(() => {
//         setFilteredItems(
//             items.filter(item =>
//                 item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//         );
//     }, [searchQuery, items]);

//     const handleEdit = (item) => {
//         setEditItem(item);
//         setShowModal(true);
//     };

//     const handleUpdate = () => {
//         const updatedItem = {
//             item_name: editItem.item_name,
//             rentalRate: editItem.rentalRate,
//             saleRate: editItem.saleRate,
//             stock: editItem.stock,
//         };

//         api.put(`/items/${editItem._id}`, updatedItem)
//             .then(response => {
//                 setItems(items.map(item => item._id === editItem._id ? response.data : item));
//                 setShowModal(false);
//                 setEditItem(null);
//             })
//             .catch(error => console.error('Error updating item:', error));
//     };

//     const handleDelete = (itemId) => {
//         api.delete(`/items/${itemId}`)
//             .then(() => {
//                 setItems(items.filter(item => item._id !== itemId));
//             })
//             .catch(error => console.error('Error deleting item:', error));
//     };

//     return (
//         <div className="container mt-4">
//             <h2>Manage Items</h2>

//             <Form.Group className="mb-3">
//                 <Form.Control
//                     type="text"
//                     placeholder="Search items..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//             </Form.Group>

//             {filteredItems.length > 0 ? (
//                 <Table striped bordered hover responsive>
//                     <thead>
//                         <tr>
//                             <th>Item Name</th>
//                             <th>Description</th>
//                             <th>Rental Rate</th>
//                             <th>Sale Rate</th>
//                             <th>stock</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredItems.map(item => (
//                             <tr key={item._id}>
//                                 <td>{item.item_name}</td>
//                                 <td>{item.description}</td>
//                                 <td>{item.rentalRate !== undefined ? `₹${item.rentalRate}` : '-'}</td>
//                                 <td>{item.saleRate !== undefined ? `₹${item.saleRate}` : '-'}</td>
//                                 <td>{item.stock}</td>
//                                 <td>
//                                     <Button variant="warning" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
//                                     <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             ) : (
//                 <Alert variant="warning">No items found.</Alert>
//             )}

//             <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Item</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {editItem && (
//                         <Form>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Item Name</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     value={editItem.item_name}
//                                     onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
//                                     required
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Description</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={editItem.description}
//                                     onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
//                                     required
//                                 />
//                             </Form.Group>

//                             {editItem.rentalRate !== undefined && (
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Rental Rate</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         value={editItem.rentalRate || ''}
//                                         onChange={(e) => setEditItem({ ...editItem, rentalRate: e.target.value })}
//                                     />
//                                 </Form.Group>
//                             )}
//                             {editItem.saleRate !== undefined && (
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Sale Rate</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         value={editItem.saleRate || ''}
//                                         onChange={(e) => setEditItem({ ...editItem, saleRate: e.target.value })}
//                                     />
//                                 </Form.Group>
//                             )}
//                             <Form.Group className="mb-3">
//                                 <Form.Label>stock</Form.Label>
//                                 <Form.Control
//                                     type="number"
//                                     value={editItem.stock}
//                                     onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
//                                     required
//                                 />
//                             </Form.Group>
//                         </Form>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//                     <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default ItemsPage;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';

const ItemsPage = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        api.get('/items')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    useEffect(() => {
        setFilteredItems(
            items.filter(item =>
                item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, items]);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    const handleUpdate = () => {
        const updatedItem = {
            item_name: editItem.item_name,
            description: editItem.description, // Ensure description is included
            rentalRate: editItem.rentalRate,
            saleRate: editItem.saleRate,
            stock: editItem.stock,
        };

        api.put(`/items/${editItem._id}`, updatedItem)
            .then(response => {
                setItems(items.map(item => item._id === editItem._id ? response.data : item));
                setShowModal(false);
                setEditItem(null);
            })
            .catch(error => console.error('Error updating item:', error));
    };

    const handleDelete = (itemId) => {
        api.delete(`/items/${itemId}`)
            .then(() => {
                setItems(items.filter(item => item._id !== itemId));
            })
            .catch(error => console.error('Error deleting item:', error));
    };

    return (
        <div className="container mt-4">
            <h2>Manage Items</h2>

            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form.Group>

            {filteredItems.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Rental Rate</th>
                            <th>Sale Rate</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item._id}>
                                <td>{item.item_name}</td>
                                <td>{item.description}</td>
                                <td>{item.rentalRate !== undefined ? `₹${item.rentalRate}` : '-'}</td>
                                <td>{item.saleRate !== undefined ? `₹${item.saleRate}` : '-'}</td>
                                <td>{item.stock}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="warning">No items found.</Alert>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editItem && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editItem.item_name}
                                    onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editItem.description}
                                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            {editItem.rentalRate !== undefined && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Rental Rate</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editItem.rentalRate || ''}
                                        onChange={(e) => setEditItem({ ...editItem, rentalRate: e.target.value })}
                                    />
                                </Form.Group>
                            )}
                            {editItem.saleRate !== undefined && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Sale Rate</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editItem.saleRate || ''}
                                        onChange={(e) => setEditItem({ ...editItem, saleRate: e.target.value })}
                                    />
                                </Form.Group>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label>stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editItem.stock}
                                    onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ItemsPage;
