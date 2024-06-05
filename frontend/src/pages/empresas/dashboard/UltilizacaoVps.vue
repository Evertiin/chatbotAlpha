<template>
  <div class="server-status">
    <div class="clock" style="display: flex;">
      <div class="lado">
        <div class="status">
        <h2 class="card-title">Status do servidor</h2>
        <div class="info-item">
          <p>Tempo do servidor ligado:</p>
          <p class="info-value">{{ serverInfo["Uptime"] }}</p>
        </div>
        <p class="clock-time">Horas do Servidor: {{ currentTime }}</p>
      </div>
      </div>
    </div>
    <div class="cards-container">
      <div class="info-card">
        <h2 class="card-title">Informações Gerais</h2>
        <div class="info-item">
          <p>Hostname:</p>
          <p class="info-value">{{ serverInfo["Hostname"] }}</p>
        </div>
        <div class="info-item">
          <p>Sistema Operacional:</p>
          <p class="info-value">{{ serverInfo["Sistema Operacional"] }}</p>
        </div>
        <div class="info-item">
          <p>Modelo do Servidor:</p>
          <p class="info-value">{{ serverInfo["Modelo do Servidor"] }}</p>
        </div>
        <div class="info-item">
          <p>Endereço IP:</p>
          <p class="info-value">{{ serverInfo["Endereço IP"] }}</p>
        </div>
      </div>
      <div class="info-card">
        <h2 class="card-title">Memória</h2>
        <div class="info-item">
          <p>Total:</p>
          <p class="info-value">{{ serverInfo["Total Memory"] }}</p>
        </div>
        <div class="info-item">
          <p>Memória Livre:</p>
          <p class="info-value">{{ serverInfo["Free Memory"] }}</p>
        </div>
        <div class="info-item">
          <p>Uso de Memória:</p>
          <p class="info-value">{{ serverInfo["Memory Usage Percentage"] }}%</p>
        </div>
      </div>
      <div class="info-card">
        <h2 class="card-title">CPU</h2>
        <div class="info-item">
          <p>Quantidade de CPUs:</p>
          <p class="info-value">{{ serverInfo["Quantidade de CPUs"] }}</p>
        </div>
        <div class="info-item">
          <p>Uso de CPU:</p>
          <p class="info-value">{{ serverInfo["CPU Usage Percentage"] }}%</p>
        </div>
      </div>
      <div class="info-card">
        <h2 class="card-title">Espaço em Disco</h2>
        <div class="info-item">
          <p>Total:</p>
          <p class="info-value">{{ serverInfo["Total Disk Space"] }}</p>
        </div>
        <div class="info-item">
          <p>Espaço em Disco Livre:</p>
          <p class="info-value">{{ serverInfo["Free Disk Space"] }}</p>
        </div>
        <div class="info-item">
          <p>Uso de Espaço em Disco:</p>
          <p class="info-value">{{ serverInfo["Disk Usage Percentage"] }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ulizacaoVps } from '../../../service/estatisticas'

export default {
  data() {
    return {
      serverInfo: {},
      currentTime: '' // Inicializa a hora vazia
    }
  },
  mounted() {
    this.fetchServerInfo()

    // Inicializa o relógio
    this.updateClock()
  },
  methods: {
    async fetchServerInfo() {
      try {
        const response = await ulizacaoVps()
        this.serverInfo = response.data.serverInfo
      } catch (error) {
        console.error('Erro ao buscar informações do servidor:', error)
      }
    },
    updateClock() {
      // Função para atualizar o relógio a cada segundo
      const update = () => {
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, '0')
        const minutes = now.getMinutes().toString().padStart(2, '0')
        const seconds = now.getSeconds().toString().padStart(2, '0')
        this.currentTime = `${hours}:${minutes}:${seconds}`
      }

      // Atualiza a hora a cada segundo
      update()
      setInterval(update, 1000)
    }
  }
}
</script>

<style scoped>

.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rem; /* Adicione o valor desejado aqui para o espaçamento entre os itens */
}
.server-status {
  font-family: Arial, sans-serif;
  padding: 1rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  background-color: #f7f7f7;
  max-width: 100%;
  max-height: 35rem;
}

/* Estilo para a seção do relógio */
.clock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; /* Adiciona um espaço entre o relógio e as informações do servidor */
  max-height: 8rem;
}

.clock-time {
  font-size: 1.06rem; /* Tamanho menor para o relógio */
  margin-right: 1rem; /* Espaço à direita do relógio */
}

.cards-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-height: 17rem;
}

.info-card {
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #fff;
  flex: 1;
}

.info-item {
  margin: 0.1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-value {
  font-weight: bold;
  color: #007BFF;
}
</style>
