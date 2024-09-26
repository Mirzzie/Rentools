const Order = require("../models/orderModel");
const Item = require("../models/itemModel");

// Retrieve all orders with rental and sales details, calculate overdue charges
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "rentItems._id",
        select: "item_name description rentalRate",
      })
      .populate({
        path: "saleItems._id",
        select: "item_name description saleRate",
      });

    const updatedOrders = orders.map((order) => {
      let overdueCharges = 0;

      if (order.returnDate && new Date() > new Date(order.returnDate)) {
        const overdueHours =
          Math.abs(new Date() - new Date(order.returnDate)) / 36e5;

        order.rentItems.forEach((item) => {
          const rate = item._id.rentalRate;
          overdueCharges += rate * overdueHours * item.stock;
        });
      }

      order = order.toObject(); // Convert Mongoose document to plain JavaScript object
      order.overdueCharges = overdueCharges;

      return order;
    });

    res.status(200).json(updatedOrders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.acknowledgeReturn = async (req, res) => {
  const { orderId, itemId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const rentItem = order.rentItems.find(item => item._id.toString() === itemId);
    if (!rentItem) return res.status(404).json({ error: "Rent item not found" });

    // Restock the item
    const item = await Item.findById(rentItem._id._id);
    if (item) {
      item.stock += rentItem.stock;
      await item.save();
    }

    // Remove the rent item from the order
    order.rentItems = order.rentItems.filter(item => item._id.toString() !== itemId);
    await order.save();

    // If no rent items are left, allow the order to be deleted
    if (order.rentItems.length === 0) {
      await Order.findByIdAndDelete(orderId);
      return res.json({ message: "Order completed and removed", allItemsReturned: true });
    } else {
      return res.json({ message: "Item returned and restocked", allItemsReturned: false });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing the return" });
  }
};

// Route to delete the order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await Order.findByIdAndDelete(orderId);
    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the order" });
  }
};
