<template>
  <div class="production height100">
    <v-card>
      <v-carousel
        v-if="currentplan.length > 0"
        cycle
        height="160"
        hide-delimiter-background
        show-arrows-on-hover
        :show-arrows="false"
        :interval="config.planinterval||2000"
        vertical
        :light="!$vuetify.theme.dark"
      >
        <v-carousel-item v-for="plan in currentplan" :key="plan._id">
          <div class="d-flex">
            <div style="width:40%;" class="pa-2 text-center">
              <v-row no-gutters class="text-h6 opacity7">
                <v-spacer></v-spacer>
                <v-col cols="4">{{$t('production.plan')}}</v-col>
                <v-col cols="4">{{$t('production.actual')}}</v-col>
              </v-row>
              <v-row no-gutters class="text-h6 mt-1">
                <v-col cols="4" class="opacity7">{{$t('production.quantity')}}</v-col>
                <v-col cols="4">{{(plan.plannedquantity||0)}}</v-col>
                <v-col cols="4">{{(plan.actualquantity||0)}}</v-col>
              </v-row>
              <v-row no-gutters class="text-h6 mt-1">
                <v-col cols="4" class="opacity7">{{$t('production.planstartdate')}}</v-col>
                <v-col cols="4">{{moment(plan.scheduledstart).format('YYYY-MM-DD')}}</v-col>
                <v-col cols="4">{{moment(plan.actualstart).format('YYYY-MM-DD')}}</v-col>
              </v-row>
              <v-row no-gutters class="text-h6 mt-1">
                <v-col cols="4" class="opacity7">{{$t('production.planenddate')}}</v-col>
                <v-col cols="4">{{moment(plan.scheduledend).format('YYYY-MM-DD')}}</v-col>
                <v-col cols="4">{{(plan.actualend ? moment(currentplan[0].actualend).format('YYYY-MM-DD'):'-')}}</v-col>
              </v-row>
            </div>
            <div style="width: 60%;" class="pa-2 text-h6">
              <v-row no-gutters>
                <v-col cols="2" class="opacity7">{{$t('production.planid')}}:</v-col>
                <v-col cols="2" style="font-size: 11px;">{{(plan.planid||'-')}}</v-col>
                <v-col cols="3" class="opacity7">{{$t('production.moldname')}}:</v-col>
                <v-col cols="5" class="text-truncate" style="font-size: 11px;">{{(plan.moldname||'-')}}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="2" class="opacity7">{{$t('production.partname')}}:</v-col>
                <v-col cols="2" style="font-size: 11px;">{{(plan.partnumber||'-')}}</v-col>
                <v-col cols="3" class="opacity7">{{$t('production.partdescription')}}:</v-col>
                <v-col cols="5" style="font-size: 11px;line-height:12px;">{{(plan.partdescription||'-')}}</v-col>
              </v-row>
              <v-progress-linear
              class="mt-5"
              :value="Math.round((plan.actualquantity/plan.plannedquantity*10)*10)||0"
              height="40"
              >
              <span class="text-subtitle-1">{{$t('production.plancompleted')}}:&nbsp;&nbsp;&nbsp;{{Math.round((plan.actualquantity/plan.plannedquantity*10)*10)||0}}%</span>
              </v-progress-linear>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
      <div v-else style="height:105px">{{$t('production.noplanrunning')}}</div>
    </v-card>
    <v-card class="pl-5 mt-2">
      <downtime-dashboard/>
      <cycletime-dashboard/>
      <rejection-dashboard/>
      <v-row no-gutters class="mt-2 pb-3">
        <v-col cols="3" class="text-h6 pl-10 pa-1">
          {{$t('production.oee')}}
        </v-col>
        <v-col cols="8">
          <v-progress-linear
          :value="oee"
          height="40"
          >
          {{oee}}%
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment';
import DowntimeDashboard from '../components/DowntimeDashboard.vue';
import CycletimeDashboard from '../components/CycletimeDashboard.vue';
import RejectionDashboard from '../components/RejectionDashboard.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Production',
  data (){
    return {
      moment,
    }
  },
  components: {
    DowntimeDashboard,
    CycletimeDashboard,
    RejectionDashboard,
  },
  computed: {
    ...mapState({
      config: state => state.setting.config.production,
      action: state => state.setting.config.action,
      businesstime: state => state.setting.businesstime,
      machinename: state => state.setting.machinename,
      servertime: state => state.setting.servertime,
      currentplan: state => state.plan.currentplan,
      shifterformancereport: state => state.production.shifterformancereport,
    }),
    availability() {
      const { shifterformancereport } = this;
      return Math.round(shifterformancereport.runtime/shifterformancereport.workingtime * 100);
    },
    oee() {
      const { shifterformancereport, availability } = this;
      const { performance, quality } = shifterformancereport;
      return Math.round((availability * performance * quality)/10000);
    },
  },
  methods: {
    ...mapActions({
      GETINTERVALDATA: 'production/GETINTERVALDATA',
    }),
    async init() {
      this.GETINTERVALDATA();
    },
  },
  created() {
    this.init();
  },
}
</script>
<style lang="scss">
.production{
  .v-carousel{
    line-height: 30px;
  }
  .opacity7{
    opacity: .7;
  }
}
</style>
