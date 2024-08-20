import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { RentalContext } from '../context/RentalContext';

const RentalForm = () => {
    const [orderType, setOrderType] = useState('rent'); // Default order type is 'rent'
    const [rentalDate, setRentalDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalRentAmount, setTotalRentAmount] = useState(0);
    const [totalSaleAmount, setTotalSaleAmount] = useState(0);
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
        setSelectedItems(prevSelectedItems => {
            if (prevSelectedItems.includes(itemId)) {
                return prevSelectedItems.filter(id => id !== itemId);
            } else {
                return [...prevSelectedItems, itemId];
            }
        });
    };


    // const handleItemChange = (itemId) => {
    //     setSelectedItems(prevSelectedItems => {
    //         let updatedItems;
    //         if (prevSelectedItems.includes(itemId)) {
    //             updatedItems = prevSelectedItems.filter(id => id !== itemId);
    //         } else {
    //             updatedItems = [...prevSelectedItems, itemId];
    //         }

    //         // Calculate the total amounts based on selected items' rates
    //         const newTotalRentAmount = updatedItems.reduce((sum, id) => {
    //             const selectedItem = items.find(item => item._id === id);
    //             return sum + (selectedItem ? selectedItem.rentalRate : 0);
    //         }, 0);

    //         const newTotalSaleAmount = updatedItems.reduce((sum, id) => {
    //             const selectedItem = items.find(item => item._id === id);
    //             return sum + (selectedItem ? selectedItem.saleRate : 0);
    //         }, 0);

    //         setTotalRentAmount(newTotalRentAmount);
    //         setTotalSaleAmount(newTotalSaleAmount);

    //         return updatedItems;
    //     });
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();

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
                        description: item.description,
                        rentalRate: item.rentalRate,
                        saleRate: item.saleRate,
                    };
                } else {
                    console.error(`Item with ID ${itemId} not found in items array`);
                    return null;
                }
            }).filter(item => item !== null),
            rentalDate: orderType !== 'sale' ? rentalDate : null,
            returnDate: orderType !== 'sale' ? returnDate : null,
            totalAmount: orderType === 'rent' ? totalRentAmount : totalSaleAmount, // totalAmount based on order type
            orderType
        };

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
            setTotalRentAmount(0);
            setTotalSaleAmount(0);
        } catch (error) {
            console.error("Error creating rental:", error);
            if (error.response && error.response.data) {
                console.error("Server Response:", error.response.data);
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
    //                     description: item.description,
    //                     rentalRate: item.rentalRate,
    //                     saleRate: item.saleRate,
    //                 };
    //             } else {
    //                 console.error(`Item with ID ${itemId} not found in items array`);
    //                 return null;
    //             }
    //         }).filter(item => item !== null),
    //         rentalDate: orderType !== 'sale' ? rentalDate : null,
    //         returnDate: orderType !== 'sale' ? returnDate : null,
    //         totalRentAmount: orderType !== 'sale' ? totalRentAmount : 0,
    //         totalSaleAmount: orderType !== 'rent' ? totalSaleAmount : 0,
    //         orderType
    //     };

    //     console.log("Rental Object:", rental);

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
    //         setTotalRentAmount(0);
    //         setTotalSaleAmount(0);
    //     } catch (error) {
    //         console.error("Error creating rental:", error);
    //         if (error.response && error.response.data) {
    //             console.error("Server Response:", error.response.data);
    //         }
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
                            <label>Order Type</label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="orderType" id="rent" value="rent" checked={orderType === 'rent'} onChange={(e) => setOrderType(e.target.value)} />
                                <label className="form-check-label" htmlFor="rent">Rent only</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="orderType" id="sale" value="sale" checked={orderType === 'sale'} onChange={(e) => setOrderType(e.target.value)} />
                                <label className="form-check-label" htmlFor="sale">Sale only</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="orderType" id="rentAndSale" value="rentAndSale" checked={orderType === 'rentAndSale'} onChange={(e) => setOrderType(e.target.value)} />
                                <label className="form-check-label" htmlFor="rentAndSale">Rent and Sale</label>
                            </div>
                        </div>
                        {orderType !== 'sale' && (
                            <>
                                <div className="form-group mb-3">
                                    <label>Rental Date</label>
                                    <input type="date" className="form-control" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Return Date</label>
                                    <input type="date" className="form-control" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                                </div>
                            </>
                        )}
                        <div className="form-group mb-3">
                            <label>Select Category</label>
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
                                        <li key={item._id}>
                                            <button type="button" className={`dropdown-item ${selectedItems.includes(item._id) ? 'active' : ''}`} onClick={() => handleItemChange(item._id)}>
                                                {item.item_name} - {item.description} | Rent: ${item.rentalRate}/day | Sale: ${item.saleRate}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {orderType !== 'sale' && (
                            <div className="form-group mb-3">
                                <label>Total Rent Amount:</label>
                                <input type="text" className="form-control" value={totalRentAmount} readOnly />
                            </div>
                        )}
                        {orderType !== 'rent' && (
                            <div className="form-group mb-3">
                                <label>Total Sale Amount:</label>
                                <input type="text" className="form-control" value={totalSaleAmount} readOnly />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RentalForm;
