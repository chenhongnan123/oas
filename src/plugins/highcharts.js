import Vue from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import HighchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
// Highcharts.theme = {
//   colors: ['#55D802', '#FFA100', '#FF3800', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
//   chart: {
//     backgroundColor: null,
//     style: {
//       fontFamily: 'Poppins',
//     },
//   },
//   credits: {
//     enabled: false,
//   },
//   xAxis: {
//     labels: {
//       style: {
//         // color: '#fff',
//         "font-size":12,
//       },
//       // y:30
//     }
//   },
//   yAxis: {
//     labels: {
//       style: {
//         // color: '#fff',
//         "font-size":12,
//       },
//       // y:10
//     },
    
//   },
//   legend: {
//     enabled: true,
//     layout: 'vertical',
//     align: 'right',
//     verticalAlign: 'middle',
//     itemStyle: {
//       // color: '#fff',
//       // width:100,
//       // fontSize:20,
//       // padding:120,
//       // transform:'translateY(-5px)'
//     },
//     // symbolPadding: 20,
//     // x:-20,
//     // symbolHeight:30,
//   },
//   // tooltip: {
//   //   shared: true,
//   //   useHTML: true,
//   //   headerFormat: '<small style="font-size:20px;">{point.key}</small><table  style="font-size:20px;">',
//   //   pointFormat: '<tr><td style="color: {series.color};font-size:20px;">{series.name}: </td>' +
//   //   '<td style="text-align: right;font-size:20px;"><b>{point.y}</b></td></tr>',
//   //   footerFormat: '</table>',
//   //   // style: {
//   //   //   fontWeight: 'bold',
//   //   //   fontSize:40,
//   //   //   lineHeight:60
//   //   // },
//   //   padding:20
//   // },
//   plotOptions: {
//     column: {
//         dataLabels: {
//             enabled: true,
//             style:{
//               fontSize:12,
//               // color:'#fff'
//             }
//         }
//     }
//   },
// };
Highcharts.theme1 = {
  colors: ['#55D802', '#FFA100', '#FF3800', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Poppins',
    },
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    labels: {
      style: {
        color: '#1976d2',
        "font-size":12,
      },
    }
  },
  yAxis: {
    labels: {
      style: {
        color: '#1976d2',
        "font-size":12,
      },
    },
    
  },
  legend: {
    enabled: true,
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    itemStyle: {
      color: '#1976d2',
    },
  },
  plotOptions: {
    column: {
        dataLabels: {
          enabled: true,
          // rotation: 45,
          // y:-20,
          style:{
            fontSize:12,
            color:'#1976d2'
          }
        }
    }
  },
};

Highcharts.setOptions(Highcharts.theme1);
HighchartsMore(Highcharts);
solidGauge(Highcharts);
Vue.use(HighchartsVue);
