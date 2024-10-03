// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";
// import { Card, Button, Row, Col, Container } from "react-bootstrap";

// const OrderView = () => {
//   const [orders, setOrders] = useState([]);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await api.get("/orders");
//         setOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching orders", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const acknowledgeReturn = async (orderId, itemId) => {
//     try {
//       const response = await api.post(`/orders/return/${orderId}/${itemId}`);
//       if (response.data.allItemsReturned) {
//         setOrders(orders.filter((order) => order._id !== orderId)); // Remove the order
//       } else {
//         const updatedOrders = orders.map((order) => {
//           if (order._id === orderId) {
//             return {
//               ...order,
//               rentItems: order.rentItems.filter((item) => item._id !== itemId), // Compare using _id directly
//             };
//           }
//           return order;
//         });
//         setOrders(updatedOrders); // Update the state with the new order data
//       }
//     } catch (error) {
//       console.error("Error acknowledging return", error);
//     }
//   };

//   // Print the bill
//   const printBill = (order) => {
//     const printContents = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write(`<html><head><title>Order Bill</title></head><body>${printContents}</body></html>`);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   return (
//     <Container>
//       <h2 className="mb-4">Order View</h2>
//       {orders.map((order) => (
//         <Card className="mb-3" key={order._id}>
//           <Card.Header>
//             <h5>{order.name}</h5>
//             <p className="mb-0">
//               <strong>Phone:</strong> {order.phone}
//             </p>
//             <p className="mb-0">
//               <strong>Address:</strong> {order.address}
//             </p>
//           </Card.Header>
//           <Card.Body ref={printRef}>
//             <Row>
//               <Col md={6}>
//                 <h6>Rent Items</h6>
//                 {order.rentItems.length > 0 ? (
//                   order.rentItems.map((item) => (
//                     <div key={item._id._id}>
//                       <p className="mb-0">
//                         {item._id.item_name} (Qty: {item.stock})
//                       </p>
//                       <p className="text-muted small">
//                         Rental Rate: ₹{item._id.rentalRate}
//                       </p>
//                       <Button
//                         variant="success"
//                         onClick={() =>
//                           acknowledgeReturn(order._id, item._id._id)
//                         }
//                       >
//                         Acknowledge Return
//                       </Button>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No rent items.</p>
//                 )}
//               </Col>
//               <Col md={6}>
//                 <h6>Sale Items</h6>
//                 {order.saleItems.length > 0 ? (
//                   order.saleItems.map((item) => (
//                     <div key={item._id._id}>
//                       <p className="mb-0">
//                         {item._id.item_name} (Qty: {item.stock})
//                       </p>
//                       <p className="text-muted small">
//                         Sale Rate: ₹{item._id.saleRate}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No sale items.</p>
//                 )}
//               </Col>
//             </Row>
//             <Row className="mt-4">
//               <Col md={6}>
//                 <p>
//                   <strong>Total Rent Amount:</strong> ₹{order.totalRentAmount}
//                 </p>
//               </Col>
//               <Col md={6}>
//                 <p>
//                   <strong>Total Sale Amount:</strong> ₹{order.totalSaleAmount}
//                 </p>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={6}>
//                 <p>
//                   <strong>Overdue Charges:</strong> ₹{order.overdueCharges}
//                 </p>
//               </Col>
//             </Row>
//           </Card.Body>
//           <Card.Footer>
//             <Button variant="primary" onClick={() => printBill(order)}>
//               Generate and Print Bill
//             </Button>
//           </Card.Footer>
//         </Card>
//       ))}
//     </Container>
//   );
// };

// export default OrderView;

// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";
// import { Card, Button, Row, Col, Container } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";  // Import Toast
// import "react-toastify/dist/ReactToastify.css";  // Import Toast CSS

// const OrderView = () => {
//   const [orders, setOrders] = useState([]);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await api.get("/orders");
//         setOrders(response.data);
//         if (response.data.length === 0) {
//           toast.info("No orders available!");  // Show info toast if no orders are available
//         }
//       } catch (error) {
//         toast.error("Error fetching orders!");  // Show error toast
//         console.error("Error fetching orders", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const acknowledgeReturn = async (orderId, itemId) => {
//     try {
//       const response = await api.post(`/orders/return/${orderId}/${itemId}`);
//       if (response.data.allItemsReturned) {
//         setOrders(orders.filter((order) => order._id !== orderId)); // Remove the order
//         toast.success("All items returned! Order deleted.");  // Show success toast for deletion
//       } else {
//         const updatedOrders = orders.map((order) => {
//           if (order._id === orderId) {
//             return {
//               ...order,
//               rentItems: order.rentItems.filter((item) => item._id._id !== itemId), // Compare using _id directly
//             };
//           }
//           return order;
//         });
//         setOrders(updatedOrders); // Update the state with the new order data
//         toast.info("Item returned successfully!");  // Show info toast for item return
//       }
//     } catch (error) {
//       toast.error("Error acknowledging return!");  // Show error toast
//       console.error("Error acknowledging return", error);
//     }
//   };

