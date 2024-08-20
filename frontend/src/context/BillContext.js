import React, { createContext, useState } from 'react';
import api from '../utils/api';

const BillContext = createContext();

const BillProvider = ({ children }) => {
    const [bills, setBills] = useState([]);

    const fetchBills = async () => {
        const response = await api.get('/bills');
        setBills(response.data);
    };

    const createBill = async (bill) => {
        await api.post('/bills', bill);
        fetchBills();
    };

    return (
        <BillContext.Provider value={{ bills, fetchBills, createBill }}>
            {children}
        </BillContext.Provider>
    );
};

export { BillContext, BillProvider };
