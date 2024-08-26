// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';

// const ItemForm = () => {
//     const [item_name, setName] = useState('');
//     const [category, setCategory] = useState('');
//     const [saleRate, setSaleRate] = useState(0);
//     const [quantity, setQuantity] = useState(0);
//     const [rentalRate, setRentalRate] = useState(0);
//     const [description, setDescription] = useState('');
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await api.get('/categories');
//                 setCategories(response.data);
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//                 alert('Error fetching categories');
//             }
//         };

//         fetchCategories();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const newItem = {
//                 item_name,
//                 category,
//                 description,
//                 quantity,
//                 saleRate,
//                 rentalRate,
//             };

//             await api.post('/items', newItem); // API endpoint to create a new item
//             alert('Item created successfully');
//             // Reset the form fields
//             setName('');
//             setCategory('');
//             setDescription('');
//             setSaleRate(0);
//             setQuantity(0);
//             setRentalRate(0);
//         } catch (error) {
//             console.error("Error creating item:", error);
//             alert('Error creating item');
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <div className="card">
//                 <div className="card-header">
//                     Create Item
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="form-group mb-3">
//                             <label>Name</label>
//                             <input type="text" className="form-control" value={item_name} onChange={(e) => setName(e.target.value)} required />
//                         </div>
//                         <div className="form-group mb-3">
//                             <label>Category</label>
//                             <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
//                                 <option value="" disabled>Select Category</option>
//                                 {categories.map(category => (
//                                     <option key={category._id} value={category._id}>{category.category}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group mb-3">
//                             <label>Description</label>
//                             <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
//                         </div>
//                         <div className="form-group mb-3">
//                             <label>Quantity</label>
//                             <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
//                         </div>
//                         <div className="form-group mb-3">
//                             <label>Rental Rate</label>
//                             <input type="number" className="form-control" value={rentalRate} onChange={(e) => setRentalRate(Number(e.target.value))} required />
//                         </div>
//                         <div className="form-group mb-3">
//                             <label>Sale Rate</label>
//                             <input type="number" className="form-control" value={saleRate} onChange={(e) => setSaleRate(Number(e.target.value))} required />
//                         </div>
//                         <button type="submit" className="btn btn-primary">Create Item</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ItemForm;


//-----0---------------------------------------------------


import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ItemForm = () => {
    const [categories, setCategories] = useState([]);
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [rentalRate, setRentalRate] = useState('');
    const [saleRate, setSaleRate] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        // Fetch categories from your API
        api.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const itemData = {
            item_name: itemName,
            category,
            description,
            rentalRate: parseFloat(rentalRate),
            saleRate: parseFloat(saleRate),
            quantity: parseInt(quantity, 10)
        };

        api.post('/items', itemData)
            .then(response => {
                alert('Item created successfully!');
                // Reset the form
                setItemName('');
                setCategory('');
                setDescription('');
                setRentalRate('');
                setSaleRate('');
                setQuantity('');
            })
            .catch(error => console.error('Error creating item:', error));
    };

    return (
        <div className="container mt-4">
            <h2>Create Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">Item Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        className="form-select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.category}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="rentalRate" className="form-label">Rental Rate</label>
                    <input
                        type="number"
                        className="form-control"
                        id="rentalRate"
                        value={rentalRate}
                        onChange={(e) => setRentalRate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="saleRate" className="form-label">Sale Rate</label>
                    <input
                        type="number"
                        className="form-control"
                        id="saleRate"
                        value={saleRate}
                        onChange={(e) => setSaleRate(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="0"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Item</button>
            </form>
        </div>
    );
};

export default ItemForm;
