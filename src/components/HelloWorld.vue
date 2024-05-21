<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="justify-center">Chatbot</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="chat-container">
              <div class="chat-box" v-for="(message, index) in messages" :key="index">
                <v-chip :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
                  {{ message.text }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-text-field
              v-model="userMessage"
              @keyup.enter="sendMessage"
              label="Type a message"
              outlined
              dense
              hide-details
            ></v-text-field>
            <v-btn @click="sendMessage" color="primary">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      userMessage: '',
      messages: [],
      apiKey: 'gHE4zDc97ibl1kRcvNpfsYxFIFry4FUY', // Reemplaza con tu clave API
      apiUrl: 'https://mlmachinedev-dnkjo.eastus.inference.ml.azure.com/score', // Cambiado para usar el proxy
    };
  },
  methods: {
    async sendMessage() {
      if (this.userMessage.trim() === '') return;

      // Añadir el mensaje del usuario a la lista
      this.messages.push({ text: this.userMessage, isUser: true });

      // Preparar el cuerpo de la solicitud
      const requestBody = {
        data: this.userMessage, // Ajusta esto según el formato esperado por tu endpoint
      };

      const requestHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "azureml-model-deployment": "mlmachinedev-dnkjo-1"
      });

      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: requestHeaders
        });

        if (response.ok) {
          const json = await response.json();
          // Añadir la respuesta del bot a la lista de mensajes
          this.messages.push({ text: json.response, isUser: false }); // Ajusta esto según el formato de la respuesta
        } else {
          console.debug(...response.headers);
          console.debug(response.body);
          throw new Error("Request failed with status code " + response.status);
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      } finally {
        this.userMessage = '';
      }
    },
  },
};
</script>

<style>
.chat-container {
  max-height: 60vh;
  overflow-y: auto;
}
.chat-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.user-message {
  align-self: flex-end;
  background-color: #e1ffc7;
}
.bot-message {
  align-self: flex-start;
  background-color: #f1f1f1;
}
</style>
