import axios from 'axios';
import { showAlert } from './alerts';

// Signup function
const signup = async (name, email, password, passwordConfirm) => {
  const signUpBtn = document.querySelector('.signUP-btn'); // Fetch the button inside the function

  try {
    signUpBtn.textContent = 'Signing up...'; // Set loading text

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      setTimeout(() => {
        location.reload(); // Refresh the page after 2 seconds
      }, 2000);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Email Already Exists or Invalid';
    showAlert('error', errorMessage);

    setTimeout(() => {
      location.reload(); // Refresh the page after 2 seconds
    }, 2000);
  }
};

// Attach event listener for signup form
const signupForm = document.querySelector('.form--signup');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

// Named export
export { signup };
