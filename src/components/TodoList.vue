<template>
     <div class="todoList_list">
        <!-- <h2>TodoList子組件</h2> -->
    <ul class="todoList_tab">
        <li><a href="#" @click.prevent="status = 'all'" :class="{ active: status === 'all' }">全部</a>
        </li>
        <li><a href="#" @click.prevent="status = 'uncompleted'"
                :class="{ active: status === 'uncompleted' }">待完成</a></li>
        <li><a href="#" @click.prevent="status = 'completed'"
                :class="{ active: status === 'completed' }">已完成</a></li>
    </ul>

        <div class="todoList_items">
        <!-- TodoItem -->
        <!--  :todos="todos"
            :todosView="todosView"
            @toggle="toggle"
            @updateText="updateText"
            @deleteHandler="deleteHandler"  -->
        <TodoItem 
            :todos="todos"
            :todosView="todosView"
            @toggle="handleToggle"
            @updateText="updateText"
            @deleteHandler="deleteHandler" 
        />

        <!--  -->
            <div class="todoList_statistics">
                <p> {{ unCompletedWork }} 個未完成項目</p>
            </div>
        </div>
     </div>
</template>

<script setup>
import { inject } from 'vue'
import TodoItem from "./TodoItem.vue"

const status = inject("status")
console.log("status:",status);

const unCompletedWork = inject("unCompletedWork")
console.log("unCompletedWork:",unCompletedWork);


const props = defineProps(['todos','todosView'])

const emit = defineEmits(['toggle', 'updateText', 'deleteHandler'])

const handleToggle = (id) => {
  // 收到孫層 emit 的 id，轉發給父層
  emit('toggle', id)
}

const updateText = (id, value) => {
  // 收到孫層 emit 的 id，轉發給父層
  emit('updateText', id ,value)
}

const deleteHandler = (id) => {
  // 收到孫層 emit 的 id，轉發給父層
  emit('deleteHandler', id)
}

// const status = inject("status")

// const props = defineProps(['unCompletedWork'])

// const emit = defineEmits(['toggle', 'updateText', 'deleteHandler'])
</script>