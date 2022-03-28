<template>
  <div class="rejection height100">
    <v-card class="pl-5">
      <rejection-dashboard @getRejection="getRejection"/>
    </v-card>
    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="rejectionlist"
        :items-per-page="100"
        hide-default-footer
        class="elevation-1"
        height="430"
        dense
        v-model="selectedrejection"
        show-select
        item-key="_id"
        :no-data-text="$t('common.notabledata')"
      >
      <template #item.createdTimestamp="props">
        {{props.item.createdTimestamp.substr(11)}}
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
        @click="add"
        >
        {{$t('common.addbtn')}}
        </v-btn>
        <v-btn
        min-width="100"
        class="mr-3"
        color="error"
        :disabled="selectedrejection.length === 0"
        @click="HANDLE_AUTHACTION({authaction:action.deleterejection,callback:handleDelete})"
        >
        {{$t('common.deletebtn')}}
        </v-btn>
      </div>
    </v-card>
    <rejection-dialog
    :rejectiondialog="rejectiondialog"
    :rejectionreasons="rejectionreasons"
    @closeDialog="rejectiondialog = false"
    />
  </div>
</template>

<script>
import RejectionDialog from '@/components/RejectionDialog';
import RejectionDashboard from '../components/RejectionDashboard.vue';
import { mapState, mapActions } from 'vuex';
import { Dialog } from 'vant';
export default {
  name: 'Rejection',
  data (){
    return {
      headers: [],
      rejectiondialog: false,
      rejectionreasons: [],
      selectedrejection: [],
    }
  },
  components: {
    RejectionDialog,
    RejectionDashboard,
  },
  computed: {
    ...mapState({
      config: state => state.setting.config,
      action: state => state.setting.config.action,
      businesstime: state => state.setting.businesstime,
      machinename: state => state.setting.machinename,
      servertime: state => state.setting.servertime,
      rejectionlist: state => state.rejection.rejectionlist,
    }),
  },
  created() {
    this.headers = [
      {
        text: this.$t('rejection.createdTimestamp'),
        sortable: false,
        value: 'createdTimestamp',
      },
      {
        text: this.$t('rejection.inspectedquantity'),
        sortable: false,
        value: 'inspectedquantity',
      },
      {
        text: this.$t('rejection.quantity'),
        sortable: false,
        value: 'quantity',
      },
      {
        text: this.$t('rejection.reasonname'),
        sortable: false,
        value: 'reasonname',
      },
      {
        text: this.$t('rejection.remark'),
        sortable: false,
        value: 'remark',
      },
      {
        text: this.$t('rejection.operatorname'),
        sortable: false,
        value: 'operatorname',
      },
    ]
    this.getRejection();
  },
  methods: {
    ...mapActions({
      GET_REJECTION: 'rejection/GET_REJECTION',
      GET_REJECTIONREASONS: 'rejection/GET_REJECTIONREASONS',
      DELETE_REJECTION: 'rejection/DELETE_REJECTION',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
    }),
      
    async getRejection() {
      const { machinename, businesstime } = this;
      await this.GET_REJECTION(`?query=machinename=="${machinename}"%26%26date==${businesstime.date}%26%26shiftName=="${businesstime.shiftName}"`);
    },
    async add() {
      this.rejectiondialog = true;
      const rejectionreasons = await this.GET_REJECTIONREASONS();
      if (rejectionreasons) {
        this.rejectionreasons= rejectionreasons;
      } else {
        this.rejectionreasons = [];
      }
    },
    async handleDelete() {
      const { selectedrejection } = this;
      Dialog.confirm({
        title: this.$t('alert.confirminfo'),
        message: this.$t('alert.confirmdelete'),
        confirmButtonText: this.$t('common.confirmbtn'),
        cancelButtonText: this.$t('common.cancelbtn'),
      }).then(async () => {
        // on close
        const results = await Promise.all(selectedrejection.map(async rejection => {
          const payload = {
            id: rejection._id,
          }
          return await this.DELETE_REJECTION(payload)
        }))
        if (results.every(i => i)) {
          this.getRejection();
        }
      });
    },
  },
  watch: {
    servertime(servertime) {
      if (Math.ceil(servertime/1000) % 60 === 0) {
        this.getRejection();
      }
    },
  },
}
</script>
<style lang="scss">
.rejection{
  .lineheight{
    line-height: 20px;
  }
}
</style>
