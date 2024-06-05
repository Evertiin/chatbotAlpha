<template>
  <div style="min-width: 250px;">
    <div class="row">
      <div class="col-3">
        <q-avatar class="bg-grey" v-if="selectedContact.profilePicUrl">
          <q-img :src="selectedContact.profilePicUrl" />
        </q-avatar>
        <q-icon size="50px" v-if="!selectedContact.profilePicUrl" name="mdi-account-circle" color="grey-8" />
      </div>
      <div class="col-9">
        <q-item-label class="q-mb-md text-primary" style="margin-top: 1rem;">{{ selectedContact.name }}</q-item-label>
      </div>
    </div>
    <hr />
    <q-btn full-width color="primary " style="width: 100%;margin-top: 0.5rem" @click="handleNewChat(selectedContact)"
      :disabled="!selectedContact.number">
      Conversar
    </q-btn>
  </div>
</template>

<script>
import { CriarContato } from 'src/service/contatos'
import { CriarTicket } from 'src/service/tickets'

export default {
  props: {
    vcard: String,
    oldTicket: {}
  },
  data() {
    return {
      contact: '',
      numbers: [],
      selectedContact: {
        name: '',
        number: 0,
        profilePicUrl: ''
      }
    }
  },
  methods: {
    async fetchContact(contact, number) {
      try {
        const contactObj = {
          name: contact,
          number: number[0].number.replace(/\D/g, ''),
          email: ''
        }

        const { data } = await CriarContato(contactObj)
        this.selectedContact = data
      } catch (err) {
        console.error(err)
        // Adicione a lógica de tratamento de erro aqui
      }
    },
    async handleNewChat(selectedContact) {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'))
        const data = {
          contactId: selectedContact.id,
          userId: usuario.userId,
          status: 'open',
          queueId: this.oldTicket.queueId,
          channel: this.oldTicket.channel,
          channelId: this.oldTicket.whatsappId
        }
        const ticket = await CriarTicket(data)
        this.$router.push({ name: 'chat', params: { ticketId: ticket.data.id } })
        window.location.reload()
      } catch (err) {
        console.error(err)
        // Adicione a lógica de tratamento de erro aqui
      }
    },
    getInfoVCard() {
      const array = this.vcard.split('\n')
      const obj = []
      let contact = ''
      for (let index = 0; index < array.length; index++) {
        const v = array[index]
        const values = v.split(':')
        for (let ind = 0; ind < values.length; ind++) {
          if (values[ind].indexOf('+') !== -1) {
            obj.push({ number: values[ind] })
          }
          if (values[ind].indexOf('FN') !== -1) {
            contact = values[ind + 1]
          }
        }
      }
      return { contact, number: obj }
    }
  },
  created() {
    const { contact, number } = this.getInfoVCard()
    this.fetchContact(contact, number)
  }
}
</script>

<style scoped>
/* Adicione estilos CSS conforme necessário */
</style>
