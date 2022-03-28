<template>
  <v-row no-gutters @click="$router.push('/rejection')">
    <v-col cols="2">
      <v-progress-circular
      class="mt-4 ml-3"
      :rotate="-90"
      :value="shifterformancereport.quality"
      size="120"
      width="15"
      color="#55D802"
      >
      <div class="text-center">
        <i>{{$t('production.quality')}}</i>
        <br>
        <span>{{shifterformancereport.quality}}%</span>
      </div>
      </v-progress-circular>
    </v-col>
    <v-col cols="10">
      <v-charts :chartsData="rejectionChartsData"/>
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
      rejectionChartsData: {
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
            text:'pics',
          },
        }
      },
    }
  },
  components: {
    VCharts,
  },
  methods: {
    handleChartData(hourlyproductionreport) {
      if (hourlyproductionreport) {
        this.rejectionChartsData.xData.categories = hourlyproductionreport.map(item => item.displayHour.substr(0,5));
        this.rejectionChartsData.series =
        [{
          name:  this.$t('production.rejection'),
          data: hourlyproductionreport.map(item => Math.round(item.rejected))
        }]
      }
    },
  },
  created() {
    const { hourlyproductionreport } = this;
    this.handleChartData(hourlyproductionreport);
  },
  watch: {
    async hourlyproductionreport(hourlyproductionreport) {
      await this.handleChartData(hourlyproductionreport);
      // this.$emit('getRejection');
    },
  },
  computed: {
    ...mapState({
      shifterformancereport: state => state.production.shifterformancereport,
      hourlyproductionreport: state => state.production.hourlyproductionreport,
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
