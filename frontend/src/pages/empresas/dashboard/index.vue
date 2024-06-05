<template>
  <div class="dashboard-container">
    <dashboard/>
    <UltilizacaoVps/>
  </div>
</template>

<script>
import UltilizacaoVps from './UltilizacaoVps.vue'
import dashboard from './dashboard.vue'

export default {
  components: {
    dashboard,
    UltilizacaoVps
  }
}
</script>

<style scoped>
/* Estilização para o container do dashboard */
.dashboard-container {
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  padding: 1rem;
  height: 100%;
  font-family: Arial, sans-serif;
}

/* Estilização para os componentes filhos */
/* Você pode adicionar estilos específicos para os componentes filhos, se necessário */
</style>
