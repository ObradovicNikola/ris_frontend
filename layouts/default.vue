<template>
  <v-app color="red lighten-4">
    <app-header />
    <v-main>
      <v-container class="my-5" style="max-width: 1200px">
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <!-- <v-bottom-navigation v-model="value" :background-color="color"> -->
    <!-- hide-on-scroll -->
    <v-bottom-navigation
      :background-color="color"
      dark
      shift
      fixed
      class="d-md-none"
    >
      <v-btn exact to="/" @click="color = 'blue-grey'">
        <span>Home</span>
        <v-icon class="mx-auto">mdi-home</v-icon>
      </v-btn>

      <template v-for="item in menuItems">
        <v-btn
          v-if="
            item.auth == false ||
            (item.auth == true &&
              $auth.loggedIn &&
              $auth.user.role == item.role)
          "
          :key="item.title"
          :to="item.link"
          text
          >{{ item.title }}
        </v-btn>
      </template>
      <template v-if="$auth.loggedIn">
        <v-btn text @click="logout">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn to="/login" text>Login</v-btn>
        <v-btn to="/register" text>Register</v-btn>
      </template>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
const name = 'NuxtDefaultLayout'
const data = () => ({
  color: 'blue-grey',
  menuItems: [
    {
      auth: true,
      role: 'STUDENT',
      title: 'Courses',
      icon: 'school',
      link: '/courses',
    },
    {
      auth: true,
      role: 'ADMIN',
      title: 'Courses',
      icon: 'school',
      link: '/courses',
    },
    {
      auth: true,
      role: 'STUDENT',
      title: 'My Courses',
      icon: 'school',
      link: '/mycourses',
    },
    {
      auth: true,
      role: 'PROFESOR',
      title: 'My Courses',
      icon: 'school',
      link: '/mycourses',
    },
    {
      auth: true,
      role: 'STUDENT',
      title: 'Profile',
      icon: 'school',
      link: '/profile',
    },
    {
      auth: true,
      role: 'PROFESOR',
      title: 'Profile',
      icon: 'school',
      link: '/profile',
    },
    {
      auth: true,
      role: 'ADMIN',
      title: 'Administration',
      icon: 'school',
      link: '/admin',
    },
  ],
})

const methods = {
  logout() {
    this.$auth.logout()

    this.$router.push('/')
  },
}

export default { name, data, methods }
</script>
