<template>
  <div>
    <h1 class="text-h4">
      {{ $store.state.auth.user.ime }} {{ $store.state.auth.user.prezime }} -
      {{ $store.state.auth.user.role }}
    </h1>
    <h2 class="subtitle-1 mt-1">email: {{ $store.state.auth.user.email }}</h2>

    <v-container class="my-4 d-flex">
      <new-user />
      <new-course class="ml-4" :profesors="profesors" />
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
        <v-tab-item>
          <v-btn
            color="info"
            elevation="2"
            outlined
            rounded
            @click="downloadFile('profesori', 'profesori.pdf')"
            >Svi profesori izvestaj</v-btn
          >

          <v-select
            v-model="selectedCourse"
            :items="courses"
            label="Izaberite kurs"
            outlined
            dense
            hide-details
            class="mt-7"
            style="max-width: 300px"
          >
            <template slot="selection" slot-scope="data">
              {{ data.item.naziv }}
            </template>
            <template slot="item" slot-scope="data">
              {{ data.item.naziv }}
            </template>
          </v-select>

          <v-btn
            color="info"
            elevation="2"
            outlined
            rounded
            class="mt-3"
            @click="
              downloadFile(
                `kurs/${selectedCourse.idCourse}`,
                `${selectedCourse.naziv}.pdf`
              )
            "
            >Kurs izvestaj</v-btn
          >
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import NewCourse from '~/components/Admin/Modals/NewCourse.vue'
import NewUser from '~/components/Admin/Modals/NewUser.vue'
import UsersTable from '~/components/Admin/UsersTable.vue'
const name = 'AdminPage'

const components = {
  UsersTable,
  NewUser,
  NewCourse,
}

const middleware = ['auth-and-admin']

const asyncData = async function ({ $axios, params }) {
  try {
    const allUsers = await $axios.$get('api/admin/all')
    const disabledUsers = await $axios.$get('api/admin/disabled')
    const profesors = await $axios.$get('api/admin/profesors')
    const courses = await $axios.$get('api/courses')

    allUsers.forEach((user) => {
      user.buttonLoading = false
    })

    disabledUsers.forEach((user) => {
      user.buttonLoading = false
    })
    return { allUsers, disabledUsers, profesors, courses }
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
  selectedCourse: null,
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
      {
        id: 2,
        text: 'Izvestaji',
      },
    ]
  },
}

const created = function () {
  this.selectedCourse = this.courses[0]
}

const methods = {
  async downloadFile(putanja, filename) {
    try {
      const config = { responseType: 'blob' }

      const res = await this.$axios.$get(
        `api/admin/izvestaj/${putanja}`,
        config
      )
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
  middleware,
  asyncData,
  data,
  computed,
  created,
  methods,
}
</script>

<style>
.v-application.primary--text {
  color: unset !important;
}
</style>