import { useContext, useEffect } from 'react';
import { RentalContext } from '../context/RentalContext';

const useRentals = () => {
    const { rentals, fetchRentals } = useContext(RentalContext);

    useEffect(() => {
        fetchRentals();
    }, [fetchRentals]);

    return rentals;
};

export default useRentals;
