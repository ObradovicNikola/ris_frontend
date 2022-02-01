<template>
  <div class="py-6 px-8">
    <v-container>
      <v-row class="mb-2 justify-space-between">
        <div class="pa-0">
          <h2><strong>Materijal:</strong></h2>
        </div>
        <div
          v-if="
            $auth.loggedIn &&
            ($auth.user.role == 'PROFESOR' || $auth.user.role == 'ADMIN')
          "
        >
          <file-upload :id-course="idCourse" />
        </div>
      </v-row>
      <template v-if="materials && materials.length > 0">
        <v-row>
          <v-col class="">
            <template v-for="material in materials">
              <v-row
                :key="material.idMaterial"
                class="align-center justify-space-between"
                style="max-width: 400px"
              >
                <template v-if="material.filetype === 'application/pdf'">
                  <v-icon color="orange"> mdi-file-pdf-box </v-icon>
                </template>
                <template v-else-if="material.filetype === 'image/png'">
                  <v-icon color="blue"> mdi-file-png-box </v-icon>
                </template>
                <template
                  v-else-if="
                    material.filetype === 'image/jpg' ||
                    material.filetype === 'image/jpeg'
                  "
                >
                  <v-icon color="blue"> mdi-file-jpg-box </v-icon>
                </template>
                <template v-else>
                  <v-icon color="green"> mdi-file-outline </v-icon>
                </template>
                <span
                  class="my-3 orange--text text--darken-1 flex-grow-1"
                  style="cursor: pointer; max-width: 300px"
                  @click="downloadFile(material.putanja, material.naslov)"
                >
                  {{ material.naslov }}
                </span>
                <v-btn
                  v-if="
                    $auth.loggedIn &&
                    ($auth.user.role == 'PROFESOR' ||
                      $auth.user.role == 'ADMIN')
                  "
                  fab
                  dark
                  small
                  color="grey ml-2"
                >
                  <v-icon
                    dark
                    color="error"
                    @click="$emit('deleteMaterial', material.naslov)"
                  >
                    <!-- should we use material.idMaterial here??? -->
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-row>
          <v-col class="pa-0">
            <p>Nema materijala.</p>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import FileUpload from '../Modals/FileUpload.vue'
const name = 'materialsComponent'
const components = {
  FileUpload,
}

const props = ['idCourse', 'materials']

const methods = {
  async downloadFile(putanja, filename) {
    try {
      const config = { responseType: 'blob' }

      const res = await this.$axios.$get(`${putanja}`, config)
      try {
        const url = window.URL.createObjectURL(res)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        alert('Oops! Something went wrong trying to download a file.')
      }
    } catch (err) {
      //   console.log(err)
      // TODO: snackbar with error
    }
  },
}

export default {
  name,
  components,
  props,
  methods,
}
</script>
