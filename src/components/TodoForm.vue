<template>
    <div class="inputBox">
        <input type="text" v-model="createText" @keypress.enter="createData" placeholder="請輸入待辦事項">
        <!-- <input type="text" v-model="createText" @keypress.enter="$emit('createData')" placeholder="請輸入待辦事項"> -->

        <a v-if="createText.trim() !== ''" href="#" @click.prevent="createData">
            <font-awesome-icon icon="plus" />
        </a>
        <a v-else href="#">
            <font-awesome-icon icon="ban" />
        </a>
    </div>
</template>
<style scoped></style>

<script setup>
import { inject, ref } from 'vue'

// defineProps({
//     msg: String,
// })

const emit = defineEmits({
    createData: Function,
})

const createText = inject("createText");
// const createData = inject("createData");

const createData = () => {
    if (createText.value.trim() === '') {
        return;
    }
    // 觸發父組件的方法
    emit('createData');
    // 清空輸入框
    createText.value = '';
};
</script>