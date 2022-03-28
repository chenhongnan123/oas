<template>
  <div class="andon height100">
    <v-card class="mt-2">
      <v-data-table
        v-model="selectedandon"
        :headers="headers"
        :items="andonlist"
        :items-per-page="100"
        hide-default-footer
        class="elevation-1"
        height="570"
        show-select
        item-key="_id"
        :no-data-text="$t('common.notabledata')"
      >
      <template #item.starttimestamp="props">
        {{moment(props.item.starttimestamp).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
      <template #item.status="props">
        {{$t(`common.${props.item.status}`)}}
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
        color="warning" 
        :disabled="selectedandon.length === 0"
        @click="HANDLE_AUTHACTION({authaction:action.closeandon,callback:handleClose})"
        >
        {{$t('common.closebtn')}}
        </v-btn>
        <v-btn
        min-width="100"
        class="mr-3"
        color="error"
        :disabled="selectedandon.length === 0"
        @click="HANDLE_AUTHACTION({authaction:action.terminateandon,callback:handleTerminate})"
        >
        {{$t('common.terminatebtn')}}
        </v-btn>
      </div>
    </v-card>
    <AndonDialog
    :andondialog="andondialog"
    :andonreasons="andonreasons"
    @closeDialog="andondialog = false"
    />
  </div>
</template>

<script>
import moment from 'moment';
import { Dialog } from 'vant';
import { mapState, mapActions } from 'vuex';
import AndonDialog from '@/components/AndonDialog';
export default {
  name: 'Andon',
  data (){
    return {
      moment,
      headers: [
      ],
      andontypelist: [],
      andontype: '',
      andon: '',
      description: '',
      andondialog: false,
      andonreasons: [],
      selectedandon: [],
    }
  },
  components: {
    AndonDialog
  },
  computed: {
    ...mapState({
      action: state => state.setting.config.action,
      businesstime: state => state.setting.businesstime,
      machinename: state => state.setting.machinename,
      servertime: state => state.setting.servertime,
      currentplan: state => state.plan.currentplan,
      andonlist: state => state.andon.andonlist,
    }),
  },
  created() {
    this.headers = [
      {
        text: this.$t('andon.typename'),
        sortable: false,
        value: 'typename',
      },
      {
        text: this.$t('andon.comments'),
        sortable: false,
        value: 'comments',
      },
      {
        text: this.$t('andon.createdbyname'),
        sortable: false,
        value: 'createdbyname',
      },
      {
        text: this.$t('andon.starttime'),
        sortable: false,
        value: 'starttimestamp',
      },
      {
        text: this.$t('andon.duration')+'(min)',
        sortable: false,
        value: 'duration',
      },
      {
        text: this.$t('andon.status'),
        sortable: false,
        value: 'status',
      },
    ]
    this.init();
  },
  methods: {
    ...mapActions({
      GET_ANDON: 'andon/GET_ANDON',
      GET_ANDONREASONS: 'andon/GET_ANDONREASONS',
      POST_ANDON: 'andon/POST_ANDON',
      PUT_ANDON: 'andon/PUT_ANDON',
      PUT_ANDONTASK: 'andon/PUT_ANDONTASK',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
    }),
    async init() {
      const { machinename } = this;
      this.GET_ANDON(`?query=machinename==%22${machinename}%22%26%26status==%22inProgress%22`);
    },
    async add() {
      this.andondialog = true;
      const andonreasons = await this.GET_ANDONREASONS();
      if (andonreasons) {
        this.andonreasons = andonreasons;
      } else {
        this.andonreasons = [];
      }
    },
    async handleClose(operator) {
      const { servertime, selectedandon } = this;
      const { operatorid, operatorname } = operator;
      Dialog.confirm({
        title: this.$t('alert.confirminfo'),
        message: this.$t('alert.confirmclose'),
        confirmButtonText: this.$t('common.confirmbtn'),
        cancelButtonText: this.$t('common.cancelbtn'),
      }).then(async () => {
        const results = await Promise.all(selectedandon.map(async andon => {
          const payload = {
            id: andon._id,
            payload: {
              duration:Math.round((servertime - andon.starttimestamp)/100/60)/10||'-',
              closetime: moment(servertime).format('DD-MM-YYYY:hh:mm:ss'),
              colsetimestamp: servertime,
              status: 'complete',
              closedbycode: operatorid,
              closedbyname: operatorname,
            }
          }
          return await this.PUT_ANDON(payload)
        }))
        if (results.every(i => i)) {
          this.handleAndonTask();
        }
      });
    },
    async handleTerminate(operator) {
      const { servertime, selectedandon } = this;
      const { operatorid, operatorname } = operator;
      Dialog.confirm({
        title: this.$t('alert.confirminfo'),
        message: this.$t('alert.confirmterminate'),
      }).then(async () => {
        const results = await Promise.all(selectedandon.map(async andon => {
          const payload = {
            id: andon._id,
            payload: {
              duration:Math.round((servertime - andon.starttimestamp)/100/60)/10||'-',
              closetime: moment(servertime).format('DD-MM-YYYY:hh:mm:ss'),
              colsetimestamp: servertime,
              status: 'terminational',
              closedbycode: operatorid,
              closedbyname: operatorname,
            }
          }
          return await this.PUT_ANDON(payload)
        }))
        if (results.every(i => i)) {
          this.handleAndonTask();
        }
      });
    },
    async handleAndonTask() {
      const { selectedandon, machinename } = this;
      const results = await Promise.all(selectedandon.map(async andon => {
        const { id } = andon;
        const payload = {
          id: '',
          payload: {
            assetid: 0,
            status: 1
          },
          param:`?query=recordid==%22${id}%22`
        }
        return await this.PUT_ANDONTASK(payload);
      }))
      if (results.every(i => i)) {
        this.GET_ANDON(`?query=machinename==%22${machinename}%22%26%26status==%22inProgress%22`);
        this.selectedandon = [];
      }
    },
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
