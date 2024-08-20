import { useContext, useEffect } from 'react';
import { BillContext } from '../context/BillContext';

const useBills = () => {
    const { bills, fetchBills } = useContext(BillContext);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    return bills;
};

export default useBills;
