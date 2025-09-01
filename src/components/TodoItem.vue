<template>
    <ul class="todoList_item">
    <li v-for="todo in todosView" :key="todo.id">
        <label class="todoList_label">
            <input class="todoList_input" type="checkbox" :checked="todo.status"
                @click.prevent="toggleHandler(todo.id, $event)">
            <span v-if="!todo.isEdit" class="form-control">{{ todo.content }}</span>
            <!-- 案 enter 更新文字 -->
            <input v-if="todo.isEdit" class="form-control" type="text" :value="todo.content" @blur="todo.isEdit = false"
                @keyup.enter="updateTextHandler(todo.id, $event)" @keyup.esc="todo.isEdit = false">
        </label>
        <a href="#" v-if="status === 'completed'" @click.prevent="deleteHandler(todo.id, $event)">
            <font-awesome-icon icon="times" />
        </a>
        <!-- 編輯文字的按鈕 -->
        <a v-else href="#" @click.prevent="todo.isEdit = true">
            <font-awesome-icon icon="pen-to-square" />
        </a>

    </li>
    <li v-if="todos.length === 0">目前無代辦事項 </li>     
    </ul>

</template>

<style>

</style>

<script setup>
import { inject } from 'vue'
const isLoading = inject("isLoading");
// status
const status = inject("status")

const props = defineProps(['todos','todosView'])

const emit = defineEmits(['toggle', 'updateText', 'deleteHandler'])

const toggleHandler = (id, event) => {
  emit('toggle', id, event)
}

const updateTextHandler = (id, event) => {
  console.log("孫層id:",id ,"value:", event.target.value);
  emit('updateText', id, event.target.value)
}

const deleteHandler = (id, event) => {
  emit('deleteHandler', id, event)
}

</script>