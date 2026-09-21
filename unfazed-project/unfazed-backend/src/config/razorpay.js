const Razorpay = require('razorpay');

// Lazily construct so the app doesn't crash locally if keys aren't set yet.
let instance = null;
function getRazorpay() {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}

module.exports = { getRazorpay };
