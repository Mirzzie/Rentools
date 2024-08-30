import React from 'react';
import RentalView from '../components/RentalView';

const ViewRental = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">View Rentals</h1>
            <div className="row mt-4">
                <div className="col-md-6">
                    <RentalView />
                </div>
            </div>

        </div>
    );
};

export default ViewRental;