//   // Print the bill
//   const printBill = (order) => {
//     const printContents = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write(`<html><head><title>Order Bill</title></head><body>${printContents}</body></html>`);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//     toast.success("Bill printed successfully!");  // Show success toast for printing
//   };

//   return (
//     <Container>
//       <h2 className="mb-4">Order View</h2>
//       <ToastContainer />  {/* Toast container to show notifications */}
//       {orders.length === 0 ? (
//         <div className="text-center">
//           <h4>No orders available.</h4>  {/* Display message when no orders are available */}
//         </div>
//       ) : (
//         orders.map((order) => (
//           <Card className="mb-3" key={order._id}>
//             <Card.Header>
//               <h5>{order.name}</h5>
//               <p className="mb-0">
//                 <strong>Phone:</strong> {order.phone}
//               </p>
//               <p className="mb-0">
//                 <strong>Address:</strong> {order.address}
//               </p>
//             </Card.Header>
//             <Card.Body ref={printRef}>
//               <Row>
//                 <Col md={6}>
//                   <h6>Rent Items</h6>
//                   {order.rentItems.length > 0 ? (
//                     order.rentItems.map((item) => (
//                       <div key={item._id._id}>
//                         <p className="mb-0">
//                           {item._id.item_name} (Qty: {item.stock})
//                         </p>
//                         <p className="text-muted small">
//                           Rental Rate: ₹{item._id.rentalRate}
//                         </p>
//                         <Button
//                           variant="success"
//                           onClick={() =>
//                             acknowledgeReturn(order._id, item._id._id)
//                           }
//                         >
//                           Acknowledge Return
//                         </Button>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No rent items.</p>
//                   )}
//                 </Col>
//                 <Col md={6}>
//                   <h6>Sale Items</h6>
//                   {order.saleItems.length > 0 ? (
//                     order.saleItems.map((item) => (
//                       <div key={item._id._id}>
//                         <p className="mb-0">
//                           {item._id.item_name} (Qty: {item.stock})
//                         </p>
//                         <p className="text-muted small">
//                           Sale Rate: ₹{item._id.saleRate}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No sale items.</p>
//                   )}
//                 </Col>
//               </Row>
//               <Row className="mt-4">
//                 <Col md={6}>
//                   <p>
//                     <strong>Total Rent Amount:</strong> ₹{order.totalRentAmount}
//                   </p>
//                 </Col>
//                 <Col md={6}>
//                   <p>
//                     <strong>Total Sale Amount:</strong> ₹{order.totalSaleAmount}
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6}>
//                   <p>
//                     <strong>Overdue Charges:</strong> ₹{order.overdueCharges}
//                   </p>
//                 </Col>
//               </Row>
//             </Card.Body>
//             <Card.Footer>
//               <Button variant="primary" onClick={() => printBill(order)}>
//                 Generate and Print Bill
//               </Button>
//             </Card.Footer>
//           </Card>
//         ))
//       )}
//     </Container>
//   );
// };

// export default OrderView;

// import React, { useEffect, useState, useRef } from "react";
// import api from "../utils/api";
// import { Card, Button, Row, Col, Container } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OrderView = () => {
//   const [orders, setOrders] = useState([]);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await api.get("/orders");
//         setOrders(response.data);
//         if (response.data.length === 0) {
//           toast.info("No orders available!");
//         }
//       } catch (error) {
//         toast.error("Error fetching orders!");
//         console.error("Error fetching orders", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const acknowledgeReturn = async (orderId, itemId) => {
//     try {
//       const response = await api.post(`/orders/return/${orderId}/${itemId}`);
//       if (response.data.allItemsReturned) {
//         setOrders(orders.filter((order) => order._id !== orderId));
//         toast.success("All items returned! Order deleted.");
//       } else {
//         const updatedOrders = orders.map((order) => {
//           if (order._id === orderId) {
//             return {
//               ...order,
//               rentItems: order.rentItems.filter((item) => item._id._id !== itemId),
//             };
//           }
//           return order;
//         });
//         setOrders(updatedOrders);
//         toast.info("Item returned successfully!");
//       }
//     } catch (error) {
//       toast.error("Error acknowledging return!");
//       console.error("Error acknowledging return", error);
//     }
//   };

