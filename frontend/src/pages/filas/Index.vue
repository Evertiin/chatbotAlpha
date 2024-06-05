<template>
  <div>
    <q-tabs v-model="tab" inline-label class="text-teal" dense>
      <q-tab name="filas" label="Filas" icon="mdi-arrow-decision-outline" />
      <q-tab name="groups" label="Grupos" icon="groups" />
    </q-tabs>
    <template>
      <q-tab-panels v-model="tab" animated swipeable>
        <q-tab-panel name="filas">
          <div>

            <div class="row">
              <div class="col-6">
                <h1>Filas</h1>
              </div>
              <div class="col-6" style="display: flex; justify-content: end; align-items: center;">
                <q-btn color="primary" label="Adicionar" @click="filaEdicao = {}; modalFila = true" />
              </div>
            </div>

            <q-table style="width: 100%;margin-left: 0;" flat bordered square hide-bottom
              class="my-sticky-dynamic q-ma-lg" :data="filas" :columns="columns" :loading="loading" row-key="id"
              :pagination.sync="pagination" :rows-per-page-options="[0]">

              <template v-slot:body-cell-isActive="props">
                <q-td class="text-center">
                  <q-icon size="24px" :name="props.value ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
                    :color="props.value ? 'positive' : 'negative'" />
                </q-td>
              </template>
              <template v-slot:body-cell-from_ia="props">
        <q-td class="text-center">
          <q-icon size="24px"
            :name="props.value ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
            :color="props.value ? 'positive' : 'negative'" />
        </q-td>
      </template>
              <template v-slot:body-cell-acoes="props">
                <q-td class="text-center">
                  <q-btn flat round icon="edit" @click="editarFila(props.row)" />
                  <q-btn flat round icon="mdi-delete" @click="deletarFila(props.row)" />
                </q-td>
              </template>
            </q-table>
            <ModalFila :modalFila.sync="modalFila" :filaEdicao.sync="filaEdicao" @modal-fila:criada="filaCriada"
              @modal-fila:editada="filaEditada" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="groups">
          <Grupos />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<script>
import { DeletarFila, ListarFilas } from 'src/service/filas'
import ModalFila from './ModalFila'
import Grupos from './Grupos'
export default {
  name: 'Filas',
  components: {
    ModalFila,
    Grupos
  },
  data() {
    return {
      tab: 'filas',
      filaEdicao: {},
      modalFila: false,
      filas: [],
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0,
        lastIndex: 0
      },
      loading: false,
      columns: [
        { name: 'id', label: '#', field: 'id', align: 'left' },
        { name: 'queue', label: 'Fila', field: 'queue', align: 'left' },
        { name: 'isActive', label: 'Ativo', field: 'isActive', align: 'center' },
        // { name: 'from_ia', label: 'Fluxo IA', field: 'from_ia', align: 'center' },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
      ]
    }
  },
  methods: {
    async listarFilas() {
      const { data } = await ListarFilas()
      this.filas = data
    },
    filaCriada(fila) {
      const newFilas = [...this.filas]
      newFilas.push(fila)
      this.filas = [...newFilas]
    },
    filaEditada(fila) {
      const newFilas = [...this.filas]
      const idx = newFilas.findIndex(f => f.id === fila.id)
      if (idx > -1) {
        newFilas[idx] = fila
      }
      this.filas = [...newFilas]
    },
    editarFila(fila) {
      this.filaEdicao = { ...fila }
      this.modalFila = true
    },
    deletarFila(fila) {
      this.$q.dialog({
        title: 'Atenção!!',
        message: `Deseja realmente deletar a Fila "${fila.queue}"?`,
        cancel: {
          label: 'Não',
          color: 'primary',
          push: true
        },
        ok: {
          label: 'Sim',
          color: 'negative',
          push: true
        },
        persistent: true
      }).onOk(() => {
        this.loading = true
        DeletarFila(fila)
          .then(res => {
            let newFilas = [...this.filas]
            newFilas = newFilas.filter(f => f.id !== fila.id)

            this.filas = [...newFilas]
            this.$q.notify({
              type: 'positive',
              progress: true,
              position: 'top',
              message: `Fila ${fila.queue} deletada!`,
              actions: [{
                icon: 'close',
                round: true,
                color: 'white'
              }]
            })
          })
        this.loading = false
      })
    }

  },
  mounted() {
    this.listarFilas()
  }
}
</script>

<style lang="scss" scoped></style>
