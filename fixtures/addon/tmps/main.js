import Vue from 'vue'
import { DmMap } from 'dotmap.js'
import config from '../config'
import plugin from './transpile'

const App = {
  name: 'App',
  components: {
    DmMap
  },
  render: function (createElement) {
    return createElement ('dm-map', {props: {
      projection: this.projection,
      withGraticule: this.withGraticule
    }
  })},
  data () {
    return {
      data: [],
      source: config.mapSource,
      projection: config.projection,
      withGraticule: config.withGraticule
    }
  },
  mounted () {
    this.load(config.dataSource)
  },
  provide () {
    const map = {data: [], world: { objects: []}}
    Object.defineProperty(map, 'data', {
       enumerable: true,
       get: () => this.data
    })
    Object.defineProperty(map, 'source', {
       enumerable: true,
       get: () => this.source
    })
    return { map }
  },
  methods: {
    load (dataSource) {
      fetch(dataSource)
        .then(response => {
          return response.json()
        })
        .then(json => {
          this.data = json
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}

Vue.config.productionTip = false

Vue.use(plugin)

new Vue({
  render: h => h(App),
}).$mount('#app')