  <template>
    <div class="q-pa-md">
        <template>
            <q-input color="blue-12" v-model="text" label="Pesquisar templates">
        <template v-slot:prepend>
        <q-icon name="search" />
        </template>
    </q-input>
        </template>

    <template>
        <div class="col-4 col-md-6">
            <h1> </h1>
            <div class="row">
      <div class="col">
        <Cards/>
      </div>
      <div class="col">
        <CardsPagamentoAprovado/>
      </div>
      <div class="col">
        <Cards/>
      </div>
      <div class="col">
        <Cards/>
      </div>
    </div>
    <h1>
    </h1>
    <div class="row">
      <div class="col">
        <Cards/>
      </div>
      <div class="col">
        <Cards/>
      </div>
      <div class="col">
        <Cards/>
      </div>
      <div class="col">
        <Cards/>
      </div>
    </div>
    </div>
    </template>
    </div>
</template>

<script>
import Cards from './Cards.vue'
import CardsPagamentoAprovado from './CardPagamentoAprovado.vue'
export default {
  components: {
    Cards,
    CardsPagamentoAprovado
  }
}

</script>
<style lang="sass">
</style>
