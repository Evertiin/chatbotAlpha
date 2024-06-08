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
        <CardAguardandoPagamento/>
      </div>
      <div class="col">
        <CardPagamentoAprovado/>
      </div>
      <div class="col">
        <CardChargeback/>
      </div>
      <div class="col">
        <CardAnalise/>
      </div>
    </div>
    <h1>
    </h1>
    <div class="row">
      <div class="col">
        <card-carrinho-abandonado/>.
      </div>
      <div class="col">
        <card-devolvida/>
      </div>
      <div class="col">
        <card-estorno/>
      </div>
      <div class="col">
        <card-pagamento-atrasado/>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <card-parcialmente/>
      </div>
      <div class="col">
        <card-processamento/>
      </div>
      <div class="col">
      </div>
      <div class="col">
      </div>
    </div>
    </div>
    </template>
    </div>
</template>

<script>
import CardAguardandoPagamento from './CardAguardandoPagamento.vue'
import CardPagamentoAprovado from './CardPagamentoAprovado.vue'
import CardChargeback from './CardChargeback.vue'
import CardAnalise from './CardAnalise.vue'
import CardCarrinhoAbandonado from './CardCarrinhoAbandonado.vue'
import CardDevolvida from './CardDevolvida.vue'
import CardEstorno from './CardEstorno.vue'
import CardPagamentoAtrasado from './CardPagamentoAtrasado.vue'
import CardParcialmente from './CardParcialmente.vue'
import CardProcessamento from './CardProcessamento.vue'
export default {
  components: {
    CardAguardandoPagamento,
    CardPagamentoAprovado,
    CardChargeback,
    CardAnalise,
    CardCarrinhoAbandonado,
    CardDevolvida,
    CardEstorno,
    CardPagamentoAtrasado,
    CardParcialmente,
    CardProcessamento
  }
}

</script>
<style lang="sass">
</style>
