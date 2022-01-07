<template>
  <div class="home">
    <h1 v-if="course">{{ course.naziv }}</h1>
    <h1 v-else>Unable to get the course.</h1>

    <v-alert v-if="status === 'error'" border="left" prominent type="error">
      {{ error }}
    </v-alert>

    <template
      v-if="
        course &&
        $auth.loggedIn &&
        ($auth.user.role == 'PROFESOR' || $auth.user.role == 'ADMIN')
      "
    >
      <v-card outlined class="mt-5 transparent">
        <v-container>
          <v-row>
            <v-btn color="orange" elevation="2" outlined rounded
              >Dodaj materijal</v-btn
            >
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
              <v-col class="pa-0">
                <v-list>
                  <v-list-tile
                    v-for="material in course.materials"
                    :key="material.idMaterial"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <nuxt-link
                          :to="`/courses/${course.idCourse}/materials/${material.idMaterial}`"
                          class="orange--text"
                          style="text-decoration: none"
                        >
                          {{ material.naziv }}
                        </nuxt-link>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
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
const name = 'CoursePage'
const middleware = ['auth']

// get async data
const asyncData = async function ({ $axios, params }) {
  try {
    const course = await $axios.$get(`api/courses/${params.id}`)
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

const data = () => ({
  error: null,
  status: null,
  course: null,
})

export default {
  name,
  middleware,
  asyncData,
  data,
}
</script>