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
        <!-- 
        <p>{{ courseNaziv }}</p>
        <p>
          {{ selectedActivity }}
        </p>
        <p>
          {{ grades }}
        </p> -->
        <apex-chart-stats
          :chart-options="chartOptions"
          :series-data="seriesData"
        />
      </template>
      <template v-else>
        <p>Nema aktivnosti</p>
      </template>
    </v-container>
  </div>
</template>

<script>
import ApexChartStats from './ActivityStats/ApexChartStats.vue'

const name = 'activitiesComponent'

const components = { ApexChartStats }

const props = ['activities', 'courseNaziv']

const data = () => ({
  selectedActivity: null,
  grades: [],
  gradesCounted: [],
  gradesGraph: [],
  year: new Date().getFullYear(),
  titleText: '',
  maxOcena: 0,
  seriesData: [],
  chartOptions: {
    theme: {
      mode: 'dark',
    },
    title: {
      text: 'Grafik ocena aktivnosti',
      align: 'center',
      offsetX: 0,
      offsetY: 10,
      floating: false,
      style: {
        fontSize: '22px',
        fontWeight: 'bold',
      },
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
      // max: 0,
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

const computed = {}

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
          this.titleText = `${this.courseNaziv} - ${newVal.naziv} ${this.year}`
          this.maxOcena = newVal.maxOcena
          // this.chartOptions.title.text = this.titleText
          // this.chartOptions.xaxis.max = this.maxOcena
          // this.chartOptions = {
          //   ...this.chartOptions,
          //   ...{
          //     title: {
          //       text: this.titleText,
          //     },
          //     xaxis: {
          //       max: this.maxOcena,
          //     },
          //   },
          // }
          this.seriesData = [{ data: this.gradesGraph }]
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
.v-list-item.primary--text,
.v-application.primary--text {
  color: unset !important;
}
</style>