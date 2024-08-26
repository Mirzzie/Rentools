import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const RentalForm = () => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderType, setOrderType] = useState('rent');
    const [searchTerms, setSearchTerms] = useState({});
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [totalRentAmount, setTotalRentAmount] = useState(0);
    const [totalSaleAmount, setTotalSaleAmount] = useState(0);

    useEffect(() => {
        // Fetch categories and items from your API
        api.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));

        api.get('/items')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    useEffect(() => {
        const filtered = {};
        categories.forEach(cat => {
            filtered[cat._id] = items.filter(item =>
                item.category._id === cat._id &&
                (!searchTerms[cat._id] || item.item_name.toLowerCase().includes(searchTerms[cat._id].toLowerCase()))
            );
        });
        setFilteredItems(filtered);
    }, [categories, items, searchTerms]);

    const handleItemSelection = (itemId, checked, type) => {
        const item = items.find(i => i._id === itemId);

        if (checked) {
            setSelectedItems(prevItems => [...prevItems, { ...item, quantity: 1, type }]);
        } else {
            setSelectedItems(prevItems => prevItems.filter(i => i._id !== itemId || i.type !== type));
        }
    };

    const handleReturnDateChange = (e) => {
        const newReturnDate = e.target.value;
        const rentalDateTime = new Date();
        const newReturnDateTime = new Date(`${newReturnDate}T${returnTime}`);

        if (newReturnDate < rentalDateTime.toISOString().split('T')[0] || (newReturnDate === rentalDateTime.toISOString().split('T')[0] && newReturnDateTime < rentalDateTime)) {
            alert('Return date and time must be after rental date and time.');
        } else {
            setReturnDate(newReturnDate);
        }
    };

    const handleReturnTimeChange = (e) => {
        const newReturnTime = e.target.value;
        const rentalDateTime = new Date();
        const newReturnDateTime = new Date(`${returnDate}T${newReturnTime}`);

        if (returnDate && newReturnDateTime < rentalDateTime) {
            alert('Return date and time must be after rental date and time.');
        } else {
            setReturnTime(newReturnTime);
        }
    };

    const handleQuantityChange = (itemId, quantity, type) => {
        setSelectedItems(prevItems =>
            prevItems.map(i => (i._id === itemId && i.type === type ? { ...i, quantity: Number(quantity) } : i))
        );
    };

    useEffect(() => {
        const rentTotal = selectedItems.filter(i => i.type === 'rent').reduce((sum, item) =>
            sum + (item.rentalRate * item.quantity), 0);
        const saleTotal = selectedItems.filter(i => i.type === 'sale').reduce((sum, item) =>
            sum + (item.saleRate * item.quantity), 0);

        setTotalRentAmount(rentTotal);
        setTotalSaleAmount(saleTotal);
    }, [selectedItems]);

    const validateTimes = (rentalDate) => {
        if (rentalDate && returnDate) {
            const rentalDateTime = new Date(rentalDate);
            const returnDateTime = new Date(`${returnDate}T${returnTime}`);

            if (rentalDateTime > returnDateTime) {
                alert('Return date and time must be after rental date and time.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateTimes()) return;

        const rentalData = {
            name,
            phone,
            address,
            items: selectedItems.map(item => ({
                _id: item._id,
                quantity: item.quantity,
                type: item.type
            })),
            returnDate,
            returnTime,
            totalRentAmount,
            totalSaleAmount
        };

        api.post('/rentals', rentalData)
            .then(response => {
                alert('Rental record created successfully!');
                // Reset the form
                setName('');
                setPhone('');
                setAddress('');
                setSelectedItems([]); // Deselect all items
                setSearchTerms({}); // Reset search terms
                setReturnDate('');
                setReturnTime('');
                setTotalRentAmount(0);
                setTotalSaleAmount(0);
                setOrderType('rent');
            })
            .catch(error => console.error('Error creating rental record:', error));
    };

    return (
        <div className="container mt-4">
            <h2>Create Rental</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="orderType" className="form-label">Order Type</label>
                            <select
                                className="form-select"
                                id="orderType"
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                                required
                            >
                                <option value="rent">Rent only</option>
                                <option value="sale">Sale only</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Customer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea
                                className="form-control"
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        {(orderType === 'rent' || orderType === 'sale') && (
                            <>
                                {
                                    categories.map(cat => (
                                        <div key={cat._id} className="mb-4">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h5>{cat.category}</h5>
                                                </div>
                                                <div className="card-body">
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-secondary dropdown-toggle"
                                                            type="button"
                                                            id={`dropdown-${cat._id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            Select Items
                                                        </button>
                                                        <ul className="dropdown-menu p-2" aria-labelledby={`dropdown-${cat._id}`}>
                                                            <input
                                                                type="text"
                                                                className="form-control mb-2"
                                                                placeholder="Search items..."
                                                                value={searchTerms[cat._id] || ''}
                                                                onChange={(e) => setSearchTerms({
                                                                    ...searchTerms,
                                                                    [cat._id]: e.target.value
                                                                })}
                                                            />
                                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                                {filteredItems[cat._id] && filteredItems[cat._id].length > 0 ? (
                                                                    filteredItems[cat._id].map(item => (
                                                                        <li key={item._id} className="list-group-item">
                                                                            <div className="form-check">
                                                                                {orderType === 'rent' || orderType === 'both' ? (
                                                                                    <>
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            value={item._id}
                                                                                            id={`rent-item-${item._id}`}
                                                                                            onChange={(e) => handleItemSelection(item._id, e.target.checked, 'rent')}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor={`rent-item-${item._id}`}>
                                                                                            Rent: {item.item_name} ({item.description})
                                                                                        </label>
                                                                                    </>
                                                                                ) : null}
                                                                                {orderType === 'sale' || orderType === 'both' ? (
                                                                                    <>
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            value={item._id}
                                                                                            id={`sale-item-${item._id}`}
                                                                                            onChange={(e) => handleItemSelection(item._id, e.target.checked, 'sale')}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor={`sale-item-${item._id}`}>
                                                                                            Sale: {item.item_name} ({item.description})
                                                                                        </label>
                                                                                    </>
                                                                                ) : null}
                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li className="list-group-item">No items found.</li>
                                                                )}
                                                            </div>
                                                        </ul>
                                                    </div>

                                                    {selectedItems.filter(i => i.category && i.category._id === cat._id).map(item => (
                                                        <div key={item._id} className="mt-3">
                                                            <label className="form-label">{item.item_name}</label>
                                                            {item.type === 'rent' && (
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleQuantityChange(item._id, e.target.value, 'rent')}
                                                                />
                                                            )}
                                                            {item.type === 'sale' && (
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleQuantityChange(item._id, e.target.value, 'sale')}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        )}

                        {orderType === 'both' && (
                            <>
                                <div className="mb-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Rental Items</h5>
                                        </div>
                                        <div className="card-body">
                                            {categories.map(cat => (
                                                <div key={cat._id} className="mb-4">
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-secondary dropdown-toggle"
                                                            type="button"
                                                            id={`dropdown-rent-${cat._id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            {cat.category}
                                                        </button>

                                                        <ul className="dropdown-menu p-2" aria-labelledby={`dropdown-${cat._id}`}>
                                                            <input
                                                                type="text"
                                                                className="form-control mb-2"
                                                                placeholder="Search items..."
                                                                value={searchTerms[cat._id] || ''}
                                                                onChange={(e) => setSearchTerms({
                                                                    ...searchTerms,
                                                                    [cat._id]: e.target.value
                                                                })}
                                                            />
                                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                                {filteredItems[cat._id] && filteredItems[cat._id].length > 0 ? (
                                                                    filteredItems[cat._id].map(item => (
                                                                        <li key={item._id} className="list-group-item">
                                                                            <div className="form-check">
                                                                                {orderType === 'rent' || orderType === 'both' ? (
                                                                                    <>
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            value={item._id}
                                                                                            id={`rent-item-${item._id}`}
                                                                                            onChange={(e) => handleItemSelection(item._id, e.target.checked, 'rent')}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor={`rent-item-${item._id}`}>
                                                                                            Rent: {item.item_name} ({item.description})
                                                                                        </label>
                                                                                    </>
                                                                                ) : null}
                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li className="list-group-item">No items found.</li>
                                                                )}
                                                            </div>
                                                        </ul>
                                                    </div>

                                                    {selectedItems.filter(i => i.type === 'rent' && i.category._id === cat._id).map(item => (
                                                        <div key={item._id} className="mt-3">
                                                            <label className="form-label">{item.item_name}</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(item._id, e.target.value, 'rent')}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5>Sale Items</h5>
                                        </div>
                                        <div className="card-body">
                                            {categories.map(cat => (
                                                <div key={cat._id} className="mb-4">
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-secondary dropdown-toggle"
                                                            type="button"
                                                            id={`dropdown-sale-${cat._id}`}
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            {cat.category}
                                                        </button>
                                                        <ul className="dropdown-menu p-2" aria-labelledby={`dropdown-${cat._id}`}>
                                                            <input
                                                                type="text"
                                                                className="form-control mb-2"
                                                                placeholder="Search items..."
                                                                value={searchTerms[cat._id] || ''}
                                                                onChange={(e) => setSearchTerms({
                                                                    ...searchTerms,
                                                                    [cat._id]: e.target.value
                                                                })}
                                                            />
                                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                                {filteredItems[cat._id] && filteredItems[cat._id].length > 0 ? (
                                                                    filteredItems[cat._id].map(item => (
                                                                        <li key={item._id} className="list-group-item">
                                                                            <div className="form-check">
                                                                                {orderType === 'sale' || orderType === 'both' ? (
                                                                                    <>
                                                                                        <input
                                                                                            className="form-check-input"
                                                                                            type="checkbox"
                                                                                            value={item._id}
                                                                                            id={`sale-item-${item._id}`}
                                                                                            onChange={(e) => handleItemSelection(item._id, e.target.checked, 'sale')}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor={`sale-item-${item._id}`}>
                                                                                            Sale: {item.item_name} ({item.description})
                                                                                        </label>
                                                                                    </>
                                                                                ) : null}

                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li className="list-group-item">No items found.</li>
                                                                )}
                                                            </div>
                                                        </ul>
                                                    </div>

                                                    {selectedItems.filter(i => i.type === 'sale' && i.category._id === cat._id).map(item => (
                                                        <div key={item._id} className="mt-3">
                                                            <label className="form-label">{item.item_name}</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(item._id, e.target.value, 'sale')}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {(orderType === 'rent' || orderType === 'both') && (
                            <div className="mb-3">
                                <label htmlFor="returnDate" className="form-label">Return Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="returnDate"
                                    value={returnDate}
                                    onChange={handleReturnDateChange}
                                    required
                                />
                            </div>
                        )}

                        {(orderType === 'rent' || orderType === 'both') && (
                            <div className="mb-3">
                                <label htmlFor="returnTime" className="form-label">Return Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="returnTime"
                                    value={returnTime}
                                    onChange={handleReturnTimeChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            {orderType === 'rent' || orderType === 'both' ? (
                                <>
                                    <label className="form-label">Total Rent Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={totalRentAmount}
                                        readOnly
                                    />
                                </>
                            ) : null}
                            {orderType === 'sale' || orderType === 'both' ? (
                                <>
                                    <label className="form-label">Total Sale Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={totalSaleAmount}
                                        readOnly
                                    />
                                </>
                            ) : null}
                        </div>

                        <button type="submit" className="btn btn-primary">Create Rental</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RentalForm;
