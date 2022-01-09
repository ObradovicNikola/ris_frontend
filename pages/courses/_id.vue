<template>
  <div class="home">
    <v-row class="pa-4 align-center justify-space-between">
      <h1 v-if="course">{{ course.naziv }}</h1>
      <h1 v-else>Unable to get the course.</h1>

      <template
        v-if="
          $auth.loggedIn &&
          $auth.user.role == 'STUDENT' &&
          course.upisan === true
        "
      >
        <v-btn color="error" @click="courseSignout"> Ispiši me sa kursa </v-btn>
      </template>
    </v-row>

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

      <template
        v-if="
          $auth.loggedIn &&
          ($auth.user.role == 'PROFESOR' ||
            ($auth.user.role == 'STUDENT' && course.upisan === true))
        "
      >
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
                        <v-icon
                          dark
                          color="error"
                          @click="deleteMaterial(material.naslov)"
                        >
                          mdi-close
                        </v-icon>
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
      <template v-else-if="$auth.loggedIn && $auth.user.role == 'STUDENT'">
        <course-signup-form class="mt-5" :id-course="course.idCourse" />
      </template>
    </template>
  </div>
</template>

<script>
import CourseSignupForm from '~/components/Forms/CourseSignupForm.vue'
import FileUpload from '~/components/Modals/FileUpload.vue'
const name = 'CoursePage'
const middleware = ['auth']

// get async data
const asyncData = async function ({ $axios, params }) {
  try {
    const course = await $axios.$get(`api/courses/${params.id}`)
    console.log(course)
    return { course, idCourse: params.id }
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
  async deleteMaterial(naslov) {
    try {
      console.log('hellio')
      console.log(this.idCourse)
      // localhost:8080/api/deleteFile/3/knjiga.jpg
      await this.$axios.$post(`api/deleteFile/${this.idCourse}/${naslov}`)
      // nuxt refresh
      this.$nuxt.refresh()
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

  async courseSignout() {
    try {
      await this.$axios.$post(`api/courses/signout?idCourse=${this.idCourse}`)
      // nuxt refresh
      this.$nuxt.refresh()
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
  components: { FileUpload, CourseSignupForm },
  middleware,
  asyncData,
  data,
  methods,
}
</script>