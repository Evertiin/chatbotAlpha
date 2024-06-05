<template>
  <div>
    <q-table class="my-sticky-dynamic q-ma-lg" title="Empresas" :data="filterEmpresas" :columns="columns"
      :loading="loading" row-key="id" :pagination.sync="pagination" virtual-scroll :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]">
      <template v-slot:top-right>
        <q-input style="width: 300px" filled dense class="col-grow" debounce="500" v-model="filter" clearable
          placeholder="Localize" @input="filtrarEmpresa">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="q-ml-md col" :class="{
          'q-ml-none q-mt-md q-mr-md': $q.screen.width < 500
        }" color="primary" label="Adicionar" @click="tenantSelecionado = {}; modalEmpresa = true; isEdit = false" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="cnpj" :props="props">
            {{ props.row.cnpj }}
          </q-td>
          <q-td key="status" :props="props">
            <q-badge :color="props.row.status == 'active' ? 'green' : 'grey'">
              {{ props.row.status == 'active' ? 'Ativada' : 'Desativada' }}
            </q-badge>
          </q-td>
          <q-td key="maxUsers" :props="props">
            {{ props.row.maxUsers }}
          </q-td>
          <q-td key="maxConnections" :props="props">
            {{ props.row.maxConnections }}
          </q-td>
          <q-td class="text-center">
            <q-btn flat round icon="mdi-account-reactivate" @click="abrirModalConformacaoAtivacao(props.row)">
              <q-tooltip content-class="shadow-4" :offset="[10, 10]">
                {{ props.row.status == 'active' ? 'Desativar Empresa' : 'Ativar Empresa' }}
              </q-tooltip>
            </q-btn>
            <q-btn flat round icon="mdi-account-group" @click="listarUsuarios(props.row)">
              <q-tooltip content-class="shadow-4" :offset="[10, 10]">
                Ver Usuários
              </q-tooltip>
            </q-btn>
            <q-btn flat round icon='mdi-qrcode' @click="abrirWhatsapp(props.row)">
              <q-tooltip content-class="shadow-4" :offset="[10, 10]">
                Listar Conexões
              </q-tooltip>
            </q-btn>
            <q-btn flat round icon="edit" @click="editarEmpresa(props.row)">
              <q-tooltip content-class="shadow-4" :offset="[10, 10]">
                Editar Empresa
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <ModalEmpresa :modalEmpresa.sync="modalEmpresa" :tenantSelecionado.sync="tenantSelecionado" :isEdit.sync="isEdit"
      key="modal-empresa" />
    <ModalUsuario :modalUsuario.sync="modalUsuario" :tenant.sync="tenantSelecionado" key="modal-usuario" />
    <ModalWhatsapp :modalWhatsapp.sync="modalWhatsapp" :listaWhatsapp.sync="filterWhatsapp" key="modal-whatsapp" />
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm" style="margin-top: 2.5rem;margin-bottom: 1rem;margin-right: 2.5rem; margin-left: 1rem;">
            <b>Realmente deseja {{ empresaSelecionada.status == 'active' ? 'DESATIVAR' : 'ATIVAR' }}
              a empresa {{ empresaSelecionada.name }}</b>
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="cancelar" @click="cancelarAtivacao()" />
          <q-btn flat label="confirmar" color="primary" @click="confirmarAtivacao()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { AdminListarEmpresas, AdminUpdateStatusEmpresa } from '../../service/empresas'
