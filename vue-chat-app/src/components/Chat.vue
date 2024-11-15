<template>
    <div class="chat-window">
      <div class="message-list" ref="messageListRef">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.isSender ? 'sender' : 'receiver']"
        >
          {{ msg.text }}
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
    </div>
  </template>
  
  
  <script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'Chat',
  setup() {
    const messages = ref<{ text: string; isSender: boolean }[]>([]);
    const newMessage = ref<string>('');
    const ws = ref<WebSocket | null>(null);
    const messageListRef = ref<HTMLElement | null>(null);

    const clientId = Math.random().toString(36).substr(2, 9);

    const sendMessage = () => {
      if (ws.value && newMessage.value.trim()) {
        ws.value.send(JSON.stringify({ text: newMessage.value, clientId }));
        newMessage.value = ''; // Clear the input field after sending
      }
    };

    onMounted(() => {
      ws.value = new WebSocket('ws://localhost:8080');

      ws.value.onmessage = async (event) => {
        let data;

        if (event.data instanceof Blob) {
          data = await event.data.text();
        } else {
          data = event.data;
        }

        try {
          const parsedData = JSON.parse(data);
          if (parsedData && parsedData.text) {
            if (parsedData.clientId !== clientId) {
              messages.value.push({ text: parsedData.text, isSender: false });
            } else {
              messages.value.push({ text: parsedData.text, isSender: true });
            }
          }
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      };
    });

    // Watch the messages array and scroll to the bottom when a new message is added
    watch(messages, () => {
      if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
      }
    });

    return {
      messages,
      newMessage,
      sendMessage,
      messageListRef,
    };
  },
});
</script>


<style scoped>
.chat-window {
  border: 1px solid #ccc;
  width: 300px;
  height: 400px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* This ensures messages stack from top to bottom */
}

.message {
  padding: 8px 12px;
  border-radius: 5px;
  margin: 5px 0;
  max-width: 80%;
  word-wrap: break-word;
}

.sender {
  background-color: #d1e7dd;
  color: #0f5132;
  align-self: flex-end; /* Aligns to the right */
}

.receiver {
  background-color: #f8d7da;
  color: #842029;
  align-self: flex-start; /* Aligns to the left */
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}
</style>
  