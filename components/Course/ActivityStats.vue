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

        <template v-if="grades && grades.length > 0">
          <client-only>
            <component
              :is="apexchart"
              height="500"
              width="800"
              type="bar"
              :options="chartOptions"
              :series="[{ data: gradesGraph }]"
              class="mb-3 d-flex justify-center align-center"
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
  gradesCounted: [],
  gradesGraph: [],
})

const computed = {
  apexchart() {
    return () => {
      if (process.client) {
        return import('vue-apexcharts')
      }
    }
  },

  chartOptions: () => {
    return {
      theme: {
        mode: 'dark',
      },
      chart: {
        height: 50,
        type: 'bar',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: true,
        },
      },
      tooltip: {
        enabled: true,
        style: {
          fontColor: 'black',
        },
      },
      dataLabels: {
        enabled: true,
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
        min: 0,
        labels: {
          style: {
            colors: 'white',
          },
        },
      },
      xaxis: {
        min: 0,
        max: () => {
          if (this.selectedActivity) {
            return this.selectedActivity.maxOcena
          } else return 0
        },
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
          this.gradesCounted = []
          this.grades.forEach((grade) => {
            this.gradesCounted[grade] = (this.gradesCounted[grade] || 0) + 1
          })
          this.gradesGraph = []
          this.gradesCounted.forEach((gradeCount, i) => {
            this.gradesGraph.push({ x: i, y: gradeCount })
          })
        })
        .catch(() => {
          // console.log(err)
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

<style>
.apexcharts-toolbar {
  z-index: 1 !important;
}
.v-list-item.primary--text {
  color: unset !important;
}
</style>