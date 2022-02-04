<template>
  <div>
    <template v-if="seriesData && seriesData.length > 0">
      <client-only>
        <component
          :is="apexchart"
          height="500"
          width="800"
          type="bar"
          :options="chartOptions"
          :series="seriesData"
          class="mb-3 d-flex justify-center align-center"
        />
      </client-only>
    </template>
    <template v-else>
      <p>Ocene nisu pronadjenje</p>
    </template>
  </div>
</template>

<script>
const name = 'activitiesComponent'

const props = ['chartOptions', 'seriesData']

const computed = {
  apexchart() {
    return () => {
      if (process.client) {
        return import('vue-apexcharts')
      }
    }
  },
}

export default {
  name,
  props,
  computed,
}
</script>
