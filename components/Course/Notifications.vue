<template>
  <div class="py-6 px-8">
    <v-container>
      <v-row class="mb-2 justify-space-between">
        <div class="pa-0">
          <h2><strong>Obavestenja:</strong></h2>
        </div>
        <div
          v-if="
            $auth.loggedIn &&
            ($auth.user.role == 'PROFESOR' || $auth.user.role == 'ADMIN')
          "
        >
          <NewNotification :id-course="idCourse" />
        </div>
      </v-row>
      <template v-if="notifications && notifications.length > 0">
        <template
          v-for="notification in notifications.sort((a, b) => {
            if (a.datum < b.datum) return 1
            if (a.datum > b.datum) return -1
            return 0
          })"
        >
          <v-row :key="notification.idObavestenje" class="flex-column">
            <v-divider class="lime lighten-2 my-4"></v-divider>
            <span class="grey--text flex-grow-1 mb-2">
              {{ $moment.unix(notification.datum).fromNow() }}
            </span>
            <span class="flex-grow-1">
              {{ notification.sadrzaj }}
            </span>
          </v-row>
        </template>
      </template>

      <template v-else>
        <v-row>
          <v-col class="pa-0">
            <p>Nema obavestenja.</p>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import NewNotification from '../Modals/NewNotification.vue'
const name = 'notificationsComponent'
const components = {
  NewNotification,
}

const props = ['idCourse', 'notifications']

const methods = {}

export default {
  name,
  components,
  props,
  methods,
}
</script>
