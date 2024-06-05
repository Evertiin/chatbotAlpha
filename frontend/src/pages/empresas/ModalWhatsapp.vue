<template>
  <div>
    <q-dialog :value="modalWhatsapp" @hide="fecharModal" @show="abrirModal" key="modalWhatsapp">
      <div style="width: 700px; max-width: 80vw;">
        <q-table title="Lista Conexões" :data="listaWhatsappFilter" :columns="columns" row-key="name"
          :grid="$q.screen.xs">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="status" :props="props">
                {{ props.row.status }}
              </q-td>
              <q-td key="type" :props="props">
                {{ props.row.type }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'modalWhatsapp',
  props: {
    modalWhatsapp: {
      type: Boolean,
      default: false
    },
    listaWhatsapp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    columns() {
      return [
        {
          name: 'name',
          label: 'Nome',
          field: 'name',
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
          name: 'type',
          label: 'Canal',
          field: 'type',
          align: 'left',
          sortable: false
        }
      ]
    }
  },
  data() {
    return {
      listaWhatsappFilter: []
    }
  },
  methods: {
    async abrirModal() {
      this.listaWhatsappFilter = this.listaWhatsapp.filter(item => !item.isDeleted)
    },
    fecharModal() {
      this.$emit('update:listaWhatsapp', {})
      this.$emit('update:modalWhatsapp', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
