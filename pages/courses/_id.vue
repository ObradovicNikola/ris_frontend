<template>
  <div class="home">
    <h1 v-if="course">{{ course.naziv }}</h1>
    <h1 v-else>Unable to get the course.</h1>

    <v-alert v-if="status === 'error'" border="left" prominent type="error">
      {{ error }}
    </v-alert>

    <template v-if="course">
      <v-card
        v-if="
          $auth.loggedIn &&
          ($auth.user.role == 'PROFESOR' || $auth.user.role == 'ADMIN')
        "
        outlined
        class="mt-5 transparent"
      >
        <v-container>
          <v-row>
            <file-upload :id-course="course.idCourse" />

            <v-btn color="orange" class="ml-4" elevation="2" outlined rounded
              >Promeni sifru</v-btn
            >
          </v-row>
        </v-container>
      </v-card>

      <v-card :key="`user-${course.idCourse}`" class="d-flex mt-5 pa-4">
        <v-container>
          <v-row>
            <v-col class="pa-0">
              <p><strong>Naziv:</strong> {{ course.naziv }}</p>
            </v-col>
            <v-col class="pa-0">
              <p>
                <strong>Nastavnik:</strong> {{ course.profesor.ime }}
                {{ course.profesor.prezime }}
              </p>
            </v-col>
          </v-row>
          <v-row>
            <p><strong>Opis:</strong> {{ course.opis }}</p>
          </v-row>
        </v-container>
      </v-card>

      <!-- sadrzaj course -->
      <v-card class="d-flex mt-5 pa-4">
        <v-container>
          <v-row>
            <p><strong>Sadrzaj:</strong></p>
          </v-row>
          <v-row>
            <p>{{ course.sadrzaj }}</p>
          </v-row>
        </v-container>
      </v-card>

      <!-- show course materials -->
      <template v-if="course.materials && course.materials.length > 0">
        <v-card class="d-flex mt-5 pa-4">
          <v-container>
            <v-row>
              <v-col class="pa-0">
                <p><strong>Materijal:</strong></p>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="">
                <template v-for="material in course.materials">
                  <v-row
                    :key="material.idMaterial"
                    class="align-center justify-space-between"
                    style="max-width: 400px"
                  >
                    <span
                      class="my-3 orange--text text--darken-1"
                      style="cursor: pointer; max-width: 300px"
                      @click="downloadFile(material.putanja, material.naslov)"
                    >
                      {{ material.naslov }}
                    </span>
                    <!-- <a :href="material.putanja" style="text-decoration: none">
                      {{ material.naslov }}
                    </a> -->
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
                      <v-icon dark color="error"> mdi-close </v-icon>
                    </v-btn>
                  </v-row>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </template>

      <template v-else-if="course.materials && course.materials.length === 0">
        <v-card class="d-flex mt-5 pa-4">
          <v-container>
            <v-row>
              <v-col class="pa-0">
                <p><strong>Materijal:</strong></p>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pa-0">
                <p>Nema materijala.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </template>
    </template>
  </div>
</template>

<script>
import FileUpload from '~/components/Modals/FileUpload.vue'
const name = 'CoursePage'
const middleware = ['auth']

// get async data
const asyncData = async function ({ $axios, params }) {
  try {
    const course = await $axios.$get(`api/courses/${params.id}`)
    console.log(course)
    return { course }
  } catch (err) {
    let error = err
    const status = 'error'
    console.log(err)
    try {
      error += ' - ' + err.response.data.message
    } catch (e) {
      error += ' - Unknown error'
    }

    return { error, status }
  }
}

const methods = {
  async deleteMaterial(idMaterial) {
    try {
      await this.$axios.$delete(`api/materials/${idMaterial}`)
      this.course.materials = this.course.materials.filter(
        (material) => material.idMaterial !== idMaterial
      )
    } catch (err) {
      console.log(err)
    }
  },

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
      console.log(err)
    }
  },
}

const data = () => ({
  error: null,
  status: null,
  course: null,
})

export default {
  name,
  components: { FileUpload },
  middleware,
  asyncData,
  data,
  methods,
}
</script>