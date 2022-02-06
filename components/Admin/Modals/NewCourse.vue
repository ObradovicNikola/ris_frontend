<template>
  <div>
    <v-dialog v-model="dialogEnabled" max-width="500">
      <template #activator="{ on, attrs }">
        <v-btn
          color="orange"
          elevation="2"
          outlined
          rounded
          v-bind="attrs"
          v-on="on"
          >New course</v-btn
        >
      </template>
      <v-card class="pa-4">
        <v-card-title>
          <h2 class="text-h5">New course</h2>
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
            You have successfully created a new course.
          </v-alert>
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
            <ValidationProvider
              v-slot="{ errors }"
              name="Naziv"
              rules="required|min:3"
            >
              <v-text-field
                v-model="frm.naziv"
                :error-messages="errors"
                label="Naziv"
                required
              ></v-text-field>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="message"
              rules="required|max:255"
            >
              <v-textarea
                v-model="frm.opis"
                :error-messages="errors"
                outlined
                :counter="1000"
                name="input-7-4"
                label="Opis"
                value=""
              ></v-textarea>
            </ValidationProvider>

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
                label="Sadrzaj"
                value=""
              ></v-textarea>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="Password"
              rules="required|min:7"
            >
              <v-text-field
                v-model="frm.sifra"
                type="password"
                :error-messages="errors"
                label="Password"
                required
              ></v-text-field>
            </ValidationProvider>

            <!-- solo -->
            <v-select
              v-model="frm.idProfesor"
              outlined
              label="Profesor"
              :items="profesors"
              class="mt-3"
              required
            >
              <template slot="selection" slot-scope="data">
                <!-- HTML that describe how select should render selected items -->
                {{ data.item.ime }} {{ data.item.prezime }}
              </template>
              <template slot="item" slot-scope="data">
                <!-- HTML that describe how select should render items when the select is open -->
                {{ data.item.ime }} {{ data.item.prezime }}
              </template>
            </v-select>

            <div class="d-flex justify-end">
              <v-btn class="mr-4" @click="clear"> Clear </v-btn>
              <v-btn type="submit" :disabled="invalid" :loading="buttonLoading">
                Submit
              </v-btn>
            </div>
          </form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

const name = 'RegisterPage'
const components = { ValidationObserver, ValidationProvider }

const props = {
  profesors: {
    type: Array,
    required: true,
  },
}

const frmDefaults = () => {
  return {
    naziv: '',
    opis: '',
    sadrzaj: '',
    sifra: '',
    idProfesor: '',
  }
}

const frmMetaDefaults = () => ({
  error: null,
  status: null,
})

const data = () => ({
  frm: frmDefaults(),
  frmMeta: frmMetaDefaults(),
  buttonLoading: false,
  dialogEnabled: false,
})

const methods = {
  async submit() {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    this.buttonLoading = true

    this.frm.idProfesor = this.frm.idProfesor.idUser
    try {
      await this.$axios.$post(`api/admin/newcourse`, this.frm, config)

      this.$nuxt.refresh()
    } catch (err) {
      this.frmMeta.error = err
      this.frmMeta.status = 'error'
      this.buttonLoading = false
      return
    }

    this.buttonLoading = false
    this.frmMeta.status = 'submitted'

    this.clear()
  },

  clear() {
    this.frm = frmDefaults()
    this.$refs.observer.reset()
  },
}

const mounted = function () {
  // this.frm.idProfesor = this.profesors[1]
}

export default { name, components, props, data, mounted, methods }
</script>
