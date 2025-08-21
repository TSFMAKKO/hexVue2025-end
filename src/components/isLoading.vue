<template>
  <!-- 全螢幕 蘋果風格 Loading -->
  <div v-if="isLoading" id="loading-overlay" class="d-flex justify-content-center align-items-center">
    <div class="apple-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>

</template>

<style>
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9999;
}

/* 蘋果轉圈圈 */
.apple-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.apple-spinner div {
  position: absolute;
  top: 3px;
  left: 18px;
  width: 4px;
  height: 10px;
  background: #333;
  /* 可換成白色 #fff 放深色背景 */
  border-radius: 2px;
  transform-origin: 2px 17px;
  /* 控制旋轉中心 */
  animation: fade 1.2s linear infinite;
  opacity: 0.25;
  /* 預設透明度較低 */
}

/* 12 條線，分佈在圓圈上 */
.apple-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}

.apple-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}

.apple-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}

.apple-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}

.apple-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}

.apple-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}

.apple-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}

.apple-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}

.apple-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}

.apple-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}

.apple-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}

.apple-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}

@keyframes fade {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.25;
  }
}
</style>
<script setup>
// isLoading

import { ref, computed, inject } from 'vue';
// const data = inject("data");
const isLoading = inject("isLoading"); // 可以直接讀寫父層提供的 ref
// const orderCancel = inject("orderCancel");
</script>