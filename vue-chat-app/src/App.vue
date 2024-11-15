<template>
  <div id="app">
    <Chat />
  </div>
</template>

<script setup lang="ts">
import Chat from './components/Chat.vue';  // Import the Chat component
</script>

<style>
.chat-app {
  display: flex;
  justify-content: space-between;
  width: 700px;
  margin: 0 auto;
}
</style>
