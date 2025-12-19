const Order = require('../models/Order');

// Render preview page using cart stored in session
exports.preview = (req, res) => {
  const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
  if (!cart || cart.totalQty === 0) return res.redirect('/cart');
  res.render('order-preview', { cart });
};

// Confirm order: persist to DB, clear session cart, redirect to success
exports.confirm = async (req, res) => {
  try {
    const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
    if (!cart || cart.totalQty === 0) return res.redirect('/cart');

    const items = Object.keys(cart.items).map(k => {
      const it = cart.items[k];
      return {
        productId: it.product.id || it.product._id,
        name: it.product.name,
        price: it.product.price,
        qty: it.qty,
        lineTotal: it.lineTotal
      };
    });

    // If discount middleware has attached discount info, honor it when saving
    const discount = req.discount && req.discount.applied ? req.discount : null;
    const finalTotal = discount && discount.applied ? discount.discountedTotal : cart.totalPrice;

    const orderData = {
      items,
      totalQty: cart.totalQty,
      totalPrice: finalTotal,
      status: 'Placed'
    };
    if (discount && discount.applied) {
      orderData.discount = { code: discount.code, percent: discount.percent, amount: discount.amount };
    }

    // Capture customer email from form (for order history lookup)
    const email = req.body && req.body.email ? String(req.body.email).trim() : null;
    if (email) {
      orderData.customerEmail = email;
    }

    const order = new Order(orderData);
    await order.save();

    // Clear cart in session
    req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };

    res.redirect(`/order/success/${order._id}`);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).send('Failed to place order');
  }
};

// Display order success and summary
exports.success = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).send('Order not found');
    res.render('order-success', { order });
  } catch (err) {
    console.error('Error loading order:', err);
    res.status(500).send('Failed to load order');
  }
};

// Show form to ask for customer email (GET /my-orders)
exports.myOrdersForm = (req, res) => {
  res.render('my-orders-form');
};

// Search orders by customer email (POST /my-orders)
exports.myOrdersSearch = async (req, res) => {
  try {
    const email = req.body && req.body.email ? String(req.body.email).trim().toLowerCase() : null;
    if (!email) {
      return res.render('my-orders-form', { error: 'Please enter an email address.' });
    }

    // Find all orders matching the customer email (case-insensitive regex)
    const orders = await Order.find({ customerEmail: { $regex: email, $options: 'i' } })
      .sort({ createdAt: -1 })
      .lean();

    // Render results page
    res.render('my-orders-list', { email, orders });
  } catch (err) {
    console.error('Error searching orders:', err);
    res.render('my-orders-form', { error: 'Failed to search orders. Please try again.' });
  }
};
