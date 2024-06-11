<template>
  <q-dialog persistent v-model="showModal" @show="listTemplates">
    <div style="min-width: 70vw; width: 90vw">
      <q-card>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="integracao">
            <q-icon name="link" />
            <q-tab-label>
              Integração
            </q-tab-label>
          </q-tab>
          <q-tab name="documentacao">
            <q-icon name="description" />
            <q-tab-label>
              Documentação
            </q-tab-label>
          </q-tab>
        </q-tabs>
        <q-card>
        </q-card>
        <div v-show="tab === 'integracao'">
          <div class="row">
            <div class="col" style="width: 50%;">
              <q-card flat class="full-width">
                <q-card-section>
                  <q-item>
                    <q-item-section>
                      <q-select standout v-model="selectedWhatsApp" :options="whatsappOptions"
                        label="Selecionar WhatsApp" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-select standout v-model="selectedStatus" :options="statusOptions" label="Status da Venda"
                        @input="updateMessageTemplate" />
                    </q-item-section>
                  </q-item>
                  <q-btn round
                  flat
                  dense>
                  <q-icon size="2em"
                    name="mdi-emoticon-happy-outline" />
                  <q-tooltip>
                    Emoji
                  </q-tooltip>
                  <q-menu anchor="top height"
                    self="bottom middle"
                    :offset="[5, 40]">
                    <VEmojiPicker style="width: 20vw"
                      :showSearch="false"
                      :emojisByRow="7"
                      labelSearch="Localizar..."
                      lang="pt-BR"
                      @select="onInsertSelectEmoji" />
                  </q-menu>
                </q-btn>
                  <q-item>
                    <q-item-section>
                      <q-input ref="messageTemplateRef" v-model="messageTemplate" label="Template da Mensagem" placeholder="Digite o template da mensagem aqui" type="textarea" rows="12" autosize />

                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
              <div class="chip-container" style="margin-left: 1rem;">
                <q-chip v-for="variavel in variaveis" :key="variavel.label"
                  clickable @click="onInsertSelectVariable(variavel)"
                  removable v-show="(variavel.label !== 'pagamento' && variavel.label !== 'Checkout') || (isCarrinhoAbandonado && variavel.label === 'Checkout') || (!isCarrinhoAbandonado && variavel.label === 'pagamento')">
                  {{ variavel.label }}
                </q-chip>
              </div>
           </div>
            <div class="col" style="width: 40%;">
              <q-card bordered flat class="full-width">
                <!-- <div class="text-body1 text-bold q-pa-sm full-width text-center bg-grey-3">
                  Visualização
                </div> -->
                <q-card-section class="row justify-center">
                  <q-option-group class="q-mb-sm" inline dense v-model="optRadio" :options="optRadioOptions"
                    color="primary" />
                    <cMolduraCelular>
                      <q-chat-message v-if="selectedStatus && selectedStatus.trans_status_code && messageTemplate"
                        class="text-weight-medium first-message" :style="{ 'white-space': 'pre-wrap' }" v-html="messageTemplate">
                      </q-chat-message>
                    </cMolduraCelular>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div v-show="tab === 'documentacao'" style="padding: 20px;">
          <div style="max-width: 800px; margin: 0 auto;">
            <div class="col" style="width: 100%; margin-left: 2vh;">
              <q-input v-model="braipPostbackUrl" label="URL postBack" />
            </div>
            <p>A integração da Braip via postback permite que você receba notificações automáticas sobre eventos ocorridos
              em transações na plataforma Braip. Aqui está o guia passo a passo para realizar essa integração:</p>
            <ol>
              <li @click="toggleHelpVideo"><strong>Configuração da URL postback:</strong> Primeiro, você precisa
                configurar a URL do seu endpoint
                postback onde a Braip enviará as notificações. Certifique-se de que o endpoint está configurado para
                receber e processar os dados corretamente.</li>

              <!-- Vídeo de ajuda -->
              <div v-if="showHelpVideo">
                <!-- Substitua 'seu_video.mp4' pelo caminho do seu vídeo -->
                <video controls style="width: 100%;">
                  <source src="../../assets/videos/configuracao_url.mp4" type="video/mp4">
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
              <li @click="toggleHelpVideo"><strong>Configuração do webhook na plataforma Braip:</strong> Acesse a sua
                conta na plataforma Braip e
                navegue até as configurações de integração. Lá, você encontrará a opção para configurar um webhook. Insira
                a URL postback que você configurou no Passo 1 e selecione os eventos que deseja receber notificações.</li>

              <!-- Vídeo de ajuda -->
              <div v-if="showHelpVideo">
                <!-- Substitua 'seu_video.mp4' pelo caminho do seu vídeo -->
                <video controls style="width: 100%;">
                  <source src="../../assets/videos/configuracao_braip.mp4" type="video/mp4">
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
              <li @click="toggleHelpVideo"><strong>Processamento dos dados recebidos:</strong> Ao receber uma notificação
                postback da Braip, seu
                servidor deve processar os dados e tomar as ações necessárias com base nas informações recebidas.
                Certifique-se de validar os dados recebidos e realizar as operações de acordo com as regras de negócio da
                sua aplicação.</li>

              <!-- Vídeo de ajuda -->
              <div v-if="showHelpVideo">
                <!-- Substitua 'seu_video.mp4' pelo caminho do seu vídeo -->
                <video controls style="width: 100%;">
                  <source src="../../assets/videos/envio_mensagem.mp4" type="video/mp4">
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
            </ol>
            <h1>Variaveis</h1>
            <div>
  <h2>Instruções para substituir variáveis no template de mensagem:</h2>
  <p>
    Para personalizar sua mensagem, substitua as variáveis entre chaves ({{}}) pelos valores correspondentes. Por exemplo, onde estiver "{nome}", substitua pelo nome do cliente, onde estiver "{status}", substitua pelo status do pedido, e assim por diante.
  </p>