import { adminListarWhatsapps } from 'src/service/sessoesWhatsapp'
import ModalEmpresa from './ModalEmpresa.vue'
import ModalUsuario from './ModalUsuario.vue'
import ModalWhatsapp from './ModalWhatsapp.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Empresa',
  components: {
    ModalEmpresa,
    ModalUsuario,
    ModalWhatsapp
  },
  data() {
    return {
      loading: false,
      filterEmpresas: [],
      confirm: false,
      isEdit: false,
      empresaSelecionada: {},
      whatsappStatus: {},
      listaWhatsapp: [],
      filterWhatsapp: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      filter: '',
      modalEmpresa: false,
      modalUsuario: false,
      modalWhatsapp: false,
      tenantSelecionado: {}
    }
  },
  computed: {
    ...mapGetters([
      'empresas'
    ]),
    columns() {
      return [
        {
          name: 'name',
          label: 'Razão Social',
          field: 'name',
          align: 'left',
          sortable: false
        },
        {
          name: 'cnpj',
          label: 'CNPJ',
          field: 'cnpj',
          align: 'left',
          sortable: false
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'left',
          sortable: false
        },
        {
          name: 'maxUsers',
          label: 'Máx. Usuários',
          field: 'maxUsers',
          align: 'left',
          sortable: false
        },
        {
          name: 'maxConnections',
          label: 'Máx. Conexões',
          field: 'maxConnections',
          align: 'left',
          sortable: false
        },
        {
          name: 'acoes',
          label: 'Ações',
          field: 'acoes',
          align: 'center'
        }
      ]
    }
  },
  watch: {
    empresas: {
      handler() {
        if (this.filter.length > 0) {
          this.filterEmpresas = this.empresas.filter(u => u.name.toLowerCase().indexOf(this.filter) == 0)
        } else {
          this.filterEmpresas = this.empresas
        }
      }
    }
  },
  methods: {
    async listarEmpresas() {
      this.loading = true
      const { data } = await AdminListarEmpresas()
      this.$store.commit('EMPRESAS_ADMIN', { action: 'create', data: data })
      this.loading = false
    },
    async ListarWhatsapps() {
      this.loading = true
      try {
        const { data } = await adminListarWhatsapps()
        this.listaWhatsapp = data
        if (data.length > 0) {
          console.log('Status WhatsApp:', data)
          this.statusWhatsapp = data[0].status
        }
      } catch (error) {
        console.error('Erro ao listar os WhatsApps:', error)
      } finally {
        this.loading = false
      }
    },
    async abrirWhatsapp(empresa) {
      console.log('aqui', empresa)
      this.filterWhatsapp = this.listaWhatsapp.filter(item => item.tenant.id == empresa.id)
      console.log('2', this.filterWhatsapp)
      this.modalWhatsapp = true
    },
    abrirModalConformacaoAtivacao(empresa) {
      this.empresaSelecionada = empresa
      this.confirm = true
    },
    cancelarAtivacao() {
      this.empresaSelecionada = {}
      this.confirm = false
    },
    async confirmarAtivacao() {
      const status = this.empresaSelecionada.status == 'active' ? 'disable' : 'active'
      const tenant = await AdminUpdateStatusEmpresa(this.empresaSelecionada.id, { status })
      this.$store.commit('EMPRESAS_ADMIN', { action: 'update-status', data: tenant.data })
      this.$q.notify({
        type: 'positive',
        message: 'Status alterado com sucesso.',
        position: 'top',
        progress: true,
        actions: [{
          icon: 'close',
          round: true,
          color: 'white'
        }]
      })
      this.$forceUpdate()
      this.confirm = false
    },
    editarEmpresa(tenant) {
      this.tenantSelecionado = tenant
      this.isEdit = true
      this.modalEmpresa = true
    },
    async listarUsuarios(tenant) {
      this.tenantSelecionado = tenant
      this.modalUsuario = true
    },
    filtrarEmpresa() {
      if (this.filter.length > 0) {
        this.filterEmpresas = this.empresas.filter(u => u.name.toLowerCase().indexOf(this.filter) == 0)
      } else {
        this.filterEmpresas = this.empresas
      }
    }
  },
  created() {
    this.listarEmpresas()
    this.ListarWhatsapps()
  } // ,
}
</script>

<style lang="sass" >
.my-sticky-dynamic
  /* height or max-height is important */
  height: 85vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 63px
  thead tr:first-child th
    top: 0
</style>
