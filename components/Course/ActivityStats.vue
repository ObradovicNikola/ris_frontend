<template>
  <div class="py-6 px-8">
    <v-container>
      <v-row class="mb-2 justify-space-between">
        <div class="pa-0">
          <h2>
            <strong>Statistika ocena:</strong>
          </h2>
        </div>
      </v-row>
      <template v-if="activities && activities.length > 0">
        <v-select
          v-model="selectedActivity"
          :items="activities"
          label="Izaberite aktivnost"
          outlined
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.naziv }}
          </template>
          <template slot="item" slot-scope="data">
            {{ data.item.naziv }}
          </template>
        </v-select>

        <p>{{ selectedActivity }}</p>
        <template v-if="grades && grades.length > 0">
          <p>GRADES: {{ grades }}</p>
          <client-only>
            <component
              :is="apexchart"
              height="500"
              width="800"
              type="bar"
              :options="chartOptions"
              :series="[{ data: grades }]"
              class="mb-3"
            />
          </client-only>
        </template>
        <template v-else>
          <p>Ocene nisu pronadjenje</p>
        </template>
      </template>

      <template v-else>
        <v-row>
          <v-col class="pa-0">
            <p>Nema aktivnosti.</p>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import NewActivity from '../Modals/NewActivity.vue'
import SaveGrades from '../Modals/SaveGrades.vue'
import CancelActivityButton from './CancelActivityButton.vue'
const name = 'activitiesComponent'
const components = {
  NewActivity,
  CancelActivityButton,
  SaveGrades,
}

const props = ['activities']

const data = () => ({
  selectedActivity: null,
  grades: [],
  chartOptions: {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
      style: {
        fontWeight: 'bold',
        fontSize: '12px',
        font: '',
      },
    },
    stroke: {
      curve: 'straight',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: 'white',
        },
      },
    },
    xaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: 'white',
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-yaxis-label',
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
      },
    },
  },
})

const computed = {
  apexchart() {
    return () => {
      if (process.client) {
        return import('vue-apexcharts')
      }
    }
  },
}

const watch = {
  selectedActivity(newVal) {
    if (newVal) {
      this.$axios
        .$get(`api/course/ocene/${newVal.idAktivnost}`)
        .then((res) => {
          this.grades = []
          res.forEach((element) => {
            this.grades.push(element.ocena)
          })
          this.grades.sort()
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      this.grades = []
    }
  },
}

export default {
  name,
  components,
  props,
  data,
  computed,
  watch,
}
</script>
