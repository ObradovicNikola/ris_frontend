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
  </div>
</template>

<script>
const name = 'ProfilePage'
export default { name }
</script>
