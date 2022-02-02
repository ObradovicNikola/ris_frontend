<template>
  <v-btn
    color="red"
    elevation="2"
    rounded
    class="my-2"
    style="width: 100px"
    :loading="buttonLoading"
    @click="cancelActivity"
    >Otkaži</v-btn
  >
</template>

<script>
const name = 'CancelActivityButton'

const data = () => ({
  buttonLoading: false,
})

const props = {
  idAktivnost: {
    type: Number,
    required: true,
  },
}

const methods = {
  async cancelActivity() {
    this.buttonLoading = true
    await this.$axios.post(`/api/course/activity/cancel/${this.idAktivnost}`)
    this.$nuxt.refresh()
  },
}

export default {
  name,
  props,
  data,
  methods,
}
</script>
