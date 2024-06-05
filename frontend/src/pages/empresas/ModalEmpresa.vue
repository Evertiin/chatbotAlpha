<template>
  <q-dialog persistent :value="modalEmpresa" @hide="fecharModal" @show="abrirModal">
    <q-card style="width: 600px; margin-top: 2rem;">
      <q-card-section class="q-col-gutter-sm">
        <div class="text-h6">Cadastrar Empresa</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <c-input outlined v-model.trim="tenant.name" :validator="$v.tenant.name" @blur="$v.tenant.name.$touch"
              label="Nome" />
          </div>
          <div class="col-12">
            <c-input outlined v-model.trim="tenant.cnpj" mask="##.###.###/####-##" label="CNPJ"
              :validator="$v.tenant.cnpj" @blur="$v.tenant.cnpj.$touch" />
          </div>
          <div class="col-12">
            <c-input outlined v-model.trim="tenant.maxUsers" mask="###" label="Máximo de Usuários"
              :validator="$v.tenant.maxUsers" @blur="$v.tenant.maxUsers.$touch" />
          </div>
          <div class="col-12">
            <c-input outlined v-model.trim="tenant.maxConnections" mask="###" label="Máximo de Conexões"
              :validator="$v.tenant.maxConnections" @blur="$v.tenant.maxConnections.$touch" />
          </div>
          <div class="col-4" style="margin-top: 0.5rem;">
            <q-toggle v-model="tenant.enableIa" label="Habilitar IA" />
          </div>
          <div class="col-8" v-if="tenant.enableIa">
            <c-input outlined v-model.trim="tenant.apiKey" :validator="$v.tenant.apiKey" label="Api Key" />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-col-gutter-sm" v-if="!isEdit">
        <div class="text-h6">Cadastrar Usuario Responsável</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <c-input outlined v-model.trim="usuario.name" :validator="$v.usuario.name" @blur="$v.usuario.name.$touch"
              label="Nome" />
          </div>
          <div class="col-12">
            <c-input outlined :validator="$v.usuario.email" @blur="$v.usuario.email.$touch" v-model.trim="usuario.email"
              label="E-mail" />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
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
        <q-btn label="Sair" class="q-px-md q-mr-sm" v-close-popup />
        <q-btn label="Salvar" class="q-px-md" color="primary" @click.prevent="handleUsuario" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { required, email, minLength, maxLength, minValue } from 'vuelidate/lib/validators'
import { CriarTenant, AdminUpdateEmpresa } from 'src/service/empresas'

export default {
  name: 'ModalEmpresa',
  props: {
    modalEmpresa: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    tenantSelecionado: {
      type: Object,
      default: () => { return { id: null } }
    }
  },
  data() {
    return {
      isPwd: true,
      tenant: {
        name: '',
        email: '',
        password: '',
        enableIa: false,
        apiKey: '',
        maxUsers: 1,
        maxConnections: 1
      },
      usuario: {
        name: '',
        email: '',
        password: '',
        profile: ''
      }
    }
  },
  validations: {
    tenant: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      cnpj: {
        required,
        minLength: minLength(18),
        maxLength: maxLength(18)
      },
      maxUsers: {
        required,
        minValue: minValue(1)
      },
      maxConnections: {
        required,
        minValue: minValue(1)
      }
    },
    usuario: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(50)
      }
    }
  },
  methods: {
    async handleUsuario() {
      if (this.tenantSelecionado.id) {
        await this.handleEdit()
      } else {
        await this.handleInsert()
      }
    },
    async handleInsert() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const { name, email, password } = this.usuario
      const { name: tenantName, cnpj, maxUsers, maxConnections, enableIa } = this.tenant
      let { apiKey } = this.tenant

      if (!enableIa) {
        apiKey = ''
      }

      const data = {
        name,
        email,
        maxUsers,
        maxConnections,
        password,
        tenantName,
        cnpj,
        enableIa,
        apiKey
      }

      const tenant = await CriarTenant(data)

      this.$store.commit('EMPRESAS_ADMIN', { action: 'add', data: tenant.data.tenant })

      this.$q.notify({
        type: 'positive',
        message: 'Empresa cadastrada com sucesso.',
        position: 'top',
        progress: true,
        actions: [{
          icon: 'close',
          round: true,
          color: 'white'
        }]
      })

      this.fecharModal()
    },
    async handleEdit() {
      if (this.$v.tenant.$invalid) {
        this.$v.tenant.$touch()
        return
      }
      const { name, cnpj, maxUsers, maxConnections, enableIa } = this.tenant
      let { apiKey } = this.tenant

      if (!enableIa) {
        apiKey = ''
      }

      const data = {
        name,
        cnpj,
        maxUsers,
        maxConnections,
        enableIa,
        apiKey
      }

      const tenant = await AdminUpdateEmpresa(this.tenantSelecionado.id, data)

      this.$store.commit('EMPRESAS_ADMIN', { action: 'update', data: tenant.data })

      this.$q.notify({
        type: 'positive',
        message: 'Empresa alterada com sucesso.',
        position: 'top',
        progress: true,
        actions: [{
          icon: 'close',
          round: true,
          color: 'white'
        }]
      })

      this.fecharModal()
    },
    abrirModal() {
      this.isPwd = true
      if (this.tenantSelecionado.id) {
        this.tenant = {
          name: this.tenantSelecionado.name,
          cnpj: this.tenantSelecionado.cnpj,
          maxUsers: this.tenantSelecionado.maxUsers,
          maxConnections: this.tenantSelecionado.maxConnections,
          enableIa: this.tenantSelecionado.enableIa,
          apiKey: this.tenantSelecionado.apiKey
        }
      }
    },
    fecharModal() {
      this.usuario = {
        name: '',
        email: '',
        password: ''
      }
      this.tenant = {
        name: '',
        cnpj: '',
        status: 'active'
      }
      this.$v.usuario.$reset()
      this.$v.tenant.$reset()
      this.$emit('update:isEdit', false)
      this.$emit('update:modalEmpresa', false)
      this.$emit('update:tenantSelecionado', {})
      this.isPwd = true
    }
  }
}

</script>
<style lang="scss" scoped></style>
