import Vue from 'vue'
import { HmMap } from 'hexamaps'
import config from '../config'
import transpile from './transpile'

const plugin = transpile()

const HmMap = Map(plugin)
const App = {
  name: 'HexaMap',
  render: function (createElement) {
    return createElement (
      HmMap,
      {props:
        {
          projection: this.projection,
          withGraticule: this.withGraticule
        }
      }
    )
  },
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
    const map = {data: [], source: ''}
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

Vue.use(plugin.entry)

new Vue({
  render: h => h(App),
}).$mount('#app')
