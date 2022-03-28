<template>
  <v-dialog
    v-model="isdialog"
    persistent
    max-width="80%"
    lazy
  >
    <v-card height="600">
      <v-card-title>
        {{$t('downtime.selectdowntimereason')}}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-card class="pa-4" height="400">
              {{$t('downtime.selectdowntimetype')}}
              <v-radio-group v-model="reasontype">
                <v-radio
                  v-for="(type, k) in reasontypelist"
                  :key="k"
                  :label="type"
                  :value="type"
                ></v-radio>
              </v-radio-group>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-4" height="400" style="overflow: scroll;">
              {{$t('downtime.selectdowntimereason')}}
              <v-radio-group v-model="reason">
                <v-radio
                  v-for="(reason, k) in reasonlist"
                  :key="k"
                  :label="reason.reasonname"
                  :value="reason"
                ></v-radio>
              </v-radio-group>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <div class="d-flex px-6">
        <v-textarea
          v-model="comments"
          :label="$t('downtime.comments')"
          outlined
          dense
          height="56"
          hide-details
        ></v-textarea>
        <v-spacer></v-spacer>
        <v-btn
        min-width="100"
        class="mr-3"
        color="warning"
        @click="isdialog = false">
        {{$t('common.cancelbtn')}}
        </v-btn>
        <v-btn
        min-width="100"
        color="primary" 
        @click="HANDLE_AUTHACTION({authaction:action.updatedowntime,callback:submit})" 
        :disabled="!reason">
        {{$t('common.confirmbtn')}}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { Toast } from 'vant';
export default {
  name: 'DowntimeDialog',
  data (){
    return {
      moment,
      reasontypelist: [],
      reasonlist: [],
      reasontype: '',
      reason: '',
      comments: '',
    }
  },
  props:['downtimedialog', 'downtimereasons', 'selecteddowntime'],
  computed: {
    ...mapState({
      action: state => state.setting.config.action,
      servertime: state => state.setting.servertime,
      machinename: state => state.setting.machinename,
      businesstime: state => state.setting.businesstime,
    }),
    isdialog: {
      set() {
        this.reason = '';
        this.reasontype = '';
        this.$emit('closeDialog');
      },
      get() {
        return this.downtimedialog;
      }
    }
  },
  methods: {
    ...mapActions({
      PUT_DOWNTIMEREASON: 'downtime/PUT_DOWNTIMEREASON',
      GET_DOWNTIME: 'downtime/GET_DOWNTIME',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
    }),
    async submit(operator) {
      const { selecteddowntime, reason, comments, servertime } = this;
      const { operatorid, operatorname } = operator;
      const { reasoncode, reasonname, category } = reason;
      const payload = {
        // id: selecteddowntime._id,
        payload: {
          reasontype: category,
          reasoncode,
          reasonname,
          operatorid,
          operatorname,
          comments,
          updatetimestamp: servertime,
        }
      }
      if (Array.isArray(selecteddowntime)) {
        const results = await Promise.all(selecteddowntime.map(async downtime => {
          return await this.PUT_DOWNTIMEREASON({
            ...payload,
            id: downtime._id,
          })
        }))
        if (results.every(i => i)) {
          const { machinename, businesstime } = this;
          await this.GET_DOWNTIME(`?query=machinename=="${machinename}"%26%26date==${businesstime.date}%26%26shiftName=="${businesstime.shiftName}"`);
          this.$emit('closeDialog');
          this.reason = '';
          this.reasontype = '';
          Toast.success(this.$t('alert.actionsuccessfully'));
        } 
        return;
      }
      const result = await this.PUT_DOWNTIMEREASON({
        ...payload,
        id: selecteddowntime._id,
      });
      if (result) {
        const { machinename, businesstime } = this;
        await this.GET_DOWNTIME(`?query=machinename=="${machinename}"%26%26date==${businesstime.date}%26%26shiftName=="${businesstime.shiftName}"`);
        this.$emit('closeDialog');
        this.reason = '';
        this.reasontype = '';
        Toast.success(this.$t('alert.actionsuccessfully'));
      }
    }
  },
  watch: {
    downtimereasons(downtimereasons) {
      this.reasonlist = downtimereasons;
      const reasontypelist = downtimereasons.map(reason => reason.category);
      this.reasontypelist = [...new Set(reasontypelist)];
    },
    reasontype(reasontype) {
      this.reasonlist = this.downtimereasons.filter(reason => reason.category === reasontype );
    }
  }
}
</script>
