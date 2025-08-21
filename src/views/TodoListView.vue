<style>
.form-control {
    /* 移除正常狀態下的邊框 */
    border: none;
    padding: 0px 2px;
    font-size: 16px;
    /* margin: 0; */
    transition: all .5s;
}

.form-control:hover {
    /* 移除滑鼠移入時的邊框 */
    border: none;
}

.form-control:focus {
    /* 移除點擊或選中時的藍色外框和陰影 */
    border: none;
    box-shadow: none;
}
</style>
<template>
    <!-- <h1>todolis</h1> -->
    <!-- ToDo List -->
    <div id="todoListPage" class="bg-half">
        <nav>
            <h1><a href="#">ONLINE TODO LIST</a></h1>
            <ul>
                <li class="todo_sm"><a href="#"><span>{{ userData.nickname }}的代辦</span></a></li>
                <li><a @click="logout" href="#loginPage">登出</a></li>
            </ul>
        </nav>
        <div class="conatiner todoListPage vhContainer">
            <div class="todoList_Content">
                <div class="inputBox">
                    <input type="text" v-model="createText" @keypress.enter="createData" placeholder="請輸入待辦事項">
                    <a href="#" @click.prevent="createData">
                        <i class="fa fa-plus"></i>
                    </a>
                </div>
                <div class="todoList_list">
                    <ul class="todoList_tab">
                        <li><a href="#" @click.prevent="status = 'all'" :class="{ active: status === 'all' }">全部</a>
                        </li>
                        <li><a href="#" @click.prevent="status = 'uncompleted'"
                                :class="{ active: status === 'uncompleted' }">待完成</a></li>
                        <li><a href="#" @click.prevent="status = 'completed'"
                                :class="{ active: status === 'completed' }">已完成</a></li>
                    </ul>
                    <div class="todoList_items">
                        <ul v-if="status === 'all'" class="todoList_item">
                            <!-- <li>
                                <label class="todoList_label">
                                    <input class="todoList_input" type="checkbox" value="true">
                                    <span>把冰箱發霉的檸檬拿去丟</span>
                                </label>
                                <a href="#">
                                    <i class="fa fa-times"></i>
                                </a>
                            </li> -->
                            <!--  -->
                            <li v-for="todo in todos">
                                <label class="todoList_label">
                                    <input class="todoList_input" type="checkbox" :checked="todo.status"
                                        @click.prevent="toggle(todo.id, $event)">
                                    <span v-if="!todo.isEdit" class="form-control">{{ todo.content }}</span>
                                    <input v-if="todo.isEdit" class="form-control" type="text" :value="todo.content"
                                        @blur="todo.isEdit = false" @keyup.enter="updateText(todo.id, $event)"
                                        @keyup.esc="todo.isEdit = false">
                                </label>
                                <a href="#" @click.prevent="todo.isEdit = true">
                                    <i class="fa fa-times">編輯</i>
                                </a>
                            </li>

                        </ul>

                        <ul v-if="status === 'uncompleted'" class="todoList_item">
                            <!-- <h2>未完成</h2> -->
                            <li v-for="todo in todosUncomleted">
                                <label class="todoList_label">
                                    <input class="todoList_input" type="checkbox" :checked="todo.status"
                                        @click.prevent="toggle(todo.id, $event)">
                                    <span v-if="!todo.isEdit" class="form-control">{{ todo.content }}</span>
                                    <input v-if="todo.isEdit" class="form-control" type="text" :value="todo.content"
                                        @blur="todo.isEdit = false" @keyup.enter="updateText(todo.id, $event)"
                                        @keyup.esc="todo.isEdit = false">
                                </label>

                                <a href="#" @click.prevent="todo.isEdit = true">
                                    <i class="fa fa-times">編輯</i>
                                </a>
                            </li>

                        </ul>

                        <ul v-if="status === 'completed'" class="todoList_item">
                            <!-- <h2>已完成</h2> -->
                            <li v-for="todo in todosComleted">
                                <label class="todoList_label">
                                    <input class="todoList_input" type="checkbox" :checked="todo.status"
                                        @click.prevent="toggle(todo.id, $event)">
                                    <span class="form-control">{{ todo.content }}</span>
                                </label>

                                <a href="#" @click.prevent="deleteHandler(todo.id, $event)">
                                    <i class="fa fa-times">刪除</i>
                                </a>
                            </li>

                        </ul>
                        <!--  -->
                        <div class="todoList_statistics">
                            <p> {{ completedWork }} 個已完成項目</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// import Loading from "../components/isLoading2View.vue";

const router = useRouter();
const token = ref('');
const isLoading = ref('');
// const isLoading = ref('');
// const isLoading = ref('');
const baseApiUrl = "https://todolist-api.hexschool.io";
const todos = ref([]);
const userData = ref(null);
const createText = ref('');
const status = ref('all');
const completedWork = computed(() => {
    return todos.value.filter(todo => todo.status === true).length;
});

const todosComleted = computed(() => {
    return todos.value.filter(todo => todo.status === true);
})
const todosUncomleted = computed(() => {
    return todos.value.filter(todo => todo.status === false);
})

