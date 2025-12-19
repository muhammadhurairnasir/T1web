const Product = require('../models/Product');

function recalc(cart) {
  let totalQty = 0;
  let totalPrice = 0;
  for (const k of Object.keys(cart.items)) {
    const it = cart.items[k];
    totalQty += it.qty;
    totalPrice += it.lineTotal;
  }
  cart.totalQty = totalQty;
  cart.totalPrice = parseFloat(totalPrice.toFixed(2));
}

// POST /cart/add
exports.add = async (req, res) => {
  try {
    const productId = req.body.productId || req.body.id || req.query.id;
    if (!productId) return res.status(400).send('productId required');

    const product = await Product.findOne({ id: parseInt(productId) }) || await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
    const key = product.id || product._id.toString();

    if (!cart.items[key]) {
      cart.items[key] = {
        product: { id: product.id || product._id, name: product.name, price: parseFloat(product.price), image: product.image || '/images/square.png' },
        qty: 0,
        lineTotal: 0
      };
    }

    cart.items[key].qty += 1;
    cart.items[key].lineTotal = parseFloat((cart.items[key].qty * cart.items[key].product.price).toFixed(2));
    recalc(cart);
    req.session.cart = cart;

    // If AJAX request, return JSON
    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) {
      return res.json({ cart });
    }

    res.redirect(req.get('referer') || '/wildlife');
  } catch (err) {
    console.error('Add to cart error', err);
    res.status(500).send('Failed to add to cart');
  }
};

// GET /cart
exports.view = (req, res) => {
  const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
  res.render('cart', { cart });
};

// POST /cart/update
exports.update = (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId) return res.status(400).send('productId required');
    const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
    const key = productId;
    const newQty = parseInt(qty, 10) || 0;
    if (!cart.items[key]) return res.status(404).send('Item not in cart');
    if (newQty <= 0) delete cart.items[key]; else {
      cart.items[key].qty = newQty;
      cart.items[key].lineTotal = parseFloat((cart.items[key].product.price * newQty).toFixed(2));
    }
    recalc(cart);
    req.session.cart = cart;
    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) return res.json({ cart });
    res.redirect('/cart');
  } catch (err) {
    console.error('Cart update error', err);
    res.status(500).send('Failed to update cart');
  }
};

// POST /cart/remove
exports.remove = (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).send('productId required');
    const cart = req.session.cart || { items: {}, totalQty: 0, totalPrice: 0 };
    if (cart.items[productId]) delete cart.items[productId];
    recalc(cart);
    req.session.cart = cart;
    if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) return res.json({ cart });
    res.redirect('/cart');
  } catch (err) {
    console.error('Cart remove error', err);
    res.status(500).send('Failed to remove item');
  }
};

// POST /cart/clear
exports.clear = (req, res) => {
  req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
  if (req.headers.accept && req.headers.accept.indexOf('application/json') !== -1) return res.json({ cart: req.session.cart });
  res.redirect('/cart');
};
