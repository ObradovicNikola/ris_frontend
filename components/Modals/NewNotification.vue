<template>
  <div>
    <v-dialog v-model="enabled" max-width="500">
      <template #activator="{ on, attrs }">
        <v-btn
          color="orange"
          elevation="2"
          outlined
          rounded
          v-bind="attrs"
          v-on="on"
          >Novo obavestenje</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Novo obavestenje</span>
        </v-card-title>
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
            <v-card-text>
              <v-alert
                v-if="frmMeta.status === 'error'"
                border="left"
                prominent
                type="error"
              >
                {{ frmMeta.error }}
              </v-alert>

              <v-alert
                v-if="frmMeta.status === 'submitted'"
                border="left"
                type="info"
              >
                You have successfully sent a notification.
              </v-alert>

              <ValidationProvider
                v-slot="{ errors }"
                name="message"
                rules="required|max:1000"
              >
                <v-textarea
                  v-model="frm.sadrzaj"
                  :error-messages="errors"
                  outlined
                  :counter="1000"
                  name="input-7-4"
                  label="Obavestenje"
                  value=""
                ></v-textarea>
              </ValidationProvider>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" text @click="enabled = false">
                Close
              </v-btn>
              <v-btn class="ml-3" @click="clear"> Clear </v-btn>
              <v-btn
                class="ml-3"
                type="submit"
                color="orange darken-1"
                text
                :disabled="invalid"
                :loading="buttonLoading"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
const FormData = require('form-data')

const name = 'NewNotificationModal'
const components = { ValidationObserver, ValidationProvider }
const props = {
  idCourse: {
    type: Number,
    required: true,
  },
}

const frmDefaults = () => {
  return {
    sadrzaj: '',
  }
}

const frmMetaDefaults = () => ({
  error: null,
  status: null,
})

// data
const data = () => ({
  enabled: false,
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
        `api/course/${this.idCourse}/notification`,
        fd,
        config
      )
      await this.$nuxt.refresh()
    } catch (err) {
      this.frmMeta.error = err
      this.frmMeta.status = 'error'
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
    this.$refs.observer.reset()
  },
}

export default { name, components, props, data, methods }
</script>
