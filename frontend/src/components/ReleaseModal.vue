<template>
    <q-dialog v-model="dialogVisible" position="top">
      <q-card>
        <q-card-section>
          <div class="q-pa-md">
            <h2 class="text-h5 text-primary">{{ releaseNotes.version }}</h2>

            <section v-if="releaseNotes.melhorias.length">
              <h3>Melhorias</h3>
              <ul>
                <li v-for="melhoria in releaseNotes.melhorias" :key="melhoria">{{ melhoria }}</li>
              </ul>
            </section>

            <section v-if="releaseNotes.novas.length">
              <h3>Novas funcionalidades</h3>
              <ul>
                <li v-for="nova in releaseNotes.novas" :key="nova">{{ nova }}</li>
              </ul>
            </section>

            <section v-if="releaseNotes.falhas.length">
              <h3>Falhas corrigidas</h3>
              <ul>
                <li v-for="falha in releaseNotes.falhas" :key="falha">{{ falha }}</li>
              </ul>
            </section>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Fechar" color="primary" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

<script>
export default {
  props: {
    releaseNotes: Object
  },
  data() {
    return {
      dialogVisible: true
    }
  },
  methods: {
    closeDialog() {
      // Feche o modal quando o botão "Fechar" for clicado
      this.dialogVisible = false

      // Atualize o localStorage para que o modal não seja exibido novamente
      const usuario = JSON.parse(localStorage.getItem('usuario')) || {}
      usuario.modalVersao = false
      localStorage.setItem('usuario', JSON.stringify(usuario))
    }
  }
}
</script>

  <style scoped>
  /* Adicione estilos personalizados conforme necessário */
  </style>
