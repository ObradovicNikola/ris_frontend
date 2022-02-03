<template>
  <div class="py-6 px-8">
    <v-container>
      <v-row class="mb-2 justify-space-between">
        <div class="pa-0">
          <h2><strong>Aktivnosti:</strong></h2>
        </div>
        <div
          v-if="
            $auth.loggedIn &&
            ($auth.user.role == 'PROFESOR' || $auth.user.role == 'ADMIN')
          "
        >
          <NewActivity :id-course="idCourse" />
        </div>
      </v-row>
      <template v-if="activities && activities.length > 0">
        <template
          v-for="activity in activities.sort((a, b) => {
            if (a.datum < b.datum) return 1
            if (a.datum > b.datum) return -1
            return 0
          })"
        >
          <v-row :key="activity.idAktivnost" class="flex-column">
            <v-divider class="lime lighten-2 my-4"></v-divider>
            <span class="mb-1 d-flex align-center">
              <span class="mr-2">
                {{ activity.naziv }} -
                {{
                  $moment.unix(activity.datum).format('DD. MMM. YYYY. HH:mm')
                }}
              </span>
              <template
                v-if="
                  $auth.loggedIn &&
                  ($auth.user.role == 'PROFESOR' || $auth.user.role == 'ADMIN')
                "
              >
                <cancel-activity-button
                  class="mr-2"
                  :id-aktivnost="activity.idAktivnost"
                />
                <save-grades
                  :id-aktivnost="activity.idAktivnost"
                  :naziv="activity.naziv"
                  :max-ocena="activity.maxOcena"
                />
              </template>
            </span>
            <span class="grey--text text--darken-3"
              >max ocena: {{ activity.maxOcena }}</span
            >
            <span v-if="activity.opis" class="grey--text text--darken-3"
              >opis: {{ activity.opis }}</span
            >
          </v-row>
        </template>
      </template>

      <template v-else>
        <v-row>
          <v-col class="pa-0">
            <p>Nema aktivnosti.</p>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import NewActivity from '../Modals/NewActivity.vue'
import SaveGrades from '../Modals/SaveGrades.vue'
import CancelActivityButton from './CancelActivityButton.vue'
const name = 'activitiesComponent'
const components = {
  NewActivity,
  CancelActivityButton,
  SaveGrades,
}

const props = ['idCourse', 'activities']

export default {
  name,
  components,
  props,
}
</script>
