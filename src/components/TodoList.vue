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

        <!--  -->
            <div class="todoList_statistics">
                <p> {{ unCompletedWork }} 個未完成項目</p>
            </div>
        </div>
     </div>
</template>

<script setup>
import { inject } from 'vue'

const status = inject("status")
console.log("status:",status);

const unCompletedWork = inject("unCompletedWork")
console.log("unCompletedWork:",unCompletedWork);


// const status = inject("status")

// const props = defineProps(['unCompletedWork'])

// const emit = defineEmits(['toggle', 'updateText', 'deleteHandler'])
</script>