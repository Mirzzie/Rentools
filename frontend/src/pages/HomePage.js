import React from 'react';
import RentalForm from '../components/RentalForm';


const HomePage = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Rental Tool Shop</h1>
            <div className="row mt-4">
                <div className="col-md-6">
                    <RentalForm />
                </div>
            </div>

        </div>
    );
};

export default HomePage;
