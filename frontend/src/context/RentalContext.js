import React, { createContext, useState } from 'react';
import api from '../utils/api';

const RentalContext = createContext();

const RentalProvider = ({ children }) => {
    const [rentals, setRentals] = useState([]);

    const fetchRentals = async () => {
        const response = await api.get('/rentals');
        setRentals(response.data);
    };

    const createRental = async (rental) => {
        await api.post('/rentals', rental);
        fetchRentals();
    };

    return (
        <RentalContext.Provider value={{ rentals, fetchRentals, createRental }}>
            {children}
        </RentalContext.Provider>
    );
};

export { RentalContext, RentalProvider };