const logout = async () => {
    console.log("logout");
    isLoading.value = true;
    // 檢查cookie有沒有token
    // const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiItT1hYQzBRZUp2c0U0SmlLVzRMTCIsIm5pY2tuYW1lIjoiZXhhbXBsZSIsImlhdCI6MTc1NTA2OTMyMSwiZXhwIjoxNzU1MzI4NTIxfQ.Gaz47oGmBZKhvNW435EhZHbNWlWCLvT8Qb4IuvQSh5A"
    try {
        // 抓不到token也會跳catch
        let tokenCookie = document.cookie
            .split(";")
            .find((row) => row.trim().startsWith("token="));
        tokenCookie = tokenCookie.split("=")[1];
        console.log("token exists:", tokenCookie);

        const res = await axios.post(
            baseApiUrl + "/users/sign_out",
            {},
            {
                headers: {
                    Authorization: `${tokenCookie}`,
                },
            }
        );
        // console.log(res);
        console.log("res.data:", res.data);
        // 登出成功後清除 cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        // router.push("/");

        // 清空暫存
        token.value = "";
        userData.value = null;
        alert(`成功登出 ${res.data.message}`);
    } catch (error) {
        alert(`登出失敗${error.data}`);
        console.log("登出失敗", error);
        // 如果是 401 未授權錯誤，也清除 cookie 並重導向
        // if (error.response && error.response.status === 401) {
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        // router.push("/");
        // }
    }

    isLoading.value = false;
};

const checkOnline = async () => {
    console.log("checkOnline");
    isLoading.value = true;
    try {
        // 檢查cookie有沒有token
        const cookies = document.cookie.split(";");
        console.log("cookies:", cookies);
        //
        token.value = cookies.find((row) => row.trim().startsWith("token=")).split("=")[1];
        // token.value = token

        if (token.value) {
            console.log("token exists:", token.value);
        }

        const res = await axios.get(baseApiUrl + "/users/checkout", {
            headers: {
                Authorization: `${token.value}`,
            },
        });

        console.log(res.data);
        userData.value = res.data;
        // alert(`${res.data.nickname} 在線上`);
        getAllData();
        isLoading.value = false;
    } catch (error) {
        // 跳到其他頁面
        alert("不再線上 即將踢人");
        router.push("/login");
        isLoading.value = false;
    }
};

checkOnline()
// // {
//   "status": true,
//   "data": [
//     {
//       "id": "123456789",
//       "createTime": 1620281234,
//       "content": "買晚餐",
//       "status": false
//     }
//   ]
// }

const getAllData = async () => {
    console.log("token:", token.value);

    const res = await axios.get(baseApiUrl + "/todos/", {
        headers: {
            Authorization: `${token.value}`,
        },
    });

    console.log(res.data);
    res.data.data.forEach((todo, i) => {
        // todo.isEdit = false;
        setTimeout(() => {
            // todo.isEdit = false;
            console.log("todo:", todo)

            todos.value.push(todo);
        }, 200 * i);
    });
    // todos.value = res.data.data;
};

// getAllData()

// /todos/{id}/toggle
const toggle = async (id, event) => {
    console.log("id:", id);
    const api = `${baseApiUrl}/todos/${id}/toggle`;
    console.log(api);

    try {
        const res = await axios.patch(
            api,
            {},
            {
                headers: {
                    Authorization: `${token.value}`,
                },
            }
        );

        // 更新成功
        let status = null;
        todos.value.map((todo) => {
            if (todo.id === id) {
                todo.status = !todo.status;
                status = todo.status;
            }
            return todo;
        });

        // event.target.checked = status

        console.log(res.data);
    } catch (error) {
        // 更新失敗把值回寫
        // let status = null
        // todos.value.forEach(todo => {
        //     if (todo.id === id) {
        //         status = todo.status
        //     }
        // })
        // console.log("status", status);
        // 把值回寫
        // event.target.checked = status
    }

    console.log(todos.value);

    // todos.value = res.data.data
};

// updateText
const updateText = async (id, event) => {
    console.log("updateText", "id:", id);
    const newContent = event.target.value;
    const api = `${baseApiUrl}/todos/${id}`;
    console.log(api);

    // 進動畫
    try {
        const res = await axios.put(
            api,
            {
                content: newContent,
            },
            {
                headers: {
                    Authorization: `${token.value}`,
                },
            }
        );

        if (res.status) {
            // 假如更新成功
            todos.value.map((todo) => {
                if (todo.id === id) {
                    todo.content = newContent;
                    todo.isEdit = false;
                }
                return todo;
            });
        }
        event.target.value = newContent;
        console.log(res.data);
    } catch (error) {
        // 假如更新失敗
        // let content = ""
        // todos.value.forEach(todo => {
        //     if (todo.id === id) {
        //         content = todo.content
        //     }
        // })
        // 把值回寫
        // event.target.value = content
    }

    //

    // 退動畫

    console.log(todos.value);

    // todos.value = res.data.data
};

const createData = async () => {
    const api = `${baseApiUrl}/todos/`;
    console.log(api);
    const res = await axios.post(
        api,
        {
            content: createText.value,
        },
        {
            headers: {
                Authorization: `${token.value}`,
            },
        }
    );

    console.log(res);

    if (res.status) {
        todos.value.push(res.data.newTodo);
    }
};

const deleteHandler = async (id, event) => {
    if (!confirm("確認刪除")) return;
    console.log("id:", id);
    const api = `${baseApiUrl}/todos/${id}`;
    console.log(api);

    try {
        const res = await axios.delete(api, {
            headers: {
                Authorization: `${token.value}`,
            },
        });

        // console.log(event.target.closest(".todo-item"));

        // event.target.closest(".todo-item").classList.add("disable");

        // 成功後刪除
        todos.value = todos.value.filter((todo) => {
            if (todo.id != id) {
                return todo;
            }
        });


        console.log(res.data);

    } catch (error) {
        // 更新失敗 不用該改
    }

    console.log(todos.value);

    // todos.value = res.data.data
};
</script>