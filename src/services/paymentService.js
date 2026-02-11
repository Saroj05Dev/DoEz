const razorpay = require("../config/razorpayConfig");
const crypto = require("crypto");
const { RAZORPAY_SECRET } = require("../config/serverConfig");
const {
  findBookingById,
  updateBookingStatus,
} = require("../repositories/booking_repositories");

async function createRazorpayOrder(amount, receipt) {
  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    receipt: receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw { reason: "Razorpay order creation failed", statusCode: 500, error };
  }
}

async function verifyPayment(paymentDetails) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = paymentDetails;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment verified
    const booking = await findBookingById(bookingId);
    if (!booking) {
      throw { reason: "Booking not found", statusCode: 404 };
    }

    // Update booking status
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentStatus = "Paid";
    booking.status = "Confirmed";
    await booking.save();

    return { success: true, booking };
  } else {
    throw { reason: "Invalid payment signature", statusCode: 400 };
  }
}

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
