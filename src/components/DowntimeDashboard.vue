<template>
  <v-row no-gutters @click="$router.push('/downtime')">
      <v-col cols="2">
          <v-progress-circular
          :rotate="-90"
          class="mt-4 ml-3"
          :value="Math.round(shifterformancereport.runtime/shifterformancereport.workingtime * 100)"
          size="120"
          width="15"
          color="#55D802"
          >
          <div class="text-center">
            <i>{{$t('production.availability')}}</i>
            <br>
            <span>{{Math.round(shifterformancereport.runtime/shifterformancereport.workingtime * 100)}}%</span>
          </div>
          </v-progress-circular>
      </v-col>
      <v-col cols="10">
          <v-charts :chartsData="downtimeChartsData"/>
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
      downtimeChartsData: {
        xData:{
          categories: [],
        },
        series: [],
        legend: {
          enabled: true,
        },
        yAxis:{
          title: {
            style:{
              color:'#fff',
            },
            text:'min',
          },
        }
      },
    }
  },
  components: {
    VCharts,
  },
  methods: {
    handleChartData(hourlydowntimereport) {
      if (hourlydowntimereport) {
        this.downtimeChartsData.xData.categories = hourlydowntimereport.map(item => item.displayHour.substr(0,5));
        this.downtimeChartsData.series =
        [{
          name: this.$t('production.runtime'),
          data: hourlydowntimereport.map(item => Math.round(item.totaldowntimeinmins*10)/10)
        }]
      }
    },
  },
  created() {
    const { hourlydowntimereport } = this;
    this.handleChartData(hourlydowntimereport);
  },
  watch: {
    async hourlydowntimereport(hourlydowntimereport) {
      await this.handleChartData(hourlydowntimereport);
      // this.$emit('getDowntime');
    },
  },
  computed: {
    ...mapState({
      shifterformancereport: state => state.production.shifterformancereport,
      hourlydowntimereport: state => state.production.hourlydowntimereport,
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
