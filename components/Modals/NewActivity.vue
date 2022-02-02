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
          >Nova aktivnost</v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Nova aktivnost</span>
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
                You have successfully created a new activity.
              </v-alert>

              <ValidationProvider
                v-slot="{ errors }"
                name="Naziv"
                rules="required|max:20|min:3"
              >
                <v-text-field
                  v-model="frm.naziv"
                  :counter="20"
                  :error-messages="errors"
                  label="Naziv"
                  required
                ></v-text-field>
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                name="Ocena"
                rules="required|numeric|max:3|min:1"
              >
                <v-text-field
                  v-model="frm.maxOcena"
                  :error-messages="errors"
                  label="Max ocena"
                  required
                ></v-text-field>
              </ValidationProvider>

              <v-menu
                ref="menu"
                v-model="datePickerMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <!-- :return-value.sync="datumAktivnostiunixTimestamp" -->
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateDisplay"
                    label="Datum"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateValue" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(dateValue)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>

              <v-container class="my-4 d-flex">
                <v-time-picker
                  v-model="time"
                  class="flex-grow-1"
                  :allowed-minutes="[
                    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
                  ]"
                  format="24hr"
                  min="6:00"
                  max="23:00"
                ></v-time-picker>
              </v-container>

              <ValidationProvider
                v-slot="{ errors }"
                name="message"
                rules="max:300"
              >
                <v-textarea
                  v-model="frm.opis"
                  :error-messages="errors"
                  outlined
                  :counter="1000"
                  name="input-7-4"
                  label="Opis (optional)"
                  value=""
                ></v-textarea>
              </ValidationProvider>
              <div class="d-flex justify-end"></div>
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
// const FormData = require('form-data')

const name = 'NewActivityModal'
const components = { ValidationObserver, ValidationProvider }
const props = {
  idCourse: {
    type: Number,
    required: true,
  },
}

const frmDefaults = () => {
  return {
    naziv: '',
    maxOcena: 10,
    // datumAktivnostiunixTimestamp: new Date(),
    datumAktivnostiunixTimestamp: new Date().getTime(),
    opis: '',
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
  dateValue: new Date().toISOString().slice(0, 10),
  // dateValue: new Date(),
  datePickerMenu: false,
  time: '7:00',
})

const computed = {
  dateDisplay() {
    // return this.dateValue.toLocaleDateString()
    // return this.dateValue.toISOString().slice(0, 10)
    return this.dateValue
  },
}

const methods = {
  async submit() {
    // await console.log(this.frm.datumAktivnostiunixTimestamp)
    this.buttonLoading = true

    let res
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      const fd = new FormData()
      // const date = this.$moment(this.dateValue + ' ' + this.time)
      // this.frm.datumAktivnostiunixTimestamp = date.unix()
      this.frm.datumAktivnostiunixTimestamp = new Date(
        this.dateValue + ' ' + this.time
      ).getTime()
      this.frm.datumAktivnostiunixTimestamp = Math.round(
        this.frm.datumAktivnostiunixTimestamp / 1000
      )

      // console.log('vreme: ' + this.time)
      // const t = this.time.split(':')
      // const timeInSeconds = (Number(t[0])) * 60 + Number(t[1]) * 1000
      // console.log('seconds: ' + timeInSeconds)
      // console.log('date' + this.frm.datumAktivnostiunixTimestamp)
      // this.frm.datumAktivnostiunixTimestamp += timeInSeconds

      Object.keys(this.frm).map((key) => fd.append(key, this.frm[key]))

      res = await this.$axios.$post(
        `api/course/${this.idCourse}/activity`,
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

export default { name, components, props, data, computed, methods }
</script>

<style>
.v-time-picker-title {
  justify-content: center !important;
}
</style>