<template>
    <q-dialog v-model="showModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section class="q-pt-md">
          <div class="text-h6">Configuração da Integração ISPFY</div>
        </q-card-section>
        <!-- Separator -->
        <q-separator />
        <!-- Campos para configurar a integração -->
        <q-card-section class="q-pt-md">
          <q-input v-model="apiEdicaoISPFY.url" label="URL da API" outlined />
          <q-input v-model="apiEdicaoISPFY.token" label="Token API" outlined />
        </q-card-section>

        <!-- Checkbox para ativar/desativar a API -->
        <q-card-section class="q-pt-md">
          <q-item v-ripple clickable @click="apiEdicaoISPFY.ativo = !apiEdicaoISPFY.ativo">
            <q-item-section>
              <q-checkbox v-model="apiEdicaoISPFY.ativo" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ativar API</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <!-- Salvar ou cancelar a API -->
        <q-card-actions align="right">
          <q-btn color="primary" label="Salvar" @click="salvarConfiguracao" />
          <q-btn color="negative" label="Cancelar" @click="fecharModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

<script>
export default {
  props: {
    showModal: Boolean,
    apiEdicaoISPFY: Object
  },
  methods: {
    salvarConfiguracao() {
      // Lógica para salvar a configuração da API ISPFY
      // Emitir um evento para notificar o componente pai que a configuração foi salva
      this.$emit('config-saved', this.apiEdicaoISPFY)
    },
    fecharModal() {
      // Lógica para fechar o modal
      // Emitir um evento para notificar o componente pai que o modal deve ser fechado
      this.$emit('close-modal')
    }
  }
}
</script>

  <style scoped>
  /* Seus estilos CSS para o modal */
  </style>
