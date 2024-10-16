import React from 'react';
import CartComponent from '../components/cart';



const Cart = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Cart Items</h1>
            <div className="row mt-4">
                <div className="col-md-14">
                    <CartComponent />
                </div>
            </div>

        </div>
    );
};

export default Cart;
