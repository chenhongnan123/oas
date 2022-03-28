<template>
  <div class="plan height100">
    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="planlist"
        v-model="selectedplan"
        :items-per-page="100"
        hide-default-footer
        class="elevation-1"
        show-select
        single-select
        item-key="planid"
        selectable-key="isSelectable"
        height="570"
        :no-data-text="$t('common.notabledata')"
      >
      <template #item.scheduledstart="props">
        {{moment(props.item.scheduledstart).format('YYYY-MM-DD')}}
      </template>
      <template #item.scheduledend="props">
        {{moment(props.item.scheduledend).format('YYYY-MM-DD')}}
      </template>
      <template #item.actualstart="props">
        {{moment(props.item.actualstart).format('YYYY-MM-DD')}}
      </template>
      <template #item.status="props">
        <i :style="{backgroundColor:color[props.item.status]}"></i>
        <span>
        {{$t(`common.${props.item.status}`)}}
        </span>
      </template>
      </v-data-table>
    </v-card>
    <v-card class="mt-2 py-3">
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn
        min-width="100"
        class="mr-3"
        color="primary"
        @click="HANDLE_AUTHACTION({authaction:action.startplan,callback:startPlan})"
        :disabled="selectedplan.length === 0 || (selectedplan.length > 0 && (selectedplan[0].status === 'inProgress' || selectedplan[0].status === 'paused'))"
        >
        {{$t('plan.planstart')}}
        </v-btn>
        <v-btn
        min-width="100"
        class="mr-3"
        color="warning"
        @click="HANDLE_AUTHACTION({authaction:action.pauseplan,callback:pausePlan})"
        :disabled="selectedplan.length === 0 || (selectedplan.length > 0 && (selectedplan[0].status === 'notStarted' || selectedplan[0].status === 'paused'))"
        >
        {{$t('plan.planpause')}}
        </v-btn>
        <v-btn
        min-width="100"
        class="mr-3"
        color="warning"
        @click="HANDLE_AUTHACTION({authaction:action.restartplan,callback:restartPlan})"
        :disabled="selectedplan.length === 0 || (selectedplan.length > 0 && (selectedplan[0].status === 'notStarted') || selectedplan[0].status === 'inProgress')"
        >
        {{$t('plan.planrestart')}}
        </v-btn>
        <v-btn
        min-width="100"
        class="mr-3"
        color="error"
        @click="HANDLE_AUTHACTION({authaction:action.abortplan,callback:abortPlan})"
        :disabled="selectedplan.length === 0 || (selectedplan.length > 0 && selectedplan[0].status === 'notStarted')"
        >
        {{$t('plan.planend')}}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment';
import { Dialog } from 'vant';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'Plan',
  data (){
    return {
      moment,
      headers: [],
      selectedplan: [],
      color: {
        'inProgress': '#21c77c',
        'notStarted': '#607d8b',
        'paused': '#fb8c00',
      },
    }
  },
  computed: {
    ...mapState({
      action: state => state.setting.config.action,
      businesstime: state => state.setting.businesstime,
      machinename: state => state.setting.machinename,
      shift: state => state.setting.shift,
      servertime: state => state.setting.servertime,
      planlist: state => state.plan.planlist,
    }),
  },
  created() {
    this.headers = [
      {
        text: this.$t('plan.planid'),
        sortable: false,
        value: 'planid',
      },
      // {
      //   text: this.$t('plan.partnumber'),
      //   sortable: false,
      //   value: 'partname',
      // },
      {
        text: this.$t('plan.partname'),
        sortable: false,
        value: 'partnumber',
      },
      {
        text: this.$t('plan.partdescription'),
        sortable: false,
        value: 'partdescription',
        width: 400,
      },
      {
        text: this.$t('plan.mouldnumber'),
        sortable: false,
        value: 'moldname',
      },
      {
        text: this.$t('plan.moldlocation'),
        sortable: false,
        value: 'moldlocation',
      },
      // {
      //   text: this.$t('plan.mouldname'),
      //   sortable: false,
      //   value: 'moldname',
      // },
      {
        text: this.$t('plan.plannedquantity'),
        sortable: false,
        value: 'plannedquantity',
      },
      // {
      //   text: this.$t('plan.actualquantity'),
      //   sortable: false,
      //   value: 'actualquantity',
      // },
      // {
      //   text: this.$t('plan.scheduledstart'),
      //   sortable: false,
      //   value: 'scheduledstart',
      // },
      // {
      //   text: this.$t('plan.scheduledend'),
      //   sortable: false,
      //   value: 'scheduledend',
      // },
      // {
      //   text: this.$t('plan.actualstart'),
      //   sortable: false,
      //   value: 'actualstart',
      // },
      {
        text: this.$t('plan.status'),
        sortable: false,
        value: 'status',
        width: 100,
      },
    ]
    this.init();
  },
  methods: {
    ...mapActions({
      GET_PLANNING: 'plan/GET_PLANNING',
      PUT_PLAN: 'plan/PUT_PLAN',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
    }),
    init() {
      this.getPlan();
    },
    async getPlan() {
      const { machinename } = this;
      // const param = `?query=machinename==%22${machinename}%22`;
      const param = `?query=status==%22inProgress%22%7C%7Cstatus==%22notStarted%22%7C%7Cstatus==%22paused%22%26%26(machinename==%22${machinename}%22)&&sortquery=sortindex==1`;
      await this.GET_PLANNING(param);
      this.selectedplan = [];
    },
    startPlan(operator) {
      this.handlePlan(operator, 'inProgress', 'confirmstartplan');
    },
    pausePlan(operator) {
      this.handlePlan(operator, 'paused', 'confirmpauseplan');
    },
    restartPlan(operator) {
      this.handlePlan(operator, 'inProgress', 'confirmrestartplan');
    },
    abortPlan(operator) {
      this.handlePlan(operator, 'abort', 'confirmabortplan');
    },
    async handlePlan(operator, action, alertinfo) {
      const { operatorid, operatorname } = operator;
      const { selectedplan, servertime } = this;
      Dialog.confirm({
        title: this.$t('alert.confirminfo'),
        message: this.$t(`alert.${alertinfo}`),
        confirmButtonText: this.$t('common.confirmbtn'),
        cancelButtonText: this.$t('common.cancelbtn'),
      }).then(async () => {
        let payload = {};
        if (action === 'inProgress') {
          payload = {
            actualstart: servertime,
            startbyid: operatorid,
            startbyname: operatorname,
          };
        } else if (action === 'abort') {
          payload = {
            actualend: servertime,
            startbyid: operatorid,
            startbyname: operatorname,
          };
        }
        const postData = {
          id: '',
          payload: {
            status: action,
            ...payload
          },
          param:`?query=planid==%22${selectedplan[0].planid}%22`
        }
        const result = await this.PUT_PLAN(postData);
        if (result) {
          this.getPlan();
        }
      })
    },
  }
}
</script>
<style lang="scss">
.plan{
  .lineheight{
    line-height: 20px;
  }
  .v-data-table__checkbox{
    margin-right: 7px;
    transform: translate(0, -5px);
  }
  .v-data-table{
    th,td{
      padding: 0!important;
    }
    i{
      display: inline-block;
      vertical-align: middle;
      border-radius: 50%;
      width: 20px;
      height: 20px;
    }
  }
}
</style>
