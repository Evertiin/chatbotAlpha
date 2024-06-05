<template>
  <div>
    <q-dialog :value="modalUsuario" @hide="fecharModal" @show="abrirModal" key="modalUsers">
      <div style="width: 700px; max-width: 80vw;">
        <q-table title="Lista Usuários" :data="listaUsuarios" :columns="columns" row-key="name" :grid="$q.screen.xs">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>
              <q-td key="profile" :props="props">
                {{ props.row.profile }}
              </q-td>
              <q-td class="text-center">
                <q-btn flat round icon="mdi-lock-reset" @click="changePassword(props.row)">
                  <q-tooltip content-class="shadow-4" :offset="[10, 10]">
                    Alterar Senha
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-dialog>
    <q-dialog persistent :value="modalpassord" key="modalPassword">
      <q-card>
        <q-card-section class="q-col-gutter-sm">
          <div class="text-h6">Alterar senha</div>
        </q-card-section>
        <q-card-section class="q-col-gutter-sm">
          <div class="row">
            <div class="col-12">
              <c-input outlined v-model.trim="usuarioSelecionado.name" label="Nome" disable />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <c-input outlined v-model.trim="usuarioSelecionado.email" label="E-mail" disable />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <c-input outlined v-model="usuario.password" :validator="$v.usuario.password"
                @blur="$v.usuario.password.$touch" :type="isPwd ? 'password' : 'text'" label="Senha">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </c-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Sair" class="q-px-md q-mr-sm" @click.prevent="fecharModalPassword()" />
          <q-btn label="Salvar" class="q-px-md" color="primary" @click.prevent="updatePassword()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { AdminListarUsersBytenant } from '../../service/empresas'
import { AdminUpdateUsuarios } from '../../service/user'
import { mapGetters } from 'vuex'
export default {
  name: 'ModalUsuario',
  props: {
    modalUsuario: {
      type: Boolean,
      default: false
    },
    tenant: {
      type: Object,
      default: () => { return { id: null } }
    }
  },
  validations: {
    usuario: {
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(50)
      }
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
          label: 'Nome',
          field: 'name',
          align: 'left',
          sortable: false
        },
        {
          name: 'email',
          label: 'Email',
          field: 'cnpj',
          align: 'left',
          sortable: false
        },
        {
          name: 'profile',
          label: 'Perfil',
          field: 'profile',
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
  data() {
    return {
      isPwd: true,
      modalpassord: false,
      listaUsuarios: [],
      usuarioSelecionado: {},
      usuario: {
        password: ''
      }
    }
  },
  methods: {
    async abrirModal() {
      const { data } = await AdminListarUsersBytenant(this.tenant.id)
      this.listaUsuarios = data.users
    },
    fecharModal() {
      this.$emit('update:tenant', {})
      this.$emit('update:modalUsuario', false)
    },
    changePassword(user) {
      this.usuarioSelecionado = user
      this.modalpassord = true
    },
    async updatePassword() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const data = {
        userData: {
          email: this.usuarioSelecionado.email,
          password: this.usuario.password,
          name: this.usuarioSelecionado.name,
          profile: this.usuarioSelecionado.profile
        }
      }

      await AdminUpdateUsuarios(this.usuarioSelecionado.id, data)

      this.$q.notify({
        type: 'positive',
        message: 'Senha alterada com sucesso.',
        position: 'top',
        progress: true,
        actions: [{
          icon: 'close',
          round: true,
          color: 'white'
        }]
      })
      this.fecharModalPassword()
    },
    fecharModalPassword() {
      this.modalpassord = false
      this.usuario = {
        password: ''
      }
      this.$v.usuario.$reset()
    }
  }
}
</script>

<style lang="scss" scoped></style>
