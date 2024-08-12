import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { RentalContext } from '../context/RentalContext';

const RentalForm = () => {
    const [rentalDate, setRentalDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0); // Initialize totalAmount to 0
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const { createRental } = useContext(RentalContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                alert('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchItems = async () => {
                try {
                    const response = await api.get(`/items/category/${selectedCategory}`);
                    setItems(response.data);
                } catch (error) {
                    console.error("Error fetching items:", error);
                    alert('Error fetching items');
                }
            };

            fetchItems();
        }
    }, [selectedCategory]);

    const handleItemChange = (itemId) => {
        console.log('Item ID:', itemId); // Log the item ID
        setSelectedItems(prevSelectedItems => {
            let updatedItems;
            if (prevSelectedItems.includes(itemId)) {
                console.log('Removing item:', itemId); // Log removing item
                updatedItems = prevSelectedItems.filter(id => id !== itemId);
            } else {
                console.log('Adding item:', itemId); // Log adding item
                updatedItems = [...prevSelectedItems, itemId];
            }

            // Calculate the total amount based on selected items' rental rates
            const newTotalAmount = updatedItems.reduce((sum, id) => {
                const selectedItem = items.find(item => item._id === id);
                return sum + (selectedItem ? selectedItem.rentalRate : 0);
            }, 0);

            setTotalAmount(newTotalAmount); // Update totalAmount state
            return updatedItems;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log the rental object to inspect it before sending the request
        const rental = {
            name,
            phone,
            address,
            items: selectedItems.map(itemId => {
                const item = items.find(item => item._id === itemId);
                if (item) {
                    return {
                        item_name: item.item_name,
                        quantity: item.quantity,
                        spec: item.spec,
                        specvalue: item.specvalue,
                        unit: item.unit,
                        rentalRate: item.rentalRate
                    };
                } else {
                    console.error(`Item with ID ${itemId} not found in items array`);
                    return null;
                }
            }).filter(item => item !== null),  // Filter out any null items
            rentalDate,
            returnDate,
            totalAmount
        };

        console.log("Rental Object:", rental); // Log the rental object

        try {
            await createRental(rental);
            alert('Rental created successfully');
            // Reset form fields
            setName('');
            setPhone('');
            setEmail('');
            setAddress('');
            setRentalDate('');
            setReturnDate('');
            setSelectedCategory('');
            setSelectedItems([]);
            setTotalAmount(0); // Reset totalAmount to 0
        } catch (error) {
            console.error("Error creating rental:", error);
            if (error.response && error.response.data) {
                console.error("Server Response:", error.response.data); // Log the server response
            }
            alert('Error creating rental');
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const rental = {
    //         name,
    //         phone,
    //         address,
    //         items: selectedItems.map(itemId => {
    //             const item = items.find(item => item._id === itemId);
    //             if (item) {
    //                 return {
    //                     item_name: item.item_name,
    //                     quantity: item.quantity,
    //                     spec: item.spec,
    //                     specvalue: item.specvalue,
    //                     unit: item.unit,
    //                     rentalRate: item.rentalRate
    //                 };
    //             } else {
    //                 console.error(`Item with ID ${itemId} not found in items array`);
    //                 return null;
    //             }
    //         }).filter(item => item !== null),  // Filter out any null items
    //         rentalDate,
    //         returnDate,
    //         totalAmount
    //     };
    //     try {
    //         await createRental(rental);
    //         alert('Rental created successfully');
    //         // Reset form fields
    //         setName('');
    //         setPhone('');
    //         setEmail('');
    //         setAddress('');
    //         setRentalDate('');
    //         setReturnDate('');
    //         setSelectedCategory('');
    //         setSelectedItems([]);
    //         setTotalAmount(0); // Reset totalAmount to 0
    //     } catch (error) {
    //         console.error("Error creating rental:", error);
    //         alert('Error creating rental');
    //     }
    // };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    Rental
                </div>
                <div className="card-body">
                    <form className="form-group mb-3" onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Name</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Phone</label>
                            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Address</label>
                            <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>Rental Date</label>
                            <input type="date" className="form-control" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Return Date</label>
                            <input type="date" className="form-control" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <select className="form-control mb-3" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                                <option value="" disabled>Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label>Select Items</label>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    Select Items
                                </button>
                                <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {Array.isArray(items) && items.map(item => (
                                        <li key={item._id} className="dropdown-item">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item._id}
                                                    id={`item-${item._id}`}
                                                    onChange={() => handleItemChange(item._id)}
                                                />
                                                <label className="form-check-label" htmlFor={`item-${item._id}`}>
                                                    {item.item_name} ({item.spec} - {item.specvalue} {item.unit})
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label>Total Rent Amount</label>
                            <input
                                className="form-control"
                                type="number"
                                value={totalAmount}
                                readOnly
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">Create Rental</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RentalForm;
