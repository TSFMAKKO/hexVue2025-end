<template>
  <div>
    <!-- <h2>註冊</h2> -->
    <div id="signUpPage" class="bg-yellow">
      <div class="conatiner signUpPage vhContainer">
        <div class="side">
          <a href="#">
            <img class="logoImg"
              src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt="">
          </a>
          <img class="d-m-n"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
            alt="workImg">
        </div>
        <div>
          <form class="formControls" @submit.prevent="register">
            <h2 class="formControls_txt">註冊帳號</h2>

            <label class="formControls_label" for="email">Email</label>
            <input class="formControls_input" type="email" id="email" v-model="email" placeholder="請輸入 email" required>

            <label class="formControls_label" for="name">您的暱稱</label>
            <input class="formControls_input" type="text" id="name" v-model="nickname" placeholder="請輸入您的暱稱" required>

            <label class="formControls_label" for="pwd">密碼</label>
            <input class="formControls_input" type="password" id="pwd" v-model="password" placeholder="請輸入密碼" required>

            <label class="formControls_label" for="confirmPwd">再次輸入密碼</label>
            <input class="formControls_input" type="password" id="confirmPwd" v-model="confirmPassword"
              placeholder="請再次輸入密碼" required>

            <div v-if="error" class="error-message">{{ error }}</div>

            <button type="submit" class="formControls_btnSubmit">註冊帳號</button>
            <router-link to="/login" class="formControls_btnLink">登入</router-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from "sweetalert2";

const router = useRouter();
const email = ref('example333@gmail.com');
// const name = ref('');
const password = ref('example');
const confirmPassword = ref('example');
const nickname = ref('example333');
const error = ref('');
const isLoading = ref(false);
// const hasAccount = ref(false);
const baseApiUrl = "https://todolist-api.hexschool.io";


const handleSignUp = () => {
  // 重置錯誤訊息
  error.value = '';

  // 驗證表單
  if (!email.value || !nickname.value || !password.value || !confirmPassword.value) {
    error.value = '請填寫所有欄位';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = '兩次輸入的密碼不一致';
    return;
  }

  if (password.value.length < 6) {
    error.value = '密碼長度至少需要6個字元';
    return;
  }

  // 這裡應該發送 API 請求進行註冊
  // 模擬註冊成功
  console.log('註冊資訊:', {
    email: email.value,
    name: nickname.value,
    password: password.value
  });

  // 註冊成功後跳轉到登入頁面
  router.push('/login');
};

const register = async () => {
  // 重置錯誤訊息
  error.value = '';

  // 驗證表單
  if (!email.value || !nickname.value || !password.value || !confirmPassword.value) {
    error.value = '請填寫所有欄位';
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = '兩次輸入的密碼不一致';
    return;
  }

  if (password.value.length < 6) {
    error.value = '密碼長度至少需要6個字元';
    return;
  }

  // 這裡應該發送 API 請求進行註冊
  console.log("register");
  isLoading.value = true;
  //
  try {
    const res = await fetch(baseApiUrl + "/users/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        nickname: nickname.value,
      }),
    })

    let data = await res.json();
    console.log(data);

    console.log(data);
    if (data.status) {
      // alert(`註冊成功 ${data.uid}`);
      Swal.fire({
        title: `註冊成功`,
        text: `${data.uid}`,
        icon: 'success',
        confirmButtonText: '確定'
      }).then((result) => {
        // 註冊成功後跳轉到登入頁面
        router.push('/login');
      })

    } else {
      // alert(`註冊失敗 ${data.message}`);
      Swal.fire({
        title: `註冊失敗`,
        text: `${data.message}`,
        icon: 'error',
        confirmButtonText: '確定'
      });
    }
    isLoading.value = false;
  } catch (e) {
    alert(`註冊失敗`);
    isLoading.value = false;
    Swal.fire({
      title: `註冊失敗`,
      icon: 'error',
      confirmButtonText: '確定'
    });
  }


};
</script>

<style scoped>
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  text-align: center;
}
</style>
