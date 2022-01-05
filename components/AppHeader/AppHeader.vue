<template>
  <v-app-bar app flat height="">
    <v-toolbar flat>
      <v-toolbar-title class="d-flex justify-start align-center">
        <v-icon large color="orange" class="mr-3"> mdi-school </v-icon>
        <span>Moodle</span>
        <span>{{$store.state.auth.user}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-none d-md-flex">
        <v-btn v-for="item in menuItems" :key="item.title" :to="item.link" text
          >{{ item.title }}
        </v-btn>
        <template v-if="$auth.loggedIn">
          <v-btn :to="'#'" text>Profile</v-btn>
          <v-btn :to="'#'" text>Logout</v-btn>
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

          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>

          <v-list-item to="/contact">
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Contact</v-list-item-title>
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
              <v-list-item-title>Logout</v-list-item-title>
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
      title: 'Home',
      icon: 'home',
      link: '/',
    },
    {
      title: 'About',
      icon: 'info',
      link: '/about',
    },
    {
      title: 'Contact',
      icon: 'email',
      link: '/contact',
    },
  ],
})

export default {
  name: 'AppHeader',
  data,
}
</script>
