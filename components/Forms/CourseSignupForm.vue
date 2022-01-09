<template>
  <v-card class="pa-4">
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

    <span class="mx-2 text-h4"> Upiši kurs </span>

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
          name="Password"
          rules="required|min:7"
        >
          <v-text-field
            v-model="frm.sifra"
            :error-messages="errors"
            label="Password"
            required
          ></v-text-field>
        </ValidationProvider>

        <div class="d-flex justify-end mt-4">
          <v-btn
            class="mr-4"
            text
            color="grey"
            @click="
              clear()
              $refs.observer.reset()
            "
          >
            Clear
          </v-btn>
          <v-btn
            type="submit"
            class="grey"
            color="orange"
            text
            :disabled="invalid"
            :loading="buttonLoading"
          >
            Submit
          </v-btn>
        </div>
      </form>
    </ValidationObserver>
  </v-card>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
const FormData = require('form-data')

const name = 'CourseSignupForm'
const components = { ValidationObserver, ValidationProvider }

const frmDefaults = () => {
  return {
    sifra: '',
  }
}

const frmMetaDefaults = () => ({
  error: null,
  status: null,
})

const props = {
  idCourse: {
    type: Number,
    required: true,
  },
}

const data = () => ({
  frm: frmDefaults(),
  frmMeta: frmMetaDefaults(),
  buttonLoading: false,
})

const methods = {
  async submit() {
    this.buttonLoading = true

    let res
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const fd = new FormData()

      Object.keys(this.frm).map((key) => fd.append(key, this.frm[key]))

      res = await this.$axios.$post(
        `api/courses/signup?idCourse=${this.idCourse}`,
        fd,
        config
      )
      await this.$nuxt.refresh()
    } catch (err) {
      this.frmMeta.error = err
      this.frmMeta.status = 'error'
      try {
        this.frmMeta.error += ' - ' + err.response.data.message
      } catch (e) {
        this.frmMeta.error += ' - Unknown error'
      }
      this.buttonLoading = false
      return
    }
    this.response = res

    this.buttonLoading = false
    this.frmMeta.status = 'submitted'

    this.clear()
  },
  clear() {
    this.frm = frmDefaults()
  },
}

export default { name, components, props, data, methods }
</script>
