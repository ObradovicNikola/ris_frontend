<template>
  <div>
    <h1 class="text-h4">
      {{ $store.state.auth.user.ime }} {{ $store.state.auth.user.prezime }} -
      {{ $store.state.auth.user.role }}
    </h1>
    <h2 class="subtitle-1 mt-1">email: {{ $store.state.auth.user.email }}</h2>

    <v-container class="my-4">
      <new-user />
    </v-container>

    <v-card class="mt-4">
      <v-tabs
        v-model="adminTab"
        align-with-title
        color="lime"
        background-color="grey darken-2"
      >
        <v-tabs-slider color="orange"></v-tabs-slider>

        <v-tab v-for="item in tabItems" :key="item.id">
          {{ item.text }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="adminTab" class="pa-4">
        <v-tab-item>
          <users-table :users="allUsers" />
        </v-tab-item>
        <v-tab-item>
          <users-table :users="disabledUsers" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import NewUser from '~/components/Admin/Modals/NewUser.vue'
import UsersTable from '~/components/Admin/UsersTable.vue'
const name = 'AdminPage'

const components = {
  UsersTable,
  NewUser,
}

const middleware = ['auth-and-admin']

const asyncData = async function ({ $axios, params }) {
  try {
    const allUsers = await $axios.$get('api/admin/all')
    const disabledUsers = await $axios.$get('api/admin/disabled')

    allUsers.forEach((user) => {
      user.buttonLoading = false
    })

    disabledUsers.forEach((user) => {
      user.buttonLoading = false
    })
    return { allUsers, disabledUsers }
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

const data = () => ({
  adminTab: 0,
})

const computed = {
  tabItems() {
    return [
      {
        id: 0,
        text: 'Svi korisnici',
      },
      {
        id: 1,
        text: `Onemoguceni korisnici (${this.disabledUsers.length})`,
      },
    ]
  },
}

export default {
  name,
  components,
  middleware,
  asyncData,
  data,
  computed,
}
</script>
