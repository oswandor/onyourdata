<template>
    <div class="chat">
      <ul v-for="message in messages" :key="message.id">
        <li>{{ message.text }}</li>
      </ul>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="newMessage" placeholder="Enter message">
        <button type="submit">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        messages: [],
        newMessage: "",
      };
    },
    methods: {
      async sendMessage() {
        const apiKey = "{YOUR_API_KEY}"; // Replace with your actual API key
        const url = "https://mlmachinedev-dnkjo.eastus.inference.ml.azure.com/score";
  
        const requestBody = ""; // Modify this if your API requires a body
  
        const requestHeaders = new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        });
  
        try {
          const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: requestHeaders,
          });
  
          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
          }
  
          const data = await response.json();
          this.messages.push({ id: Date.now(), text: data.text || "API response" }); // Update based on your API response format
          this.newMessage = "";
        } catch (error) {
          console.error("Error sending message:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chat {
    /* Add your styling for the chat UI */
  }
  </style>
  