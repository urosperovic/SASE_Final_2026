<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserService } from '@/services/user.service';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

async function signUp() {
  try {
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    const userData = {
      name: name.value,
      email: email.value,
      password: password.value
    };

    console.log('Sign up data:', userData);

    const response = await UserService.signUp(userData.name, userData.email, userData.password);
    console.log('Sign up response:', response);

    if (response.status === 200 || response.status === 201) {
      await UserService.login(email.value, password.value);
      router.push('/');
    } else {
      alert('Sign up failed. Please try again.');
    }

  } catch (error) {
    console.error('Sign up failed:', error);
    if ((error as any).response && (error as any).response.status === 500) {
      alert('Email already exists. Please use a different email address.');
    } else {
      alert('Sign up failed. Please try again.');
    }
  }
}
</script>
<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="signup-form-container">
          <h1 class="h3 text-center">Create an Account</h1>
          <form @submit.prevent="signUp" class="mt-4">
            <div class="mb-3">
              <label for="exampleInputname" class="form-label">Name</label>
              <input type="text" class="form-control" id="exampleInputname" v-model="name" required>
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail" class="form-label">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail" aria-describedby="emailHelp"
                     v-model="email" required>
              <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword" class="form-label">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword" v-model="password" required>
            </div>
            <div class="mb-3">
              <label for="exampleInputConfirmPassword" class="form-label">Confirm Password</label>
              <input type="password" class="form-control" id="exampleInputConfirmPassword"
                     v-model="confirmPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}

.signup-form-container {
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.signup-form-container:before,
.signup-form-container:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%; 
  background-image: url('https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/'); /* Adjust the path to your left background image */
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.signup-form-container:before {
  left: -100%;
  border-radius: 10px 0 0 10px;
}

.signup-form-container:after {
  right: -100%; 
  border-radius: 0 10px 10px 0;
}

@media (max-width: 576px) {
  .signup-form-container:before,
  .signup-form-container:after {
    display: none;
  }
}
</style>
