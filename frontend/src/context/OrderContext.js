import React, { createContext, useState } from 'react';
import api from '../utils/api';

const OrderContext = createContext();

const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const response = await api.get('/orders');
        setOrders(response.data);
    };

    const createOrder = async (order) => {
        await api.post('/orders', order);
        fetchOrders();
    };

    return (
        <OrderContext.Provider value={{ orders, fetchOrders, createOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export { OrderContext, OrderProvider };
