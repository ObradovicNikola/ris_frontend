<template>
  <v-app-bar app flat height="">
    <v-toolbar flat>
      <nuxt-link to="/" class="white--text" style="text-decoration: none">
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
          <template v-for="item in menuItems">
            <v-list-item
              v-if="
                item.auth == false ||
                (item.auth == true &&
                  $auth.loggedIn &&
                  $auth.user.role == item.role)
              "
              :key="item.title"
              color="info"
              :to="item.link"
            >
              <v-list-item-icon>
                <v-icon>mdi-{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
          <template v-if="$auth.loggedIn">
            <v-list-item color="info" @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-account-arrow-left</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item color="info" :to="'/login'">
              <v-list-item-icon>
                <v-icon>mdi-account-arrow-right</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item color="info" :to="'/register'">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </template>

          <!-- <template v-else>
            <v-btn to="/login" text>Login</v-btn>
            <v-btn to="/register" text>Register</v-btn>
          </template> -->
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
      icon: 'account',
      link: '/profile',
    },
    {
      auth: true,
      role: 'PROFESOR',
      title: 'Profile',
      icon: 'account',
      link: '/profile',
    },
    {
      auth: true,
      role: 'ADMIN',
      title: 'Administration',
      icon: 'account',
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

export default {
  name: 'AppHeader',
  data,
  methods,
}
</script>
