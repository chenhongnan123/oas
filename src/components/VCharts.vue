<template>
  <highcharts :options="data" theme="theme1"></highcharts>
</template>

<script>
export default {
  name: 'Charts',
  data(){
    return {
      data:{
        chart: {
          type: 'column',
          height:'18%',
        },
        title: {
          text: '',
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          labels: {
            rotation: -45
          }
        },
        yAxis: {
          title: {
            style:{
              color:'#fff',
            },
            // text:'Confidence[%]',
            text:'',
          },
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series: [{
          data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
        }],
        legend: {
          enabled: true,
          // layout: 'vertical',
          // align: 'right',
          // verticalAlign: 'middle',
          // itemStyle: {
          //   color: '#fff',
          // },
        },
      },
    }
  },
  props:{
    chartsData:{
      type:Object,
      required:false
    },
  },
  watch:{
    chartsData:{
      handler(newVal){
        this.data.xAxis = {
          ...this.data.xAxis,
          ...newVal.xData
        }
        this.data.yAxis = {
          ...this.data.yAxis,
          ...newVal.yAxis
        }
        this.data.series = newVal.series;
        this.data.chart = {
          ...this.data.chart,
          ...newVal.chart,
        }
        this.data.legend = {
          ...this.data.legend,
          ...newVal.legend,
        }
      },
      deep:true,
      immediate: true,
    }
  },
}
</script>
