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
