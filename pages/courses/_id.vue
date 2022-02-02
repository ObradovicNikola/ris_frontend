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
        <v-btn
          color="error"
          :loading="ispisButtonLoading"
          @click="courseSignout"
        >
          Ispiši me sa kursa
        </v-btn>
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
            <!-- <file-upload :id-course="course.idCourse" /> -->

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
            $auth.user.role == 'ADMIN' ||
            ($auth.user.role == 'STUDENT' && course.upisan === true))
        "
      >
        <v-card class="mt-5">
          <v-tabs
            v-model="courseTab"
            align-with-title
            color="lime"
            background-color="grey"
          >
            <v-tabs-slider color="orange"></v-tabs-slider>

            <v-tab v-for="item in tabItems" :key="item.id">
              {{ item.text }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="courseTab">
            <v-tab-item>
              <!-- show course materials -->
              <Materials
                :id-course="course.idCourse"
                :materials="course.materials"
                @deleteMaterial="deleteMaterialWithNaslov($event)"
              />
            </v-tab-item>
            <v-tab-item>
              <Notifications
                :id-course="course.idCourse"
                :notifications="course.notifications"
              />
            </v-tab-item>

            <v-tab-item>
              <Activities
                :id-course="course.idCourse"
                :activities="course.activities"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
      <template v-else-if="$auth.loggedIn && $auth.user.role == 'STUDENT'">
        <course-signup-form class="mt-5" :id-course="course.idCourse" />
      </template>
    </template>
  </div>
</template>

<script>
import Activities from '~/components/Course/Activities.vue'
import Materials from '~/components/Course/Materials.vue'
import Notifications from '~/components/Course/Notifications.vue'
import CourseSignupForm from '~/components/Forms/CourseSignupForm.vue'
import FileUpload from '~/components/Modals/FileUpload.vue'
const name = 'CoursePage'
const middleware = ['auth']
const components = {
  Materials,
  Notifications,
  Activities,
  CourseSignupForm,
  FileUpload,
}

// get async data
const asyncData = async function ({ $axios, params }) {
  try {
    const course = await $axios.$get(`api/courses/${params.id}`)
    // console.log(course)
    return { course, idCourse: params.id }
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

    return { error, status }
  }
}

const methods = {
  async deleteMaterialWithNaslov(naslov) {
    try {
      // localhost:8080/api/deleteFile/3/knjiga.jpg
      await this.$axios.$post(`api/deleteFile/${this.idCourse}/${naslov}`)
      // nuxt refresh
      this.$nuxt.refresh()
    } catch (err) {
      // console.log(err)
      // TODO: snackbar with error
    }
  },

  async courseSignout() {
    this.ispisButtonLoading = true
    try {
      await this.$axios.$post(`api/courses/signout?idCourse=${this.idCourse}`)
      // nuxt refresh
      this.$nuxt.refresh()
    } catch (err) {
      // console.log(err)
      // TODO: snackbar with error
    }
    this.ispisButtonLoading = false
  },
}

const data = () => ({
  error: null,
  status: null,
  course: null,
  tabItems: [
    { id: 1, text: 'Materijal', value: 'materials' },
    { id: 2, text: 'Obavestenja', value: 'notifications' },
    { id: 3, text: 'Aktivnosti', value: 'activities' },
  ],
  courseTab: 0,
  ispisButtonLoading: false,
})

export default {
  name,
  components,
  middleware,
  asyncData,
  data,
  methods,
}
</script>