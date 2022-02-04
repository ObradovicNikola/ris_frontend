<template>
  <div>
    <h1 class="text-h4">
      {{ $store.state.auth.user.ime }} {{ $store.state.auth.user.prezime }} -
      {{ $store.state.auth.user.role }}
    </h1>
    <h2 class="subtitle-1 mt-1">email: {{ $store.state.auth.user.email }}</h2>
    <v-sheet height="64" class="mt-4">
      <v-toolbar flat>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template #activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :weekdays="weekday"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateRange"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-toolbar-title> {{ selectedEvent.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="black--text">
            <div class="d-flex flex-column">
              <span>max: {{ selectedEvent.maxOcena }}</span>
              <span v-if="selectedEvent.opis"
                >Opis: {{ selectedEvent.opis }}</span
              >
              <span
                >Pocetak:
                {{ $moment(selectedEvent.start).format('HH:mm') }}
              </span>
              <span
                v-if="
                  $auth.loggedIn &&
                  $auth.user.role == 'STUDENT' &&
                  selectedEvent.ocena &&
                  selectedEvent.ocena >= 0
                "
              >
                Moja ocena: {{ selectedEvent.ocena }}
              </span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
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

const data = () => ({
  focus: '',
  type: 'month',
  typeToLabel: {
    month: 'Month',
    week: 'Week',
    day: 'Day',
  },
  weekday: [1, 2, 3, 4, 5, 6, 0],
  selectedEvent: {},
  selectedElement: null,
  selectedOpen: false,
  events: [],
  colors: [
    'blue',
    'indigo',
    'deep-purple',
    'cyan',
    'green',
    'orange',
    'grey darken-1',
  ],
})

const mounted = () => {
  // this.$refs.calendar.checkChange()
}

const methods = {
  viewDay({ date }) {
    this.focus = date
    this.type = 'day'
  },
  getEventColor(event) {
    return event.color
  },
  setToday() {
    this.focus = ''
  },
  prev() {
    this.$refs.calendar.prev()
  },
  next() {
    this.$refs.calendar.next()
  },
  showEvent({ nativeEvent, event }) {
    const open = () => {
      this.selectedEvent = event
      this.selectedElement = nativeEvent.target
      requestAnimationFrame(() =>
        requestAnimationFrame(() => (this.selectedOpen = true))
      )
    }

    if (this.selectedOpen) {
      this.selectedOpen = false
      requestAnimationFrame(() => requestAnimationFrame(() => open()))
    } else {
      open()
    }

    nativeEvent.stopPropagation()
  },
  updateRange() {
    const events = []

    this.activities.forEach((activity) => {
      events.push({
        name: activity.nazivKursa + ' - ' + activity.naziv,
        start: new Date(activity.datum * 1000),
        color: this.colors[this.rnd(0, this.colors.length - 1)],
        timed: false,

        naziv: activity.naziv,
        nazivKursa: activity.nazivKursa,
        opis: activity.opis,
        maxOcena: activity.maxOcena,
        ocena: activity.ocena,
      })
    })
    this.events = events
  },
  rnd(a, b) {
    return Math.floor((b - a + 1) * Math.random()) + a
  },
}

export default { name, middleware, asyncData, data, mounted, methods }
</script>
