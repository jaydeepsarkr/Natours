import axios from 'axios';
import { showAlert } from './alerts';

// Signup function
const signup = async (name, email, password, passwordConfirm) => {
  const signUpBtn = document.querySelector('.signUP-btn'); // Fetch button inside the function to ensure it's always available

  try {
    signUpBtn.textContent = 'Signing up...'; // Set loading text at the start

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      signUpBtn.textContent = 'Created'; // Success message on button
      window.setTimeout(() => location.assign('/login'), 1500);
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Email Already Exists or Invalid';
    showAlert('error', errorMessage);

    // Set error message as button text if you want (optional)
    signUpBtn.textContent = 'Signup Failed'; // Reset to a safe fallback message
    console.error(errorMessage);
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