</div>
            <div>
              <p>
                <q-chip>
                {{<strong>nome</strong>}}
              </q-chip>
              -- Nome completo do comprador.
              </p>
              <p>
                <q-chip>
                {{<strong>status</strong>}}
              </q-chip>
              -- Texto descrevendo status atual da venda.
              </p>
              <p>
                <q-chip>
                {{<strong>email</strong>}}
              </q-chip>
              -- E-mail do comprador.
              </p>
              <p>
                <q-chip>
                {{<strong>email</strong>}}
              </q-chip>
              -- E-mail do comprador.
              </p>
              <p>
                <q-chip>
                {{<strong>produto</strong>}}
              </q-chip>
              -- Nome do produto.
              </p>
              <p>
                <q-chip>
                {{<strong>valor</strong>}}
              </q-chip>
              -- Valor do produto.
              </p>
              <p>
                <q-chip>
                {{<strong>qunatidade</strong>}}
              </q-chip>
              -- Quantidade de produtos comprada.
              </p>
                <q-chip>
                {{<strong>pagamento</strong>}}
              </q-chip>
              Aqui ele vai trazer as informações de pagamento ja com um texto pronto dentro. <br>
              <h3>Exemplo:</h3><br>
              <p>🧾 Forma de pagamento: Boleto <br>

              🔗 Você pode acessar o link a seguir para visualizar e imprimir o boleto: https://ev.braip.com/checkout/boleto/codigo_da_venda<br>

              💳 Código de Barras: 00000000000000000000000000000000000000000000</p>
            </div>

          </div>
        </div>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" @click="closeModal" />
          <q-btn label="Salvar" color="primary" @click="saveConfig" />
        </q-card-actions>
      </q-card>

      <q-banner color="positive" v-if="successMessage">{{ successMessage }}</q-banner>
      <q-banner color="negative" v-if="errorMessage">{{ errorMessage }}</q-banner>
    </div>
  </q-dialog>
</template>

