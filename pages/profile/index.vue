<template>
  <div>
    <h1 class="text-h4">
      {{ $store.state.auth.user.ime }} {{ $store.state.auth.user.prezime }} -
      {{ $store.state.auth.user.role }}
    </h1>
    <h2 class="subtitle-1">email: {{ $store.state.auth.user.email }}</h2>
    <p>
      {{ $store.state.auth.user }}
    </p>
    <p>
      {{ activities }}
    </p>
  </div>
</template>

<script>
const name = 'ProfilePage'

const middleware = ['auth-and-not-admin']

// get async data
const asyncData = async function ({ $axios, params }) {
  try {
    const activities = await $axios.$get(`api/courses/aktivnosti`)
    // console.log(course)
    return { activities }
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

export default { name, middleware, asyncData }
</script>
