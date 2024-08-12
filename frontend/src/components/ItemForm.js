import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ItemForm = () => {
    const [item_name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [spec, setSpec] = useState('');
    const [specvalue, setSpecvalue] = useState('');
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [rentalRate, setRentalRate] = useState(0);
    const [available, setAvailable] = useState(true);
    const [categories, setCategories] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newItem = {
                item_name,
                category,
                spec,
                specvalue,
                unit,
                quantity,
                rentalRate,
                available,
            };

            await api.post('/items', newItem); // API endpoint to create a new item
            alert('Item created successfully');
            // Reset the form fields
            setName('');
            setCategory('');
            setSpec('');
            setSpecvalue('');
            setUnit('');
            setQuantity(0);
            setRentalRate(0);
            setAvailable(true);
        } catch (error) {
            console.error("Error creating item:", error);
            alert('Error creating item');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    Create Item
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Name</label>
                            <input type="text" className="form-control" value={item_name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Category</label>
                            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="" disabled>Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label>Specification</label>
                            <input type="text" className="form-control" value={spec} onChange={(e) => setSpec(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Specification Value</label>
                            <input type="text" className="form-control" value={specvalue} onChange={(e) => setSpecvalue(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Unit</label>
                            <input type="text" className="form-control" value={unit} onChange={(e) => setUnit(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Quantity</label>
                            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Rental Rate</label>
                            <input type="number" className="form-control" value={rentalRate} onChange={(e) => setRentalRate(Number(e.target.value))} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Available</label>
                            <select className="form-control" value={available} onChange={(e) => setAvailable(e.target.value === 'true')} required>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Create Item</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItemForm;
