<template>
  <v-app-bar app flat height="">
    <v-toolbar flat>
      <nuxt-link
        to="/"
        class="white--text"
        style="text-decoration: none"
      >
        <v-toolbar-title class="d-flex justify-start align-center">
          <v-icon large color="orange" class="mr-3"> mdi-school </v-icon>
          <!-- nuxt link to home -->
          <span>Moodle</span>
          <template v-if="$store.state.auth.user">
            <span class="mx-2"> - {{ $store.state.auth.user.ime }}</span>
            <span>[ {{ $store.state.auth.user.role }} ]</span>
          </template>
        </v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-none d-md-flex">
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
          <v-btn :to="'#'" text>Profile</v-btn>
          <v-btn text @click="logout">Logout</v-btn>
        </template>
        <template v-else>
          <v-btn to="/login" text>Login</v-btn>
          <v-btn to="/register" text>Register</v-btn>
        </template>
      </v-toolbar-items>

      <v-app-bar-nav-icon
        class="d-md-none"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" app right absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="blue-grey--text text--accent-4"
        >
          <v-list-item color="info" to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="$auth.loggedIn" to="/courses">
            <v-list-item-icon>
              <v-icon>mdi-school</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Courses</v-list-item-title>
          </v-list-item>

          <template v-if="$auth.loggedIn">
            <v-list-item color="info" to="#">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>

            <v-list-item color="info" to="#">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title @click="logout">Logout</v-list-item-title>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item color="info" to="/login">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>

            <v-list-item color="info" to="/register">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
const data = () => ({
  drawer: false,
  group: null,
  menuItems: [
    {
      auth: false,
      title: 'Home',
      icon: 'home',
      link: '/',
    },
    {
      auth: true,
      role: 'STUDENT',
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
  ],
})

const methods = {
  logout() {
    this.$auth.logout()

    this.$router.push('/')
  },
}

export default {
  name: 'AppHeader',
  data,
  methods,
}
</script>
