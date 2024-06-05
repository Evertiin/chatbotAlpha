<template>
  <div class="flex justify-center" style="width: 100%;">
    <q-card class="q-my-md q-pa-sm" style="width: 100%;">
      <q-card-section class="q-pa-md">
        <div class="row q-gutter-md justify-center">
          <div class="col-xs-12 col-sm-shrink">
            <q-card
              flat
              bordered
              class="my-card full-height"
              style="max-width: 220px; background-color: #ff2a00; color: white"
            >
              <q-card-section class="text-center">
                <div class="row items-center">
                  <div class="col">
                    <p class="text-h4 text-bold text-center text-branco">
                      {{ quantidadeTenants }}
                    </p>
                    <p class="text-caption text-branco">Empresas cadastrada</p>
                  </div>
                  <div class="col">
                    <q-icon name="mdi-office-building" size="lg" color="white" class="text-white" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-shrink">
            <q-card
              flat
              bordered
              class="my-card full-height"
              style="max-width: 220px; background-color: #01c853; color: white"
            >
              <q-card-section class="text-center">
                <div class="row items-center">
                  <div class="col">
                    <p class="text-h4 text-bold text-center text-branco">
                      {{ quantidadeTenantsActive }}
                    </p>
                    <p class="text-caption text-branco">Empresas Ativas</p>
                  </div>
                  <div class="col">
                    <q-icon name="mdi-office-building" size="lg" color="white" class="text-white" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-shrink">
            <q-card
              flat
              bordered
              class="my-card full-height"
              style="max-width: 220px; background-color: #2879ff; color: white"
            >
              <q-card-section class="text-center">
                <div class="row items-center">
                  <div class="col">
                    <p class="text-h4 text-bold text-center text-branco">
                      {{ quantidadeTenants - quantidadeTenantsActive }}
                    </p>
                    <p class="text-caption text-branco">Empresas Inativas</p>
                  </div>
                  <div class="col">
                    <q-icon name="mdi-office-building" size="lg" color="white" class="text-white" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-shrink">
            <q-card
              flat
              bordered
              class="my-card full-height"
              style="max-width: 220px; background-color: #fec107; color: white"
            >
              <q-card-section class="text-center">
                <div class="row items-center">
                  <div class="col">
                    <p class="text-h4 text-bold text-center text-branco">
                      {{ quantidadeUsuarios }}
                    </p>
                    <p class="text-caption text-branco">Total de Usuarios</p>
                  </div>
                  <div class="col">
                    <q-icon name="mdi-account-multiple" size="lg" color="white" class="text-white" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-shrink">
            <q-card
              flat
              bordered
              class="my-card full-height"
              style="max-width: 220px; background-color: #fa8900; color: white"
            >
              <q-card-section class="text-center">
                <div class="row items-center">
                  <div class="col">
                    <p class="text-h4 text-bold text-center text-branco">
                      {{ mensagem }}
                    </p>
                    <p class="text-caption text-branco">Total de Mensagens</p>
                  </div>
                  <div class="col">
                    <q-icon name="mdi-forum-outline" size="lg" color="white" class="text-white" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-shrink">
            <q-card
              flat
              bordered
              class="my-card full-height"
              style="max-width: 220px; background-color: #3cff00; color: white"
            >
              <q-card-section class="text-center">
                <div class="row items-center">
                  <div class="col">
                    <p class="text-h4 text-bold text-center text-branco">
                      {{ whatsapp }}
                    </p>
                    <p class="text-caption text-branco">Total de Conexões</p>
                  </div>
                  <div class="col">
                    <q-icon name="mdi-whatsapp" size="lg" color="white" class="text-white" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { getQuantidadeTenants, getQuantidadeUsuarios, getQuantidadeTenantsActive, getMesagem, getWhatsapp } from '../../../service/dashboardEmpresas'

export default {
  data () {
    return {
      quantidadeTenants: 0,
      quantidadeUsuarios: 0,
      quantidadeTenantsActive: 0,
      mensagem: 0,
      whatsapp: 0
    }
  },
  mounted () {
    getQuantidadeTenants().then(quantidade => {
      this.quantidadeTenants = quantidade
    })
    getQuantidadeUsuarios().then(quantidade => {
      this.quantidadeUsuarios = quantidade
    })
    getQuantidadeTenantsActive().then(quantidade => {
      this.quantidadeTenantsActive = quantidade
    })
    getMesagem().then(quantidade => {
      this.mensagem = quantidade.count
    })
    getWhatsapp().then(quantidade => {
      this.whatsapp = quantidade
    }
    )
  }
}
</script>

<style scoped>
</style>
