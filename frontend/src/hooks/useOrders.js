import { useContext, useEffect } from 'react';
import { OrderContext } from '../context/OrderContext';

const useOrders = () => {
    const { orders, fetchOrders } = useContext(OrderContext);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return orders;
};

export default useOrders;
