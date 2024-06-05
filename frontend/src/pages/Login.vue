<template>
  <div class="login-container">
    <div class="login-card-imagem">
      <img src="../assets/logoLogin/Logo NM Zap.png" class="imagem" style="align-items: center;" width="170px" height="170px" alt="imagem" />
      <div class="text-card-imagem">
        <h1 id="typing-text" style="color: #fff; font-family: 'Poppins', sans-serif; font-size: 36px; margin-top: 60px;">
          <strong>Tudo o que sua empresa precisa para <br/> <span style="color: #000000;">simplificar</span>em um único sistema</strong>
        </h1>
      </div>
      <div class="footer">
        <p style="color: #fff; font-size: 13px;">@2024 NMZAP - BY EXCLUSIVEDAY</p>
      </div>
    </div>
    <div class="login-card">
      <div class="login-content">
        <strong><h1 style="font-weight: bold;">Fazer login</h1></strong>
        <p>Adicione suas credenciais abaixo, para realizar o acesso a plataforma..</p>
        <q-input
          class="q-mb-md"
          clearable
          v-model="form.email"
          placeholder="example@email.com"
          @blur="$v.form.email.$touch"
          :error="$v.form.email.$error"
          error-message="Deve ser um e-mail válido."
          outlined
          @keypress.enter="fazerLogin"
        >
          <template v-slot:prepend>
            <q-icon
              name="mdi-email-outline"
              class="cursor-pointer"
              color='blue'
            />
          </template>
        </q-input>
        <q-input
          outlined
          v-model="form.password"
          :type="isPwd ? 'password' : 'text'"
          @keypress.enter="fazerLogin"
        >
          <template v-slot:prepend>
            <q-icon
              name="mdi-shield-key-outline"
              class="cursor-pointer"
              color='blue'
            />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              color="blue"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          class="login-button"
          style="width: 100%"
          color="blue"
          :loading="loading"
          @click="fazerLogin"
        >
          Entrar
          <span slot="loading">
            <q-spinner-puff class="on-left" />Logando...
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      modalEsqueciSenha: false,
      emailRedefinicao: null,
      form: {
        email: null,
        password: null
      },
      contasCliente: {},
      isPwd: true,
      loading: false
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required }
    },
    emailRedefinicao: { required, email }
  },
  methods: {
    fazerLogin () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Informe e-mail e senha corretamente.')
        return
      }
      this.loading = true
      this.$store.dispatch('UserLogin', this.form)
        .then(data => {
          // if (Object.keys(this.contasCliente).length == 1) {
          //   // logar direto
          // }
          this.loading = false
          // .params = { modalEscolhaUnidadeNegocio: true }
        })
        .catch(err => {
          console.error('exStore', err)
          this.loading = false
        })
    },
    clear () {
      this.form.email = ''
      this.form.password = ''
      this.$v.form.$reset()
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
/* CSS para telas maiores que 768px (desktop) */
@media (min-width: 768px) {
  .login-container {
    min-height: 100vh;
  }

  .login-card {
    max-width: 25rem;
    height: 20rem;
  }

  .login-image img {
    max-width: 100%;
    max-height: 350px;
    align-items: center;
  }
}
/* CSS para telas menores que 768px (tablet e celular) */
@media (max-width: 768px) {
  .login-card {
    max-width: 90vw;
    height: auto;
    margin: 20px;
  }

  .login-image img {
    display: none;
  }
  .login-card-imagem {
    display: none !important;
  }
  .login-image {
    display: none;
  }
  .footer {
    display: none;
  }
  .login h1 {
    display: none;
  }
  .imagem {
    display: none;
  }
  .card.q-pa-md .my-input {
    display: none;
  }
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
}

.login-card {
  padding: 20px;
  width: 80%; /* Ajuste a largura conforme necessário */
  height: 60vh;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
  margin: auto; /* Adicione esta linha para centralizar horizontalmente */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-card-imagem {
  padding: 7px;
  width: 35%; /* Ajuste a largura conforme necessário */
  height: 100vh;
  background-color: #40C726;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#typing-text {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  margin-top: 50px;
}

#typing-text strong {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #fff; /* Adiciona um cursor simulado */
  margin-right: 3px; /* Espaçamento entre o texto e o cursor */
  animation: typing 2s steps(40, end), blink-caret 0.5s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #fff;
  }
}
.login-header {
  margin-top: 0rem;
  margin-top: 0rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
}
h1 {
  font-size: 1.7rem;
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.login-button {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.login-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupar 100% da altura da viewport */
  width: 100%; /* Ocupar 100% da largura disponível */
  background-color: #ffffff; /* Defina uma cor de fundo de acordo com o design */
}

.login-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover; /* Preencher o espaço mantendo a proporção */
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  border-bottom: 1px solid #f2f2f2;
}

.card-header img {
  height: 50px;
  margin-right: 10px;
}

.card-body {
  padding: 20px;
}

.card-body h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.card-body form {
  display: flex;
  flex-direction: column;
}

.card-body form label {
  font-size: 14px;
  margin-bottom: 10px;
}

.card-body form input[type="text"] {
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
}
.card-body form input[type="email"],
.card-body form input[type="password"] {
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
}
.card.q-pa-md .my-input {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 200px;
  margin-right: 20px;
}

.card-body form button {
  background-color: #3e72af;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card-body form button:hover {
  background-color: #2e5473;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 1rem;
    padding: 5px;
  }

</style>