//   // Manually delete an order
//   const deleteOrder = async (orderId) => {
//     try {
//       await api.delete(`/orders/${orderId}`);
//       setOrders(orders.filter((order) => order._id !== orderId));
//       toast.success("Order deleted successfully!");
//     } catch (error) {
//       toast.error("Error deleting order!");
//       console.error("Error deleting order", error);
//     }
//   };

//   // Print the bill excluding "Acknowledge Return" button
//   const printBill = (order) => {
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; }
//             .invoice-header { text-align: center; }
//             .invoice-header h1 { margin-bottom: 0; }
//             .invoice-header p { margin: 0; }
//             .invoice-section { margin-top: 20px; }
//             .invoice-section h6 { margin-bottom: 5px; }
//             .invoice-section p { margin: 0 0 5px 0; }
//             .invoice-total { font-weight: bold; margin-top: 20px; }
//           </style>
//         </head>
//         <body>
//           <div class="invoice-header">
//             <h1>Power Tools Gallery</h1>
//             <p>Invoice</p>
//           </div>
//           <hr />
//           <div class="invoice-section">
//             <h6>Customer Details:</h6>
//             <p><strong>Name:</strong> ${order.name}</p>
//             <p><strong>Phone:</strong> ${order.phone}</p>
//             <p><strong>Address:</strong> ${order.address}</p>
//           </div>
//           <div class="invoice-section">
//             <h6>Rent Items:</h6>
//             ${order.rentItems.length > 0 ? order.rentItems.map(item => `
//               <p>${item._id.item_name} (Qty: ${item.stock})</p>
//               <p class="text-muted small">Rental Rate: ₹${item._id.rentalRate}</p>
//             `).join('') : '<p>No rent items.</p>'}
//           </div>
//           <div class="invoice-section">
//             <h6>Sale Items:</h6>
//             ${order.saleItems.length > 0 ? order.saleItems.map(item => `
//               <p>${item._id.item_name} (Qty: ${item.stock})</p>
//               <p class="text-muted small">Sale Rate: ₹${item._id.saleRate}</p>
//             `).join('') : '<p>No sale items.</p>'}
//           </div>
//           <div class="invoice-total">
//             <p>Total Rent Amount: ₹${order.totalRentAmount}</p>
//             <p>Total Sale Amount: ₹${order.totalSaleAmount}</p>
//             <p>Overdue Charges: ₹${order.overdueCharges}</p>
//           </div>
//           <p>Thank you!</p>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//     toast.success("Bill printed successfully!");
//   };

//   return (
//     <Container>
//       <h2 className="mb-4">Order View</h2>
//       <ToastContainer />
//       {orders.length === 0 ? (
//         <div className="text-center">
//           <h4>No orders available.</h4>
//         </div>
//       ) : (
//         orders.map((order) => (
//           <Card className="mb-3" key={order._id}>
//             <Card.Header>
//               <h5>{order.name}</h5>
//               <p className="mb-0">
//                 <strong>Phone:</strong> {order.phone}
//               </p>
//               <p className="mb-0">
//                 <strong>Address:</strong> {order.address}
//               </p>
//             </Card.Header>
//             <Card.Body ref={printRef}>
//               <Row>
//                 <Col md={6}>
//                   <h6>Rent Items</h6>
//                   {order.rentItems.length > 0 ? (
//                     order.rentItems.map((item) => (
//                       <div key={item._id._id}>
//                         <p className="mb-0">
//                           {item._id.item_name} (Qty: {item.stock})
//                         </p>
//                         <p className="text-muted small">
//                           Rental Rate: ₹{item._id.rentalRate}
//                         </p>
//                         <Button
//                           variant="success"
//                           onClick={() => acknowledgeReturn(order._id, item._id._id)}
//                         >
//                           Acknowledge Return
//                         </Button>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No rent items.</p>
//                   )}
//                 </Col>
//                 <Col md={6}>
//                   <h6>Sale Items</h6>
//                   {order.saleItems.length > 0 ? (
//                     order.saleItems.map((item) => (
//                       <div key={item._id._id}>
//                         <p className="mb-0">
//                           {item._id.item_name} (Qty: {item.stock})
//                         </p>
//                         <p className="text-muted small">
//                           Sale Rate: ₹{item._id.saleRate}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No sale items.</p>
//                   )}
//                 </Col>
//               </Row>
//               <Row className="mt-4">
//                 <Col md={6}>
//                   <p>
//                     <strong>Total Rent Amount:</strong> ₹{order.totalRentAmount}
//                   </p>
//                 </Col>
//                 <Col md={6}>
//                   <p>
//                     <strong>Total Sale Amount:</strong> ₹{order.totalSaleAmount}
//                   </p>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6}>
//                   <p>
//                     <strong>Overdue Charges:</strong> ₹{order.overdueCharges}
//                   </p>
//                 </Col>
//               </Row>
//             </Card.Body>
//             <Card.Footer>
//               <Button variant="primary" onClick={() => printBill(order)}>
//                 Generate and Print Bill
//               </Button>
//               <Button variant="danger" onClick={() => deleteOrder(order._id)} className="ml-2">
//                 Delete Order
//               </Button>
//             </Card.Footer>
//           </Card>
//         ))
//       )}
//     </Container>
//   );
// };

