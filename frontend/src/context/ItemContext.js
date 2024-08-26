import React, { createContext, useState } from 'react';
import api from '../utils/api';

const ItemContext = createContext();

const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        const response = await api.get('/items');
        setItems(response.data);
    };

    const createItem = async (item) => {
        await api.post('/items', item);
        fetchItems();
    };

    return (
        <ItemContext.Provider value={{ items, fetchItems, createItem }}>
            {children}
        </ItemContext.Provider>
    );
};

export { ItemContext, ItemProvider };
