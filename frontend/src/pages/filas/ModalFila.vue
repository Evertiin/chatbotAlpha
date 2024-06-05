<template>
  <q-dialog persistent :value="modalFila" @hide="fecharModal" @show="abrirModal">
    <q-card style="width: 1000px" class="q-pa-lg">
      <q-card-section>
        <div class="text-h6">{{ filaEdicao.id ? 'Editar' : 'Criar' }} Fila</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-input square outlined v-model="fila.queue" label="Nome da Fila" />
          </div>
          <div class="col-6">
            <q-toggle v-model="fila.isActive" label="Ativo" />
          </div>
          <div class="col-6" v-if="empresa.enableIa">
            <q-toggle v-model="fila.from_ia" label="Chat pela IA" />
          </div>
          <div class="col-12" v-if="fila.from_ia">
            <label class="text-caption">Prompt</label>
            <textarea ref="inputEnvioMensagem" style="min-height: 30vh" class="q-pa-sm bg-white full-width"
              placeholder="Digita o prompt" autogrow dense outlined @input="(v) => fila.prompt = v.target.value"
              :value="fila.prompt" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-mt-md">
        <q-btn flat label="Cancelar" color="negative" v-close-popup class="q-mr-md" />
        <q-btn flat label="Salvar" color="primary" @click="handleFila" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { BuscarEmpresa } from 'src/service/empresas'
import { CriarFila, AlterarFila } from 'src/service/filas'
export default {
  name: 'ModalFila',
  props: {
    modalFila: {
      type: Boolean,
      default: false
    },
    filaEdicao: {
      type: Object,
      default: () => {
        return { id: null }
      }
    }
  },
  data() {
    return {
      fila: {
        id: null,
        queue: null,
        from_ia: false,
        isActive: true,
        prompt: ''
      },
      empresa: {}
    }
  },
  methods: {
    resetarFila() {
      this.fila = {
        id: null,
        queue: null,
        from_ia: false,
        isActive: true,
        prompt: ''
      }
    },
    fecharModal() {
      this.resetarFila()
      this.$emit('update:filaEdicao', { id: null })
      this.$emit('update:modalFila', false)
    },
    abrirModal() {
      if (this.filaEdicao.id) {
        this.fila = { ...this.filaEdicao }
      } else {
        this.resetarFila()
      }
    },
    async buscarEmpresa() {
      const usuario = JSON.parse(localStorage.getItem('usuario'))
      const { data } = await BuscarEmpresa(usuario.tenantId)
      this.empresa = data
    },
    async handleFila() {
      try {
        this.loading = true
        if (this.fila.id) {
          if (!this.fila.from_ia) {
            this.fila.prompt = ''
          }
          const { data } = await AlterarFila(this.fila)
          this.$emit('modal-fila:editada', data)
          this.$q.notify({
            type: 'info',
            progress: true,
            position: 'top',
            textColor: 'black',
            message: 'Etapa editada!',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
        } else {
          if (!this.fila.from_ia) {
            this.fila.prompt = ''
          }
          const { data } = await CriarFila(this.fila)
          this.$emit('modal-fila:criada', data)
          this.$q.notify({
            type: 'positive',
            progress: true,
            position: 'top',
            message: 'Fila criada!',
            actions: [{
              icon: 'close',
              round: true,
              color: 'white'
            }]
          })
        }
        this.loading = false
        this.fecharModal()
      } catch (error) {
        console.error(error)
        this.$notificarErro('Ocorreu um erro!', error)
      }
    }
  },
  created() {
    this.buscarEmpresa()
  }

}
</script>

<style lang="scss" scoped></style>
