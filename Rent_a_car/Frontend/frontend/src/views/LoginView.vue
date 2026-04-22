<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { UserService } from '@/services/user.service';
  import { SessionManager } from '@/utils/session.manager';
  
  const email = ref<string>("");
  const password = ref<string>("");
  const router = useRouter();
  
  function login() {
    UserService.login(email.value, password.value)
      .then(rsp => {
        if (rsp && rsp.data) {
          SessionManager.saveAuth(rsp.data);
          router.push({ path: '/' });
        } else {
          throw new Error('Invalid response received');
        }
      })
      .catch(e => {
        console.error('Login failed:', e);
        alert('Login failed. Please try again.');
      });
    console.log("login");
  }
  
  function goToSignup() {
    router.push({ path: '/signup' });
  }
  </script>
  <template>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <div class="login-form-container">
            <h1 class="h3 text-center">Welcome back, please login!</h1>
            <form @submit.prevent="login" class="mt-4">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                       v-model="email" required>
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <button type="button" class="btn btn-secondary" @click="goToSignup">Create New Account</button>
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
  
  .login-form-container {
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .login-form-container:before,
  .login-form-container:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%; 
    background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZkOFHSx8B5DpwYjv6F2HXBi39IBNzhIjC_Q&s'); /* Adjust the path to your left background image */
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
  
  .login-form-container:before {
    left: -100%; /* Adjusted left position to -30% */
    border-radius: 10px 0 0 10px;
  }
  
  .login-form-container:after {
    right: -100%; /* Adjusted right position to -30% */
    border-radius: 0 10px 10px 0;
  }
  
  @media (max-width: 576px) {
    .login-form-container:before,
    .login-form-container:after {
      display: none;
    }
  }
  </style>
  