// src/services/reviewService.js
const { createReview, getProviderReviews, findReviewById } = require("../repositories/review_repositories");
const Booking = require("../schema/booking_schema");

async function submitReview(customerId, { bookingId, rating, comment }) {
    const booking = await Booking.findById(bookingId).populate('customer_id provider_id');
    if (!booking || booking.customer_id._id.toString() !== customerId)
        throw { reason: "Invalid booking", statusCode: 400 };
    if (booking.status !== 'Completed')
        throw { reason: "Service not completed", statusCode: 400 };

    return await createReview({
        booking_id: bookingId,
        provider_id: booking.provider_id._id,
        customer_id: customerId,
        rating,
        comment
    });
}

async function getProviderReviewsService(providerId) {
    const reviews = await getProviderReviews(providerId);
    const avg = reviews.length ? Number((reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(2)) : 0;
    return { reviews, averageRating: avg };
}

async function getAllReviewsService() {
    return await require("../repositories/review_repositories").getAllReviews();
}

module.exports = { submitReview, getProviderReviewsService, getAllReviewsService };