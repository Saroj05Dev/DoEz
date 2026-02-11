const {
  createRazorpayOrder,
  verifyPayment,
} = require("../services/paymentService");

async function createOrder(req, res) {
  const { amount, bookingId } = req.body;
  try {
    const order = await createRazorpayOrder(amount, bookingId);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Payment order creation failed",
      error: error.error || error,
    });
  }
}

async function verify(req, res) {
  try {
    const result = await verifyPayment(req.body);
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Payment verification failed",
      error: error.error || error,
    });
  }
}

module.exports = {
  createOrder,
  verify,
};
