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
    <div id="todoListPage" class="bg-half">
        <Loading />
        <nav>
            <h1><a href="#">ONLINE TODO LIST</a></h1>
            <ul>
                <li class="todo_sm"><a href="#"><span>{{ userData?.nickname }}的代辦</span></a></li>
                <li><a @click="logout" href="#loginPage">登出</a></li>
            </ul>
        </nav>
        <div class="conatiner todoListPage vhContainer">
            <div class="todoList_Content">
                <TodoForm @createData="createData" />
              
                
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
                         <TodoItem 
                            :todosView="todosView"
                            :todos="todos"
                            @toggle="toggle"
                            @updateText="updateText"
                            @deleteHandler="deleteHandler"
                        />
                        <!-- <hr> -->
                        <!-- <ul class="todoList_item">
                
                            <li v-for="todo in todosView" :key="todo.id">
                                <label class="todoList_label">
                                    <input class="todoList_input" type="checkbox" :checked="todo.status"
                                        @click.prevent="toggle(todo.id, $event)">
                                    <span v-if="!todo.isEdit" class="form-control">{{ todo.content }}</span>
                                    <input v-if="todo.isEdit" class="form-control" type="text" :value="todo.content"
                                        @blur="todo.isEdit = false" @keyup.enter="updateText(todo.id, $event)"
                                        @keyup.esc="todo.isEdit = false">
                                </label>
                                <a href="#" v-if="status === 'completed'"
                                    @click.prevent="deleteHandler(todo.id, $event)">
                                    <font-awesome-icon icon="times" />
                                </a>
                                <a v-else href="#" @click.prevent="todo.isEdit = true">
                                    <font-awesome-icon icon="pen-to-square" />
                                </a>

                            </li>
                            <li v-if="todos.length === 0">目前無代辦事項 </li>

                        </ul> -->

                        <div class="todoList_statistics">
                            <p> {{ unCompletedWork }} 個未完成項目</p>
                        </div>
                    </div>


                </div>

                <hr>

    <!--            :todosView="todosView"
                    :todos="todos"
                    @toggle="toggle"
                    @updateText="updateText"
                    @deleteHandler="deleteHandler" -->
                <TodoList
                  :unCompletedWork="unCompletedWork"
                 />

            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, provide, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import Loading from "../components/isLoading.vue";
import TodoForm from "../components/TodoForm.vue";
import TodoItem from "../components/TodoItem.vue";
import TodoList from "../components/TodoList.vue";

const router = useRouter();
const token = ref('');
const isLoading = ref('');
provide("isLoading", isLoading);
const baseApiUrl = "https://todolist-api.hexschool.io";
const todos = ref([]);
const isTodos = computed(() => {
    return todos.value.length > 0 ? true : false;
});
const userData = ref(null);
const createText = ref('');
const status = ref('all');



const unCompletedWork = computed(() => {
    return todos.value.filter(todo => todo.status === false).length;
});

const todosView = computed(() => {
    if (status.value === 'all') {
        return todos.value;
    } else if (status.value === 'uncompleted') {
        return todos.value.filter(todo => todo.status === false);
    } else if (status.value === 'completed') {
        return todos.value.filter(todo => todo.status === true);
    }
})


const logout = async () => {
    console.log("logout");
    isLoading.value = true;
    // 檢查cookie有沒有token
     try {
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
        console.log("res.data:", res.data);
        // 登出成功後清除 cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        // router.push("/");

        isLoading.value = false;
        // 清空暫存
        token.value = "";
        userData.value = null;
        // alert(`成功登出 ${res.data.message}`);
        Swal.fire({
            title: '成功登出',
            //   text: `${res.data.message}`,
            icon: 'success',
            confirmButtonText: '確定'
        });

    } catch (error) {
        // alert(`登出失敗${error.data}`);
        console.log("登出失敗", error);
        Swal.fire({
            title: '登出失敗',
            text: `${error.data.message}！`,
            icon: 'error',
            confirmButtonText: '確定'
        });
        // 如果是 401 未授權錯誤，也清除 cookie 並重導向
        // if (error.response && error.response.status === 401) {
        // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        // router.push("/");
        // }
        isLoading.value = false;
    }

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
        getAllData();
    } catch (error) {
        // alert("不再線上 即將踢人");
        Swal.fire({
            title: '不再線上 即將踢人',
            // text: `${error.data.message}！`,
            icon: 'error',
            confirmButtonText: '確定'
        }).then((result) => {
            router.push("/login");
            isLoading.value = false;
        })

    }
};


onMounted(() => {
    console.log("TodoListView onMounted");
    isLoading.value = false;
    checkOnline()
});



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
    isLoading.value = true;
    const res = await axios.get(baseApiUrl + "/todos/", {
        headers: {
            Authorization: `${token.value}`,
        },
    });

    console.log(res.data);
    res.data.data.forEach((todo, i) => {
        setTimeout(() => {
            console.log("todo:", todo)

            todos.value.push(todo);
            if (i === res.data.data.length - 1) {
                isLoading.value = false;
            }
        }, 400 * (i + 1));
    });
    if (res.data.data.length === 0) {
        isLoading.value = false;
    }
};

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
        const todo = todos.value.find((todo) => todo.id === id);
        todo.status = !todo.status;

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
const confirmDelete = async (id) => {
    console.log("id:", id);
    const data = todos.value.find((todo) => todo.id === id);
    return Swal.fire({
        title: "確定要刪除這筆資料嗎？",       // 標題
        text: `${data.content} 會被刪除`,  // 內文
        icon: "warning",              // 圖示：警告
        showCancelButton: true,       // 顯示取消按鈕
        confirmButtonText: "確定",     // 確定按鈕文字
        cancelButtonText: "取消"      // 取消按鈕文字
    })

        .then((result) => {
            if (result.isConfirmed) {
                // 使用者按下確定 → 執行刪除成功提示
                Swal.fire(
                    "刪除了！",
                    "資料已經被刪除。",
                    "success"
                );
                return true;
            } else if (result.isDismissed) {
                // 使用者按下取消或關閉彈窗
                Swal.fire(
                    "取消刪除",
                    "資料未被刪除",
                    "info"
                );
                return false;
            }
        });
};


const deleteHandler = async (id, event) => {
    // if (!confirm("確認刪除")) return;
    if (!(await confirmDelete(id))) return;

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

provide("createText", createText);
// provide("createData", createData);
// status unCompletedWork
provide("status",status)
provide("unCompletedWork",unCompletedWork)
// provide("todos",todos)

// :todosView="todosView"
// :todos="todos"
// @toggle="toggle"
// @updateText="updateText"
// @deleteHandler="deleteHandler"
</script>