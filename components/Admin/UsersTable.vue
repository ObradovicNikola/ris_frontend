<template>
  <v-data-table
    :headers="[
      { text: 'id', value: 'idUser' },
      { text: 'Ime', value: 'ime' },
      { text: 'Prezime', value: 'prezime' },
      { text: 'Role', value: 'role' },
      { text: 'Enabled', value: 'enabled' },
      { text: 'Profile', value: 'profile', sortable: false },
    ]"
    :items="users"
    :items-per-page="5"
    class="elevation-1"
    :search="tableSearch"
  >
    <template #top>
      <v-text-field
        v-model="tableSearch"
        label="Search"
        class="mx-4"
      ></v-text-field>
    </template>
    <template #[`item.enabled`]="{ item }">
      <div class="d-flex align-centar justify-start">
        <span class="my-auto" style="width: 40px">{{ item.enabled }}</span>
        <template v-if="item.enabled">
          <v-btn
            color="success"
            style="width: 100px"
            :loading="item.buttonLoading"
            @click="enableDisableUser(item, false)"
          >
            Disable
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            color="error"
            style="width: 100px"
            :loading="item.buttonLoading"
            @click="enableDisableUser(item, true)"
          >
            Enable
          </v-btn>
        </template>
      </div>
    </template>

    <template #[`item.profile`]="{ item }">
      <nuxt-link :to="`/profile/${item.idUser}`">
        <v-icon small class="mr-2"> mdi-account-arrow-right </v-icon>
      </nuxt-link>
    </template>
  </v-data-table>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

const name = 'SaveGradesModal'
const components = { ValidationObserver, ValidationProvider }
const props = {
  users: {
    type: Array,
    required: true,
  },
}

const data = () => ({
  tableSearch: '',
  buttonLoading: false,
})

const methods = {
  async enableDisableUser(user, enabled) {
    user.buttonLoading = true
    if (enabled === true) {
      try {
        await this.$axios.$post(`api/admin/enable/${user.idUser}`)
        await this.$nuxt.refresh()
      } catch (err) {
        user.buttonLoading = false
      }
    } else {
      try {
        await this.$axios.$post(`api/admin/disable/${user.idUser}`)
        await this.$nuxt.refresh()
      } catch (err) {
        user.buttonLoading = false
      }
    }
  },
}

export default { name, components, props, data, methods }
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>