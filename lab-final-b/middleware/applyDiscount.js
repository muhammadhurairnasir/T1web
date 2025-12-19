// Export the middleware function
module.exports = function applyDiscount(req, res, next) {
  try {
    const code = (req.body && req.body.coupon) || (req.query && req.query.coupon) || null;
    const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
    const discount = { applied: false };
    if (code && String(code).toUpperCase() === 'SAVE10' && cart.totalPrice > 0) {
      const percent = 10; // discount percent for SAVE10
      const amount = parseFloat((cart.totalPrice * (percent / 100)).toFixed(2));
      const discountedTotal = parseFloat((cart.totalPrice - amount).toFixed(2));
      discount.applied = true;
      discount.code = 'SAVE10';
      discount.percent = percent;
      discount.amount = amount; 
      discount.discountedTotal = discountedTotal;
    }
    req.discount = discount;
    res.locals.discount = discount;
    next();
  } catch (err) {
    console.error('applyDiscount error', err);
    req.discount = { applied: false };
    res.locals.discount = req.discount;
    next();
  }
};
