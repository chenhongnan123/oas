<template>
  <div class="cycletime height100">
    <v-card class="pl-5">
      <cycletime-dashboard/>
    </v-card>
    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="cyclelist"
        :items-per-page="100"
        hide-default-footer
        class="elevation-1"
        height="500"
        dense
        :no-data-text="$t('common.notabledata')"
      >
       <template #item.displayHour="props">
        {{props.item.displayHour.substr(0,5)}}
      </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import CycletimeDashboard from '../components/CycletimeDashboard.vue';
import { mapState } from 'vuex';
export default {
  name: 'Cycletime',
  data (){
    return {
      headers: [
        {
          text: '时段',
          sortable: false,
          value: 'displayHour',
        },
        {
          text: '标准周期时间(s)',
          sortable: false,
          value: 'standard',
        },
        {
          text: '平均周期时间(s)',
          sortable: false,
          value: 'avg',
        },
        {
          text: '最大周期时间(s)',
          sortable: false,
          value: 'max',
        },{
          text: '最小周期时间(s)',
          sortable: false,
          value: 'min',
        },
      ],
      cyclelist: [],
    }
  },
  components: {
    CycletimeDashboard
  },
  computed: {
    ...mapState({
      action: state => state.setting.config.action,
      machinename: state => state.setting.machinename,
      servertime: state => state.setting.servertime,
      currentplan: state => state.plan.currentplan,
      hourlyproductionparameter: state => state.production.hourlyproductionparameter,
    }),
  },
  created() {
    this.headers = [
      {
        text: this.$t('cycletime.displayhour'),
        sortable: false,
        value: 'displayHour',
      },
      {
        text: this.$t('cycletime.standard')+'(s)',
        sortable: false,
        value: 'standard',
      },
      {
        text: this.$t('cycletime.avg')+'(s)',
        sortable: false,
        value: 'avg',
      },
      {
        text: this.$t('cycletime.max')+'(s)',
        sortable: false,
        value: 'max',
      },{
        text: this.$t('cycletime.min')+'(s)',
        sortable: false,
        value: 'min',
      },
    ]
    const { hourlyproductionparameter } = this;
    this.init(hourlyproductionparameter);
  },
  methods: {
    init(hourlyproductionparameter) {
      if (hourlyproductionparameter) {
        const { currentplan } = this;
        let stdcycletime = '';
        if (currentplan.length === 0) {
          stdcycletime = '';
        } else {
          stdcycletime = currentplan[0].stdcycletime;
        }
        this.cyclelist = hourlyproductionparameter.map(item => ({
          ...item,
          standard: stdcycletime,
          avg: Math.round(item.avg/100)/10,
          max: Math.round(item.max/100)/10,
          min: Math.round(item.min/100)/10,
        }));
      }
    }
  }
}
</script>
<style lang="scss">
.downtime{
  .lineheight{
    line-height: 20px;
  }
}
</style>
