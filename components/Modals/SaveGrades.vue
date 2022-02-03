<template>
  <v-dialog v-model="enabled" max-width="500">
    <template #activator="{ on, attrs }">
      <v-btn
        color="orange"
        elevation="2"
        outlined
        rounded
        v-bind="attrs"
        v-on="on"
        @click="
          frmMeta.status = null
          frmMeta.error = null
          getGradesData()
        "
        >Unesi ocene</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Unos ocena za {{ naziv }}</span>
        <br />
        <span>max ocena: {{ maxOcena }}</span>
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
              You have successfully saved new grades.
            </v-alert>

            <v-data-table
              :headers="[
                { text: 'id', value: 'idStudent' },
                { text: 'Ime', value: 'ime' },
                { text: 'Prezime', value: 'prezime' },
                { text: 'Ocena', value: 'ocena' },
              ]"
              :items="grades"
              :items-per-page="5"
              class="elevation-1"
            >
              <template #[`item.ocena`]="{ item }">
                <!-- v-if="item.id === editedItem.id" -->
                <ValidationProvider
                  v-slot="{ errors }"
                  :name="`Ocena${item.idStudent}`"
                  :rules="`required|numeric|min_value:0|max_value:${maxOcena}`"
                >
                  <v-text-field
                    v-if="true"
                    v-model="item.ocena"
                    single-line
                    :hide-details="true"
                    :error-messages="errors"
                    class="ma-0 pa-0"
                    style="width: 100px"
                  ></v-text-field>
                  <span v-else>{{ item.ocena }}</span>
                </ValidationProvider>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="enabled = false">
              Close
            </v-btn>
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
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

const name = 'SaveGradesModal'
const components = { ValidationObserver, ValidationProvider }
const props = {
  idAktivnost: {
    type: Number,
    required: true,
  },
  naziv: {
    type: String,
    required: true,
  },
  maxOcena: {
    type: Number,
    required: true,
  },
}

const frmDefaults = () => {
  return {
    grades: [],
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
  grades: [],
})

const methods = {
  async submit() {
    this.buttonLoading = true

    this.grades.forEach((grade) => {
      this.frm.grades.push({
        idStudent: grade.idStudent,
        ocena: grade.ocena,
      })
    })

    let res
    try {
      res = await this.$axios.$post(
        `api/course/ocene/${this.idAktivnost}`,
        this.frm.grades
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
  },

  async getGradesData() {
    try {
      const response = await this.$axios.$get(
        `api/course/ocene/${this.idAktivnost}`
      )
      this.grades = response
    } catch (err) {
      let error = err
      const status = 'error'
      // console.log(err)
      // TODO: snackbar with error
      try {
        error += ' - ' + err.response.data.message
      } catch (e) {
        error += ' - Unknown error'
      }
      this.frmMeta.error = error
      this.frmMeta.status = status
    }
  },
}

export default { name, components, props, data, methods }
</script>
