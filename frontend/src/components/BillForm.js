import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../utils/api';

const BillForm = () => {
    // const [customerId, setCustomerId] = useState('');
    const [rentalId, setRentalId] = useState('');
    const [amount, setAmount] = useState('');

    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const rentalsResponse = await api.get('/rentals');
            setRentals(rentalsResponse.data);
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bills', { rentalId, amount });
            alert('Bill created successfully');
        } catch (error) {
            console.error(error);
            alert('Error creating bill');
        }
    };

    return (

        <div className="container mt-4">

            <div class="card">
                <div class="card-header">
                    Bill
                </div>
                <div class="card-body">
                    <form className="form-group mb-3" onSubmit={handleSubmit}>
                        <input className="form-control mb-3" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
                        {/* <select className="form-control mb-3" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                            <option value="" disabled>Select Customer</option>  // SELECT CUSTOMER HERE FROM RENTAL FORM AND WE ALSO HAVE TO MODIFY RENTAL FORM ACCORDDINGLY FROM 
                            {customers.map(customer => (
                                <option key={customer._id} value={customer._id}>{customer.name}</option>
                            ))}
                        </select> */}
                        <select className="form-control mb-3" value={rentalId} onChange={(e) => setRentalId(e.target.value)} required>
                            <option value="" disabled>Select Rental</option>
                            {rentals.map(rental => (
                                <option key={rental._id} value={rental._id}>{rental._name}</option>
                            ))}
                        </select>
                        <button class="btn btn-primary" type="submit">Create Bill</button>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default BillForm;
