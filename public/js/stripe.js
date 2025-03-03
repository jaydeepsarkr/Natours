/* eslint-disable */
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alerts';

// Load Stripe once
const stripePromise = loadStripe(
  'pk_test_51QwK4q2MUEl26T2DSbmW9qrK1zDf9DqjVHBqiUUP8XLrpQb2RpnAhuKRKmC9Tbkl2sTx2jtcD0ZqK6HkYeC0KNzE00jGJgEBDR',
);
export const bookTour = async (tourId, imageCover) => {
  try {
    const stripe = await stripePromise;

    // 1) Get checkout session from your API (send image URL in query params or body)
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
      {
        params: { imageCover }, // Pass the image URL
      },
    );

    // 2) Redirect to Stripe Checkout page
    const result = await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    if (result.error) {
      showAlert('error', result.error.message);
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};

// Attach event listener once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const bookBtn = document.getElementById('book-tour');
  if (bookBtn) {
    bookBtn.addEventListener('click', async (e) => {
      e.target.textContent = 'Processing...';
      const { tourId, imageCover } = e.target.dataset;

      const fullImageURL = `https://natours-ut2i.onrender.com/img/tours/${imageCover}`;

      await bookTour(tourId, fullImageURL);
      e.target.textContent = 'Book Now';
    });
  }
});
