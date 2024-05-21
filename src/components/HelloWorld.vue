<template>
  <div class="container fill-height">
    <div class="row align-center justify-center">
      <div class="col">
        <div class="card">
          <div class="card-title">Chatbot</div>
          <hr />
          <div class="card-text">
            <div class="chat-container">
              <div class="chat-box" v-for="(message, index) in messages" :key="index">
                <div :class="{'user-message': message.isUser, 'bot-message': !message.isUser}">
                  {{ message.text }}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="card-actions">
            <input
              v-model="userMessage"
              @keyup.enter="sendMessage"
              placeholder="Type a message"
              class="text-field"
            />
            <button @click="sendMessage" class="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  </div>
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
        question: this.userMessage, // Ajusta esto según el formato esperado por tu endpoint
      };

      console.log(this.userMessage) 

      const requestHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        "azureml-model-deployment": "mlmachinedev-dnkjo-1"
      });

      console.log(JSON.stringify(requestBody)); 
      
      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: requestHeaders
        });

        if (response.ok) {
          const json = await response.json();
          // Añadir la respuesta del bot a la lista de mensajes
          console.log(json)
          this.messages.push({ text: json.output, isUser: false }); // Ajusta esto según el formato de la respuesta
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
.container {
  display: flex;
  height: 100vh;
}
.row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.col {
  max-width: 90%;
  width: 100%;
}
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-title {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 8px;
  align-self: flex-end; /* Alinea los mensajes del usuario a la derecha */

}
.card-text {
  margin-bottom: 16px;
}
.chat-container {
  height: 80vh;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
}
.chat-box {
  margin-bottom: 10px;
}
.user-message {
  align-self: flex-end;
  background-color: #e1ffc7;
  padding: 8px;
  border-radius: 4px;
  max-width: 70%;
}
.bot-message {
  align-self: flex-start;
  background-color: #f1f1f1;
  padding: 8px;
  border-radius: 4px;
  max-width: 70%;
}
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text-field {
  flex-grow: 1;
  padding: 8px;
  margin-right: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
}
</style>