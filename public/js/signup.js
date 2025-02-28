import axios from 'axios';
import { showAlert } from './alerts';

// Signup function
const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => location.assign('/login'), 1500);
    }
  } catch (err) {
    const errorMessage =
      err.response.data.message || 'Email Already Exists or Invalid'; ;
    showAlert('error', errorMessage);
    console.log(errorMessage);
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
