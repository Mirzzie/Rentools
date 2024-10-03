import React from 'react';
import HomePage from '../components/HomePage';


const LandingPage = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Tool Rent Shop</h1>
            <div className="row mt-4">
                <div className="col-md-14">
                    <HomePage />
                </div>
            </div>

        </div>
    );
};

export default LandingPage;
