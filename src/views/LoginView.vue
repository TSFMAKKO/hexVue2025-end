<template>
    <div>
        <!-- <h2>登入</h2> -->
        <!-- login_page -->
        <div id="loginPage" class="bg-yellow">
            <div class="conatiner loginPage vhContainer">
                <div class="side">
                    <router-link to="/">
                        <img class="logoImg"
                            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
                            alt="待辦事項">
                    </router-link>
                    <img class="d-m-n"
                        src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
                        alt="工作圖片">
                </div>
                <div>
                    <form class="formControls" @submit.prevent="handleLogin">
                        <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
                        <label class="formControls_label" for="email">Email</label>
                        <input class="formControls_input" type="email" id="email" v-model="email"
                            placeholder="請輸入 email">
                        <span v-if="error.email" class="error-message">{{ error.email }}</span>

                        <label class="formControls_label" for="pwd">密碼</label>
                        <input class="formControls_input" type="password" id="pwd" v-model="password"
                            placeholder="請輸入密碼">
                        <span v-if="error.password" class="error-message">{{ error.password }}</span>
                        <span v-if="error.login" class="error-message">{{ error.login }}</span>

                        <button type="submit" class="formControls_btnSubmit">登入</button>
                        <router-link to="/signup" class="formControls_btnLink">註冊帳號</router-link>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('example444@gmail.com');
const password = ref('example');
const error = ref({
    email: '',
    password: '',
    login: ''
});
const isLoading = ref('false');
const token = ref('');
const baseApiUrl = "https://todolist-api.hexschool.io";

// const handleLogin = () => {
//     // 簡單的驗證
//     if (!email.value || !password.value) {
//         error.value = '請填寫所有欄位';
//         return;
//     }

//     // 這裡應該發送 API 請求進行登入驗證
//     // 模擬登入成功
//     console.log('登入資訊:', { email: email.value, password: password.value });

//     // 登入成功後跳轉到待辦事項頁面
//     router.push('/todos');
// };

const handleLogin = async () => {
    // 簡單的驗證
    if (!email.value) {
        error.value.email = '請填寫email';
        return;
    }

    if (!password.value) {
        error.value.password = '請填寫密碼';
        return;
    }


    // 模擬登入成功
    console.log('登入資訊:', { email: email.value, password: password.value });


    console.log("login");
    isLoading.value = true;

    try {
        const res = await axios.post(baseApiUrl + "/users/sign_in", {
            email: email.value,
            password: password.value,
        });

        console.log("res:", res.data);
        token.value = res.data.token;
        console.log(token.value);
        alert(`${res.data.nickname} 登入成功`);

        // 把token存入cookie 並設定日期
        document.cookie = `token=${token.value}; expires=${new Date(
            Date.now() + 3600 * 1000
        ).toUTCString()}; path=/`;
        isLoading.value = false;
        // router.push("/");
        // 登入成功後跳轉到待辦事項頁面
        router.push('/todos');

    } catch (e) {
        alert(`登入失敗${e.response.data.message}`);
        console.error("登入失敗:", e);
        isLoading.value = false;
        if (e.response && e.response.data) {
            // 如果有錯誤訊息，顯示在畫面上
            error.value.login = e.response.data.message || '登入失敗，請稍後再試';
        } else {
            error.value.login = '登入失敗，請稍後再試';
        }
        return;
    }



};
</script>

<style scoped>
.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}
</style>
<style scoped></style>