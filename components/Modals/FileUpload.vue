<template>
  <!-- file upload modal-->
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
          >Dodaj materijal</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Dodaj materijal {{ idCourse }}</span>
        </v-card-title>
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
            You have successfully uploaded a file.
          </v-alert>
          <!-- form with file upload -->
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
                name="Name"
                rules="required"
              >
                <v-file-input
                  v-model="frm.file"
                  label="File input"
                  outlined
                  dense
                  :error-messages="errors"
                  required
                ></v-file-input>
              </ValidationProvider>
              <div class="d-flex justify-end">
                <v-btn class="mr-4" @click="clear"> Clear </v-btn>
                <v-btn
                  type="submit"
                  :disabled="invalid"
                  :loading="buttonLoading"
                >
                  Submit
                </v-btn>
              </div>
            </form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="enabled = false">
            Close
          </v-btn>
          <v-btn color="orange darken-1" text @click="submit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
const FormData = require('form-data')

const name = 'FileUploadModal'
const components = { ValidationObserver, ValidationProvider }
// const props = ['enabled', 'idCourse']
const props = ['idCourse']

const frmDefaults = () => {
  return {
    file: '',
    // idCourse: '',
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

      fd.append('file', this.frm.file)
      fd.append('idCourse', this.idCourse)

      res = await this.$axios.$post(`api/uploadFile`, fd, config)
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
