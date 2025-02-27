/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51QwK4q2MUEl26T2DSbmW9qrK1zDf9DqjVHBqiUUP8XLrpQb2RpnAhuKRKmC9Tbkl2sTx2jtcD0ZqK6HkYeC0KNzE00jGJgEBDR',
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
