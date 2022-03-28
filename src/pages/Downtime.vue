<template>
  <div class="downtime height100">
    <v-card class="pl-5">
      <downtime-dashboard @getDowntime="getDowntime"/>
    </v-card>
    <v-card class="mt-2">
      <v-data-table
        :headers="headers"
        :items="downtimelist"
        :items-per-page="100"
        v-model="selecteddowntimelist"
        show-select
        item-key="_id"
        hide-default-footer
        class="elevation-1"
        height="430"
        dense
        :no-data-text="$t('common.notabledata')"
      >
        <template #item.downtimestart="props">
          {{moment(props.item.downtimestart).format('HH:mm:ss')}}
        </template>
        <template #item.downtimeend="props">
          {{props.item.downtimeend ? moment(props.item.downtimeend).format('HH:mm:ss') : '-'}}
        </template>
        <template #item.downtimeinms="props">
          {{props.item.downtimeinms ? calatime(props.item.downtimeinms) : '-'}}
          <!-- {{props.item.downtimeinms ? Math.round(props.item.downtimeinms/1000/60*100)/100 : '-'}} -->
        </template>
        <template #item.updatetimestamp="props">
          {{props.item.updatetimestamp ? moment(props.item.updatetimestamp).format('HH:mm:ss') : '-'}}
        </template>
        <template #item.action="props">
          <v-icon
          color="primary"
          @click="edit(props.item)"
          style="font-size:20px"
          >
          {{'mdi-pencil'}}
          </v-icon>
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
        :disabled="selecteddowntimelist.length === 0"
        @click="edit(selecteddowntimelist)"
        >
          <v-icon
          left
          style="font-size:20px"
          >
          {{'mdi-pencil'}}
          </v-icon>
          {{$t('common.editbtn')}}
        </v-btn>
      </div>
    </v-card>
    <downtime-dialog
    :downtimedialog="downtimedialog"
    :downtimereasons="downtimereasons"
    :selecteddowntime="selecteddowntime"
    @closeDialog="downtimedialog = false, selecteddowntimelist = []"
    />
  </div>
</template>

<script>
import moment from 'moment';
import DowntimeDialog from '@/components/DowntimeDialog';
import DowntimeDashboard from '../components/DowntimeDashboard.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Downtime',
  data (){
    return {
      moment,
      headers: [],
      mode: true,
      downtimedialog: false,
      downtimereasons: [],
      selecteddowntime: {},
      selecteddowntimelist: [],
    }
  },
  components: {
    DowntimeDialog,
    DowntimeDashboard
  },
  computed: {
    ...mapState({
      action: state => state.setting.config.action,
      businesstime: state => state.setting.businesstime,
      machinename: state => state.setting.machinename,
      servertime: state => state.setting.servertime,
      shift: state => state.setting.shift,
      downtimelist: state => state.downtime.downtimelist,
    }),
  },
  created() {
    this.headers = [
      {
        text: this.$t('downtime.downtimestart'),
        sortable: false,
        value: 'downtimestart',
      },
      {
        text: this.$t('downtime.downtimeend'),
        sortable: false,
        value: 'downtimeend',
      },
      {
        text: this.$t('downtime.downtimeinms')+'(hh:mm:ss)',
        sortable: false,
        value: 'downtimeinms',
      },
      {
        text: this.$t('downtime.reasontype'),
        sortable: false,
        value: 'reasontype',
      },
      {
        text: this.$t('downtime.reasonname'),
        sortable: false,
        value: 'reasonname',
      },
      {
        text: this.$t('downtime.comments'),
        sortable: false,
        value: 'comments',
      },
      {
        text: this.$t('downtime.operatorname'),
        sortable: false,
        value: 'operatorname',
      },
      {
        text: this.$t('downtime.modifytime'),
        sortable: false,
        value: 'updatetimestamp',
      },
      {
        text: this.$t('downtime.action'),
        sortable: false,
        value: 'action',
      },
    ]
    this.getDowntime();
  },
  methods: {
    ...mapActions({
      GET_DOWNTIME: 'downtime/GET_DOWNTIME',
      GET_DOWNTIMEREASONS: 'downtime/GET_DOWNTIMEREASONS',
    }),
    async getDowntime() {
      const { machinename, businesstime } = this;
      await this.GET_DOWNTIME(`?query=machinename=="${machinename}"%26%26date==${businesstime.date}%26%26shiftName=="${businesstime.shiftName}"`);
    },
    async edit(downtime) {
      this.selecteddowntime = downtime;
      this.downtimedialog = true;
      const downtimereasons = await this.GET_DOWNTIMEREASONS();
      if (downtimereasons) {
        this.downtimereasons = downtimereasons;
      } else {
        this.downtimereasons = [];
      }
    },
    calatime(duration) {
      duration = duration/1000;
      let s = Math.floor(duration % 60).toString();
      if (s.length < 2) {
        s = '0' + s;
      }
      let m = Math.floor((duration % 3600) / 60).toString();
      if (m.length < 2) {
        m = '0' + m;
      }
      let h = Math.floor(duration / 60 / 60).toString();
      if (h.length < 2) {
        h = '0' + h;
      }
      if (parseInt(h) >= 1) {
        return h + ' : ' + m + ' : ' + s;
      } else {
        return '00 : ' + m + ' : ' + s;
      }
    }
  },
  watch: {
    servertime(servertime) {
      if (Math.ceil(servertime/1000) % 60 === 0) {
        this.getDowntime();
      }
    },
  },
}
</script>
<style lang="scss">
.downtime{
  .lineheight{
    line-height: 20px;
  }
}
</style>
