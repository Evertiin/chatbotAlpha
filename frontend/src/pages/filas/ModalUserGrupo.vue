<template>
  <q-dialog persistent :value="modalUserGrupo" @hide="fecharModal" @show="abrirModal">
    <q-card style="width: 1000px" class="q-pa-lg">
      <q-card-section>
        <div class="row">
          <div class="col-6" style="padding-right: 5px;">
            <h3>Usuários do Sistema</h3>
            <q-toolbar class="bg-grey-2">
              <q-input rounded outlined dense class="full-width" bg-color="white" v-model="searchParamUser"
                @input="filtroUser()" placeholder="Pesquisar...">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </q-toolbar>
            <q-scroll-area style="height: calc(75vh - 158px) !important">
              <q-list>
                <q-item v-for="(contact) in searchedUsers" :key="contact.id">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">
                      {{ contact.name.charAt(0) }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">
                      {{ contact.name }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn round flat icon="add" class="q-mr-sm" @click="addUser(contact)">
                      <q-tooltip content-class="bg-padrao text-grey-9 text-bold">
                        Adicionar ao grupo
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>

          <div class="col-6" style="padding-left: 5px;">
            <h3>Usuários do Grupo</h3>
            <q-toolbar class="bg-grey-2">
              <q-input rounded outlined dense class="full-width" bg-color="white" v-model="searchParamGrupo"
                @input="filtroGrupo()" placeholder="Pesquisar...">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </q-toolbar>
            <q-scroll-area style="height: calc(75vh - 158px) !important">
              <q-list>
                <q-item v-for="(contact) in searchedGrupo" :key="contact.id">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">
                      {{ contact.user.name.charAt(0) }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">
                      {{ contact.user.name }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn round flat icon="delete" class="q-mr-sm" @click="revomeUser(contact.user)">
                      <q-tooltip content-class="bg-padrao text-grey-9 text-bold">
                        Remover do grupo
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>

                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-mt-md">
        <q-btn flat label="fechar" color="negative" v-close-popup class="q-mr-md" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ListarUsersPorGrupo, AddUserGrupo, RemoveUserGrupo } from 'src/service/grupos'
import { ListarUsuarios } from 'src/service/user'

export default {
  name: 'ModalUserGrupo',
  props: {
    modalUserGrupo: {
      type: Boolean,
      default: false
    },
    grupoId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      listaUsuariosGrupo: [],
      listaUsuarios: [],
      searchedUsers: [],
      searchedGrupo: [],
      searchParamUser: '',
      searchParamGrupo: ''
    }
  },
  methods: {
    resetar() {
      this.listaUsuariosGrupo = []
      this.listaUsuarios = []
      this.searchedUsers = []
      this.searchedGrupo = []
      this.searchParamUser = ''
      this.searchParamGrupo = ''
    },
    fecharModal() {
      this.$emit('update:grupoId', 0)
      this.$emit('update:modalUserGrupo', false)
      this.resetar()
    },
    filtroUser() {
      this.searchedUsers = this.listaUsuarios.filter(u => u.name.toLowerCase().indexOf(this.searchParamUser.toLowerCase()) == 0)
    },
    filtroGrupo() {
      this.searchedGrupo = this.listaUsuariosGrupo.filter(u => u.user.name.toLowerCase().indexOf(this.searchParamGrupo.toLowerCase()) == 0)
    },
    async abrirModal() {
      this.resetar()
      this.listarUsuariosDoGrupo()
      this.listarUsuariosDoSistema()
    },
    async listarUsuariosDoGrupo() {
      const { data } = await ListarUsersPorGrupo(this.grupoId)
      this.listaUsuariosGrupo = data
      this.searchedGrupo = data
    },
    async listarUsuariosDoSistema() {
      const { data } = await ListarUsuarios()
      this.listaUsuarios = data.users
      this.searchedUsers = data.users
    },
    async addUser(user) {
      try {
        await AddUserGrupo(user.id, this.grupoId)
        this.listarUsuariosDoGrupo()
        this.listarUsuariosDoSistema()
        this.$q.notify({
          type: 'info',
          progress: true,
          position: 'top',
          message: 'Usuário adicionado!',
          textColor: 'black',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          progress: true,
          position: 'top',
          message: 'Erro ao adicionar usuário!',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
      }
    },
    async revomeUser(user) {
      try {
        await RemoveUserGrupo(user.id, this.grupoId)
        this.listarUsuariosDoGrupo()
        this.listarUsuariosDoSistema()
        this.$q.notify({
          type: 'info',
          progress: true,
          position: 'top',
          message: 'Usuário removido!',
          textColor: 'black',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          progress: true,
          position: 'top',
          message: 'Erro ao remover usuário!',
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }]
        })
      }
    }
    // async handleGrupo() {
    //     try {
    //         this.loading = true
    //         if (this.grupo.id) {
    //             const { data } = await AlterarGrupo(this.grupo)
    //             this.$emit('modal-grupo:editada', data)
    //             this.$q.notify({
    //                 type: 'info',
    //                 progress: true,
    //                 position: 'top',
    //                 textColor: 'black',
    //                 message: 'Grupo Editado!',
    //                 actions: [{
    //                     icon: 'close',
    //                     round: true,
    //                     color: 'white'
    //                 }]
    //             })
    //         } else {
    //             const { data } = await CriarGrupo(this.grupo)
    //             this.$emit('modal-grupo:criada', data)
    //             this.$q.notify({
    //                 type: 'positive',
    //                 progress: true,
    //                 position: 'top',
    //                 message: 'Grupo criado!',
    //                 actions: [{
    //                     icon: 'close',
    //                     round: true,
    //                     color: 'white'
    //                 }]
    //             })
    //         }
    //         this.loading = false
    //         this.fecharModal()
    //     } catch (error) {
    //         console.error(error)
    //         this.$notificarErro('Ocorreu um erro!', error)
    //     }
    // }
  }
}
</script>

<style lang="scss" scoped>
.q-pa-lg {
  min-width: 70vw;
}
</style>
