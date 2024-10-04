import React, { useState } from 'react';
import './cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul className="cart-items">
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - <span className="price">${item.price}</span>
          </li>
        ))}
      </ul>
      <div className="buttons">
        <button className="add-button" onClick={() => addItemToCart({ name: 'Item1', price: 20 })}>Add Item 1</button>
        <button className="add-button" onClick={() => addItemToCart({ name: 'Item2', price: 30 })}>Add Item 2</button>
      </div>
    </div>
  );
};

export default Cart;
