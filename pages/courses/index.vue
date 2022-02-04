<template>
  <div class="home">
    <h1>All Courses</h1>

    <template v-for="course in courses">
      <v-card :key="`user-${course.idCourse}`" class="d-flex mt-5 pa-4">
        <v-container>
          <v-row>
            <v-col class="pa-0">
              <p>
                <strong>Naziv:</strong>
                <nuxt-link
                  :to="`/courses/${course.idCourse}`"
                  class="orange--text"
                  style="text-decoration: none"
                >
                  {{ course.naziv }}
                </nuxt-link>
              </p>
            </v-col>
            <v-col class="pa-0">
              <p>
                <strong>Profesor:</strong> {{ course.profesor.ime }}
                {{ course.profesor.prezime }}
              </p>
            </v-col>
          </v-row>
          <v-row>
            <p><strong>Opis:</strong> {{ course.opis }}</p>
          </v-row>
        </v-container>
      </v-card>
    </template>
  </div>
</template>

<script>
const name = 'AllCoursesPage'
const middleware = ['auth-student-and-admin']

const asyncData = async function ({ $axios }) {
  const courses = await $axios.$get('api/courses')
  return { courses }
}

export default { name, middleware, asyncData }
</script>
