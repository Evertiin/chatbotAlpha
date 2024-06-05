<template>
  <div>
    <div class="row">
      <div class="col-6">
        <h1>Grupos</h1>
      </div>
      <div class="col-6" style="display: flex; justify-content: end; align-items: center;">
        <q-btn color="primary" label="Adicionar" @click="grupoEdicao = {}; modalGrupo = true" />
      </div>
    </div>

    <q-table style="width: 100%;margin-left: 0;" flat bordered square hide-bottom class="my-sticky-dynamic q-ma-lg"
      :data="groups" :columns="columns" :loading="loading" row-key="id" :pagination.sync="pagination"
      :rows-per-page-options="[0]">

      <template v-slot:body-cell-isActive="props">
        <q-td class="text-center">
          <q-icon size="24px" :name="props.value ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
            :color="props.value ? 'positive' : 'negative'" />
        </q-td>
      </template>

      <template v-slot:body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn flat round icon="groups" @click="editarUsuarios(props.row)">
            <q-tooltip content-class="bg-padrao text-grey-9 text-bold">
              Adicionar/ Remover Usuários
            </q-tooltip>
          </q-btn>
          <q-btn flat round icon="edit" @click="editarGrupo(props.row)" />
          <q-btn flat round icon="mdi-delete" @click="deletarGrupo(props.row)" />
        </q-td>
      </template>
    </q-table>
    <ModalGrupo :modalGrupo.sync="modalGrupo" :grupoEdicao.sync="grupoEdicao" @modal-grupo:criada="grupoCriada"
      @modal-grupo:editada="grupoEditada" />
    <ModalUserGrupo :modalUserGrupo.sync="modalUserGrupo" :grupoId.sync="grupoId" />
  </div>
</template>

<script>
import ModalGrupo from './ModalGrupo'
import ModalUserGrupo from './ModalUserGrupo'
import { DeletarGrupo, ListarGrupos } from 'src/service/grupos'
export default {
  name: 'Grupos',
  components: {
    ModalGrupo,
    ModalUserGrupo
  },
  data() {
    return {
      grupoEdicao: {},
      modalGrupo: false,
      modalUserGrupo: false,
      grupoId: 0,
      groups: [],
      pagination: {
        rowsPerPage: 40,
        rowsNumber: 0,
        lastIndex: 0
      },
      loading: false,
      columns: [
        { name: 'id', label: '#', field: 'id', align: 'left' },
        { name: 'group', label: 'Grupo', field: 'group', align: 'left' },
        { name: 'isActive', label: 'Ativo', field: 'isActive', align: 'center' },
        { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
      ]
    }
  },
  methods: {
    async listarGrupos() {
      const { data } = await ListarGrupos()
      this.groups = data
    },
    grupoCriada(grupo) {
      const newGrupos = [...this.groups]
      newGrupos.push(grupo)
      this.groups = [...newGrupos]
    },
    grupoEditada(grupo) {
      const newGrupos = [...this.groups]
      const idx = newGrupos.findIndex(g => g.id === grupo.id)
      if (idx > -1) {
        newGrupos[idx] = grupo
      }
      this.groups = [...newGrupos]
    },
    editarGrupo(grupo) {
      this.grupoEdicao = { ...grupo }
      this.modalGrupo = true
    },
    editarUsuarios(grupo) {
      this.modalUserGrupo = true
      this.grupoId = grupo.id
    },
    deletarGrupo(grupo) {
      this.$q.dialog({
        title: 'Atenção!!',
        message: `Deseja realmente deletar o grupo "${grupo.group}"?`,
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
        DeletarGrupo(grupo)
          .then(res => {
            let newGrupos = [...this.groups]
            newGrupos = newGrupos.filter(g => g.id !== grupo.id)

            this.groups = [...newGrupos]
            this.$q.notify({
              type: 'positive',
              progress: true,
              position: 'top',
              message: `Grupo ${grupo.group} deletado!`,
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
    this.listarGrupos()
  }
}
</script>

<style lang="scss" scoped></style>
