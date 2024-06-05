<template>
  <div class="q-pa-md" style="max-width: 100%">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="Dashboard" label="Dashboard" />
        <q-tab name="empresas" label="Empresas" />
        <!-- <q-tab name="movies" label="Configurações" /> -->
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Dashboard" class="q-pa-none">
          <dashboard/>
        </q-tab-panel>

        <q-tab-panel name="empresas">
          <empresa/>
        </q-tab-panel>

        <!-- <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel> -->
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import empresa from './empresa.vue'
import dashboard from './dashboard/index.vue'

export default {
  data () {
    return {
      tab: 'Dashboard', // Defina o nome da guia que deseja abrir por padrão
      innerTab: 'innerMails',
      splitterModel: 20
    }
  },
  components: {
    empresa,
    dashboard
  }
}
</script>
