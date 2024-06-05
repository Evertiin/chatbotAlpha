<template>
  <q-item
    clickable
    v-ripple
    :active="routeName == cRouterName"
    active-class="bg-blue-1 text-grey-8 text-bold menu-link-active-item-top"
    @click="navigateToRoute"
    class="houverList"
    :class="{'text-negative text-bolder': color === 'negative'}"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="color === 'negative' ? 'mdi-cellphone-nfc-off' : icon" />
      <q-avatar
        v-if="showNotification && notificationsCountProp >= 0"
        size="15px"
        color="primary"
        text-color="white"
        class="absolute-top-right"
      >
        {{ notificationsCountProp }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { EventBus } from '../store/modules/eventBus'

export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    routeName: {
      type: String,
      default: 'dashboard'
    },
    icon: {
      type: String,
      default: ''
    },
    showNotification: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      notificationsCount: 0
    }
  },
  computed: {
    cRouterName() {
      return this.$route.name
    },
    notificationsCountProp() {
      // Garante que notificationsCount seja inicializado corretamente
      return Math.max(this.notificationsCount, 0)
    }
  },
  mounted() {
    // Inicializa a contagem de notificações ao criar o componente
    this.updateNotificationsCount()

    // Escute o evento para atualizar a contagem de notificações
    EventBus.$on('nova-notificacao', this.updateNotificationsCount)
    EventBus.$on('remover-notificacao', this.updateNotificationsCount)

    // Adiciona o ouvinte do evento de armazenamento local
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeDestroy() {
    // Remova os ouvintes de eventos ao destruir o componente
    EventBus.$off('nova-notificacao', this.updateNotificationsCount)
    EventBus.$off('remover-notificacao', this.updateNotificationsCount)

    // Remove o ouvinte do evento de armazenamento local
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    navigateToRoute() {
      if (this.routeName === 'chat-interno') {
        this.$store.commit('RESET_CONTADOR_CHAT_INTERNO', this.routeName)
      } else if (this.routeName === 'atendimento') {
        this.$store.commit('RESET_CONTADOR_ATENDIMENTO')
      }
      this.$router.push({ name: this.routeName })
    },
    getNotificationsCount(routeName) {
      // Recupera a contagem de notificações do localStorage
      const notificationKey = `notificationsCount_${routeName}`
      const count = parseInt(localStorage.getItem(notificationKey)) || 0
      return count
    },
    updateNotificationsCount() {
      // Atualiza a contagem de notificações reativa
      this.notificationsCount = this.getNotificationsCount(this.routeName)
    },
    handleStorageChange(event) {
      // Verifica se a alteração ocorreu na chave específica de notificações
      if (event.key === `notificationsCount_${this.routeName}`) {
        // Atualiza a contagem de notificações
        this.updateNotificationsCount()
      }
    }
  }
}
</script>

<style lang="sass">
.menu-link-active-item-top
  border-left: 4px solid rgb(21, 120, 173)
  border-top-right-radius: 20px
  border-bottom-right-radius: 20px
  position: relative
  height: 100%

.absolute-top-right
  position: absolute
  right: 0
</style>