<script>
import cMolduraCelular from 'src/components/cMolduraCelular'
import { ListarTemplates, CriarTemplates, UpdateTemplate } from '../../service/braip'
import { ListarWhatsapps } from '../../service/sessoesWhatsapp'
import { Notify } from 'quasar'
import { VEmojiPicker } from 'v-emoji-picker'
export default {
  name: 'ModalBraip',
  components: { cMolduraCelular, VEmojiPicker },

  props: {
    showModal: Boolean,
    configData: Object
  },
  data() {
    return {
      tab: 'integracao',
      selectedWhatsApp: null,
      selectedStatus: null,
      isCarrinhoAbandonado: false,
      messageTemplate: '',
      whatsappOptions: [],
      statusOptions: [
        { label: 'Aguardando Pagamento', trans_status_code: 1 },
        { label: 'Pagamento Aprovado', trans_status_code: 2 },
        { label: 'Cancelada', trans_status_code: 3 },
        { label: 'Chargeback', trans_status_code: 4 },
        { label: 'Devolvida', trans_status_code: 5 },
        { label: 'Em Análise', trans_status_code: 6 },
        { label: 'Estorno Pendente', trans_status_code: 7 },
        { label: 'Em Processamento', trans_status_code: 8 },
        { label: 'Parcialmente Pago', trans_status_code: 9 },
        { label: 'Pagamento Atrasado', trans_status_code: 10 },
        { label: 'Carrinho Abandonado', trans_status_code: 11 }
      ],
      variaveis: [
        { label: 'Nome', value: '{{nome}}' },
        { label: 'status', value: '{{status}}' },
        { label: 'email', value: '{{email}}' },
        { label: 'produto', value: '{{produto}}' },
        { label: 'valor', value: '{{valor}}' },
        { label: 'quantidade', value: '{{quantidade}}' },
        { label: 'pagamento', value: '{{pagamento}}' },
        { label: 'Checkout', value: '{{checkout_url}}' }

      ],
      optRadio: null,
      successMessage: '',
      errorMessage: '',
      templates: [],
      integrationUrl: process.env.URL_API,
      braipPostbackUrl: '',
      // Estado para controlar a visibilidade do vídeo de ajuda
      showHelpVideo: false
    }
  },
  computed: {
    optRadioOptions() {
      return []
    },
    selectedStatusCode() {
      return this.selectedStatus ? this.selectedStatus.trans_status_code : null
    },
    showPaymentChip() {
      // Verifica se o status selecionado é "carrinho abandonado"
      if (this.selectedStatus && this.selectedStatus.trans_status_code === 11) {
        // Se for "carrinho abandonado", não mostra o chip de pagamento
        return false
      } else {
        // Para qualquer outro status, mostra o chip de pagamento
        return true
      }
    }
  },
  watch: {
    showModal(newValue) {
      if (!newValue) {
        this.selectedStatus = null
        this.selectedWhatsApp = null
        this.messageTemplate = ''
        this.successMessage = ''
        this.errorMessage = ''
      }
    },
    selectedStatus(newValue) {
      if (newValue) {
        this.updateMessageTemplate()
      }
    },
    selectedStatusCode(newValue) {
      this.isCarrinhoAbandonado = newValue === 11
    }
  },
  mounted() {
    const localStorageData = JSON.parse(localStorage.getItem('usuario'))
    const tenantId = localStorageData ? localStorageData.tenantId : null
    this.braipPostbackUrl = `${process.env.URL_API}/braip-postback/${tenantId}`
  },
  methods: {
    async listTemplates() {
      try {
        if (!this.selectedStatus) {
          this.selectedStatus = this.statusOptions[0]
        }

        const response = await ListarTemplates()
        this.templates = response.data

        await this.listWhatsapps()

        const selectedTemplate = this.templates.find(template => template.trans_status_code === this.selectedStatus.trans_status_code)
        if (selectedTemplate) {
          this.messageTemplate = selectedTemplate.message
        } else {
          this.messageTemplate = ''
        }
      } catch (error) {
        console.error('Erro ao listar os templates:', error)
      }
    },
    onInsertSelectEmoji(emoji) {
      const { selectionStart, selectionEnd } = this.$refs.messageTemplateRef.$el.querySelector('textarea')
      this.messageTemplate =
        this.messageTemplate.substring(0, selectionStart) +
        emoji.data +
        this.messageTemplate.substring(selectionEnd, this.messageTemplate.length)
    },
    onInsertSelectVariable(variavel) {
      const tArea = this.$refs.messageTemplateRef.$el.querySelector('textarea')

      // Obter a posição do cursor
      const startPos = tArea.selectionStart
      const endPos = tArea.selectionEnd

      // Obter o texto atual do campo
      const currentValue = this.messageTemplate

      // Construir o novo valor com a variável selecionada
      let newValue = ''
      if (startPos !== undefined && endPos !== undefined) {
        newValue = currentValue.slice(0, startPos) + variavel.value + currentValue.slice(endPos)
      } else {
        newValue = currentValue + variavel.value
      }

      // Atualizar o template de mensagem
      this.messageTemplate = newValue

      // Mover o cursor para a posição após a variável inserida
      this.$nextTick(() => {
        const newCursorPosition = startPos + variavel.value.length
        tArea.selectionStart = newCursorPosition
        tArea.selectionEnd = newCursorPosition
      })
    },
    async listWhatsapps() {
      try {
        const response = await ListarWhatsapps()
        this.whatsappOptions = response.data.map(whatsapp => ({
          label: whatsapp.name,
          value: whatsapp.id
        }))

        this.templates.forEach(template => {
          const whatsapp = response.data.find(whatsapp => whatsapp.id === template.whatsappId)
          if (whatsapp) {
            template.whatsappName = whatsapp.name
          }
        })
      } catch (error) {
        console.error('Erro ao listar os WhatsApps:', error)
      }
    },
    async updateMessageTemplate() {
      try {
        const selectedTemplate = this.templates.find(template => template.trans_status_code === this.selectedStatus.trans_status_code)
        if (selectedTemplate) {
          if (selectedTemplate.id !== this.selectedStatus.id) {
            this.messageTemplate = selectedTemplate.message
            if (selectedTemplate.whatsappId) {
              const selectedWhatsapp = this.whatsappOptions.find(option => option.value === selectedTemplate.whatsappId)
              if (selectedWhatsapp) {
                this.selectedWhatsApp = {
                  label: selectedWhatsapp.label,
                  value: selectedWhatsapp.value
                }
              } else {
                this.selectedWhatsApp = null
              }
            } else {
              this.selectedWhatsApp = null // Se não houver WhatsApp definido, define como null
            }
          }
        } else {
          this.messageTemplate = '' // Se não houver template, limpa o campo de texto
          this.selectedWhatsApp = null // E também limpa o WhatsApp selecionado
        }
      } catch (error) {
        console.error('Erro ao atualizar template de mensagem:', error)
      }
    },
    async closeModal() {
      // Defina showModal como false para fechar o modal
      this.$emit('update:showModal', false)
    },
    async saveConfig() {
      if (!this.messageTemplate || !this.selectedWhatsApp || !this.selectedStatus) {
        // Exibe uma mensagem de erro e interrompe o processo de salvamento
        Notify.create({
          type: 'negative',
          message: 'Por favor, preencha todos os campos antes de salvar',
          progress: true,
          position: 'top'
        })
        return
      }
      const data = {
        trans_status_code: this.selectedStatus.trans_status_code,
        message: this.messageTemplate,
        // Passar apenas o ID do WhatsApp, não o objeto completo
        whatsappId: this.selectedWhatsApp ? this.selectedWhatsApp.value : null
      }
      try {
        // Verifica se é uma atualização ou uma criação
        if (this.selectedStatus && this.selectedStatus.id) {
          await UpdateTemplate(data, this.selectedStatus.id)
        } else {
          await CriarTemplates(data)
        }
        await this.listTemplates()
        this.$emit('config-saved', this.configData)
        Notify.create({
          type: 'positive',
          message: 'Configurações salvas com sucesso!',
          progress: true,
          position: 'top'
        })
        setTimeout(() => {
          this.successMessage = ''
        }, 3000)
      } catch (error) {
        console.error('Erro ao salvar o template:', error)
        Notify.create({
          type: 'negative',
          message: error.response.data.error,
          progress: true,
          position: 'top'
        })
      }
    },
    // Método para alternar a visibilidade do vídeo
    toggleHelpVideo() {
      this.showHelpVideo = !this.showHelpVideo
    }
  }
}
</script>

<style>
.first-message {
  margin-bottom: 10px;
  /* Espaçamento na parte inferior */
  margin-left: 20px;
  /* Espaçamento na lateral esquerda */
  margin-right: 20px;
  /* Espaçamento na lateral direita */
  margin-top: 50px;
  /* Posicionamento do campo acima do primeiro campo */
  .chip-container {
  display: flex;
  flex-wrap: wrap;
}

.q-item {
  /* Adicione margem inferior para evitar que os chips se sobreponham uns aos outros */
  margin-bottom: 8px;
}
}</style>
