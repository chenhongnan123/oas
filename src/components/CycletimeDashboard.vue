<template>
  <v-row no-gutters @click="$router.push('/cycletime')">
    <v-col cols="2">
      <v-progress-circular
      class="mt-4 ml-3"
      :rotate="-90"
      :value="shifterformancereport.performance"
      size="120"
      width="15"
      color="#55D802"
      >
      <div class="text-center">
        <i>{{$t('production.performance')}}</i>
        <br>
        <span>{{shifterformancereport.performance}}%</span>
      </div>
      </v-progress-circular>
    </v-col>
    <v-col cols="10">
      <v-charts :chartsData="productionChartsData"/>
    </v-col>
  </v-row>
</template>

<script>
import VCharts from '@/components/VCharts';
import { mapState } from 'vuex';
export default {
  name: 'DowntimeDashboard',
  data (){
    return {
      productionChartsData: {
        xData:{
          categories: [],
        },
        series: [],
        yAxis:{
          title: {
            style:{
              color:'#fff',
            },
            text:'s',
          },
        }
      },
    }
  },
  components: {
    VCharts,
  },
  methods: {
    handleChartData(hourlyproductionparameter) {
      if (hourlyproductionparameter) {
        this.productionChartsData.xData.categories = hourlyproductionparameter.map(item => item.displayHour.substr(0,5));
        this.productionChartsData.series =
        [{
          name: this.$t('cycletime.avg'),
          data: hourlyproductionparameter.map(item => Math.round(item.avg/100)/10)
        },{
          name: this.$t('cycletime.max'),
          type: 'line',
          data: hourlyproductionparameter.map(item => Math.round(item.max/100)/10)
        },{
          name: this.$t('cycletime.min'),
          type: 'line',
          data: hourlyproductionparameter.map(item => Math.round(item.min/100)/10)
        }]
      }
    },
  },
  created() {
    const { hourlyproductionparameter } = this;
    this.handleChartData(hourlyproductionparameter);
  },
  watch: {
    async hourlyproductionparameter(hourlyproductionparameter) {
      this.handleChartData(hourlyproductionparameter);
    },
  },
  computed: {
    ...mapState({
      shifterformancereport: state => state.production.shifterformancereport,
      hourlyproductionparameter: state => state.production.hourlyproductionparameter,
    }),
  }
}
</script>
<style lang="scss">
  footer{
    z-index: 99!important;
    .col{
      padding: 0;
    }
  }
  
</style>
