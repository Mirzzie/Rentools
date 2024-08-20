import { useContext, useEffect } from 'react';
import { ItemContext } from '../context/ItemContext';

const useItems = () => {
    const { items, fetchItems } = useContext(ItemContext);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return items;
};

export default useItems;
