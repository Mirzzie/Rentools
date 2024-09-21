import React from 'react';
import OrderForm from '../components/OrderForm';


const HomePage = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Tool Rent Shop</h1>
            <div className="row mt-4">
                <div className="col-md-6">
                    <OrderForm />
                </div>
            </div>

        </div>
    );
};

export default HomePage;
