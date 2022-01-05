<template>
  <div>
    <h1>Login</h1>

    <v-alert
      v-if="frmMeta.status === 'error'"
      border="left"
      prominent
      type="error"
    >
      {{ frmMeta.error }}
    </v-alert>

    <v-alert v-if="frmMeta.status === 'submitted'" border="left" type="info">
      You have successfully sent your message.
    </v-alert>

    <ValidationObserver
      v-slot="{ invalid }"
      ref="observer"
      style="max-width: 800px; margin: auto"
    >
      <form
        class="mt-5"
        style="max-width: 800px; margin: auto"
        @submit.prevent="submit"
      >
        <ValidationProvider
          v-slot="{ errors }"
          name="email"
          rules="required|email"
        >
          <v-text-field
            v-model="frm.email"
            :error-messages="errors"
            label="E-mail"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          name="Password"
          rules="required|min:7"
        >
          <v-text-field
            v-model="frm.password"
            type="password"
            :error-messages="errors"
            label="Password"
            required
          ></v-text-field>
        </ValidationProvider>

        <div class="d-flex justify-end">
          <v-btn class="mr-4" @click="clear"> Clear </v-btn>
          <v-btn type="submit" :disabled="invalid" :loading="buttonLoading">
            Submit
          </v-btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

const name = 'LoginPage'
const components = { ValidationObserver, ValidationProvider }

const frmDefaults = () => {
  return {
    email: '',
    password: '',
  }
}

const data = () => ({
  frm: frmDefaults(),
  frmMeta: frmMetaDefaults(),
  buttonLoading: false,
})

const frmMetaDefaults = () => ({
  error: null,
  status: null,
})

const methods = {
  async submit() {
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // }
    this.buttonLoading = true

    try {
      //   res = await this.$axios.$post(`api/login`, this.frm, config)
      await this.$auth.loginWith('local', {
        data: this.frm,
      })

      this.$router.push('/')
    } catch (err) {
      this.frmMeta.error = err
      this.frmMeta.status = 'error'
      this.buttonLoading = false
      return
    }

    this.buttonLoading = false
    this.frmMeta.status = 'submitted'

    // this.clear()
    this.frm.password = ''
  },

  clear() {
    this.frm = frmDefaults()
    this.$refs.observer.reset()
  },
}

export default { name, components, data, methods }
</script>