// export default OrderView;


import React, { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderView = () => {
  const [orders, setOrders] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
        if (response.data.length === 0) {
          toast.info("No orders available!");
        }
      } catch (error) {
        toast.error("Error fetching orders!");
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  const acknowledgeReturn = async (orderId, itemId) => {
    try {
      const response = await api.post(`/orders/return/${orderId}/${itemId}`);
      if (response.data.allItemsReturned) {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("All items returned! Order deleted.");
      } else {
        const updatedOrders = orders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              rentItems: order.rentItems.filter((item) => item._id._id !== itemId),
            };
          }
          return order;
        });
        setOrders(updatedOrders);
        toast.info("Item returned successfully!");
      }
    } catch (error) {
      toast.error("Error acknowledging return!");
      console.error("Error acknowledging return", error);
    }
  };

  // Manually delete an order with conditional logic
  const deleteOrder = async (orderId, rentItems, saleItems) => {
    // Check if there are unreturned rent items
    if (rentItems.length > 0) {
      toast.error("Cannot delete order with unreturned rent items!");
      return; // Prevent deletion
    }

    // If no rent items but only sale items, confirm deletion
    if (saleItems.length > 0) {
      const confirmed = window.confirm("Are you sure you want to delete this sale-only order?");
      if (!confirmed) {
        return; // Prevent deletion if user cancels
      }
    }

    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error("Error deleting order!");
      console.error("Error deleting order", error);
    }
  };

  // Print the bill excluding "Acknowledge Return" button
  // const printBill = (order) => {
  //   const printWindow = window.open("", "", "width=800,height=600");
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Invoice</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; }
  //           .invoice-header { text-align: center; }
  //           .invoice-header h1 { margin-bottom: 0; }
  //           .invoice-header p { margin: 0; }
  //           .invoice-section { margin-top: 20px; }
  //           .invoice-section h6 { margin-bottom: 5px; }
  //           .invoice-section p { margin: 0 0 5px 0; }
  //           .invoice-total { font-weight: bold; margin-top: 20px; }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="invoice-header">
  //           <h1>Power Tools Gallery</h1>
  //           <p>Invoice</p>
  //         </div>
  //         <hr />
  //         <div class="invoice-section">
  //           <h6>Customer Details:</h6>
  //           <p><strong>Name:</strong> ${order.name}</p>
  //           <p><strong>Phone:</strong> ${order.phone}</p>
  //           <p><strong>Address:</strong> ${order.address}</p>
  //         </div>
  //         <div class="invoice-section">
  //           <h6>Rent Items:</h6>
  //           ${order.rentItems.length > 0 ? order.rentItems.map(item => `
  //             <p>${item._id.item_name} (Qty: ${item.stock})</p>
  //             <p class="text-muted small">Rental Rate: ₹${item._id.rentalRate}</p>
  //           `).join('') : '<p>No rent items.</p>'}
  //         </div>
  //         <div class="invoice-section">
  //           <h6>Sale Items:</h6>
  //           ${order.saleItems.length > 0 ? order.saleItems.map(item => `
  //             <p>${item._id.item_name} (Qty: ${item.stock})</p>
  //             <p class="text-muted small">Sale Rate: ₹${item._id.saleRate}</p>
  //           `).join('') : '<p>No sale items.</p>'}
  //         </div>
  //         <div class="invoice-total">
  //           <p>Total Rent Amount: ₹${order.totalRentAmount}</p>
  //           <p>Total Sale Amount: ₹${order.totalSaleAmount}</p>
  //           <p>Overdue Charges: ₹${order.overdueCharges}</p>
  //         </div>
  //         <p>Thank you!</p>
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  //   toast.success("Bill generated successfully!");
  // };

  const printBill = (order) => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-header { text-align: center; margin-bottom: 20px; }
            .invoice-header h1 { margin-bottom: 0; }
            .invoice-header p { margin: 0; }
            .invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            .invoice-table th { background-color: #f2f2f2; }
            .invoice-total { font-weight: bold; margin-top: 10px; }
            .invoice-section { margin-top: 20px; }
            p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1>Power Tools Gallery</h1>
            <p>Invoice</p>
          </div>
          <hr />
          <div class="invoice-section">
            <h6>Customer Details:</h6>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
          </div>
          <div class="invoice-section">
            <h6>Rent Items:</h6>
            ${order.rentItems.length > 0
        ? `<table class="invoice-table">
                    <tr>
                      <th>Item Name</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Rental Rate (₹)</th>
                    </tr>
                    ${order.rentItems.map(item => `
                      <tr>
                        <td>${item._id.item_name}</td>
                        <td>${item._id.description}</td>
                        <td>${item.stock}</td>
                        <td>${item._id.rentalRate}</td>
                      </tr>
                    `).join('')}
                  </table>`
        : '<p>No rent items.</p>'
      }
          </div>
          <div class="invoice-section">
            <h6>Sale Items:</h6>
            ${order.saleItems.length > 0
        ? `<table class="invoice-table">
                    <tr>
                      <th>Item Name</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Sale Rate (₹)</th>
                    </tr>
                    ${order.saleItems.map(item => `
                      <tr>
                        <td>${item._id.item_name}</td>
                        <td>${item._id.description}</td>
                        <td>${item.stock}</td>
                        <td>${item._id.saleRate}</td>
                      </tr>
                    `).join('')}
                  </table>`
        : '<p>No sale items.</p>'
      }
          </div>
          <div class="invoice-total">
            <p>Total Rent Amount: ₹${order.totalRentAmount}</p>
            <p>Total Sale Amount: ₹${order.totalSaleAmount}</p>
            <p>Overdue Charges: ₹${order.overdueCharges}</p>
          </div>
          <p>Thank you!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    toast.success("Bill generated successfully!");
  };


  return (
    <Container>
      <h2 className="mb-4">Order View</h2>
      <ToastContainer />
      {orders.length === 0 ? (
        <div className="text-center">
          <h4>No orders available.</h4>
        </div>
      ) : (
        orders.map((order) => (
          <Card className="mb-3" key={order._id}>
            <Card.Header>
              <h5>{order.name}</h5>
              <p className="mb-0">
                <strong>Phone:</strong> {order.phone}
              </p>
              <p className="mb-0">
                <strong>Address:</strong> {order.address}
              </p>
            </Card.Header>
            <Card.Body ref={printRef}>
              <Row>
                <Col md={6}>
                  <h6>Rent Items</h6>
                  {order.rentItems.length > 0 ? (
                    order.rentItems.map((item) => (
                      <div key={item._id._id}>
                        <p className="mb-0">
                          {item._id.item_name} (Qty: {item.stock})
                        </p>
                        <p className="text-muted small">
                          Rental Rate: ₹{item._id.rentalRate}
                        </p>
                        <Button
                          variant="success"
                          onClick={() => acknowledgeReturn(order._id, item._id._id)}
                        >
                          Acknowledge Return
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p>No rent items.</p>
                  )}
                </Col>
                <Col md={6}>
                  <h6>Sale Items</h6>
                  {order.saleItems.length > 0 ? (
                    order.saleItems.map((item) => (
                      <div key={item._id._id}>
                        <p className="mb-0">
                          {item._id.item_name} (Qty: {item.stock})
                        </p>
                        <p className="text-muted small">
                          Sale Rate: ₹{item._id.saleRate}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No sale items.</p>
                  )}
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={6}>
                  <p>
                    <strong>Total Rent Amount:</strong> ₹{order.totalRentAmount}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Total Sale Amount:</strong> ₹{order.totalSaleAmount}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Overdue Charges:</strong> ₹{order.overdueCharges}
                  </p>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" onClick={() => printBill(order)}>
                Generate Bill
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteOrder(order._id, order.rentItems, order.saleItems)}
                className="ml-2"
              >
                Delete Order
              </Button>
            </Card.Footer>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderView;
