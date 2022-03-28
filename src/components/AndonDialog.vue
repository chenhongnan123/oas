<template>
  <v-dialog
    v-model="isdialog"
    persistent
    max-width="80%"
  >
    <v-card height="600">
      <v-card-title>
        {{$t('andon.selectabnormal')}}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-card class="pa-4" height="400">
            {{$t('andon.selecttype')}}
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
            {{$t('andon.selectabnormal')}}
              <v-radio-group v-model="reason">
                <v-radio
                  v-for="(reason, k) in reasonlist"
                  :key="k"
                  :label="reason.name"
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
          :label="$t('andon.comments')"
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
        @click="isdialog = false"
        >
        {{$t('common.cancelbtn')}}
        </v-btn>
        <v-btn 
        min-width="100"
        color="primary" 
        @click="HANDLE_AUTHACTION({authaction:'addandon',callback:submit})" 
        :disabled="submitdisabled">
        {{$t('common.confirmbtn')}}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import { Toast, Dialog } from 'vant';
export default {
  name: 'AndonDialog',
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
  props:['andondialog', 'andonreasons'],
  computed: {
    ...mapState({
      action: state => state.setting.config.action,
      servertime: state => state.setting.servertime,
      machinename: state => state.setting.machinename,
      businesstime: state => state.setting.businesstime,
      currentplan: state => state.plan.currentplan,
    }),
    isdialog: {
      set() {
        this.reason = '';
        this.reasontype = '';
        this.comments = '';
        this.$emit('closeDialog');
      },
      get() {
        return this.andondialog;
      }
    },
    submitdisabled() {
      const { reason } = this;
      return !reason
    }
  },
  methods: {
    ...mapActions({
      GET_ANDON: 'andon/GET_ANDON',
      POST_ANDON: 'andon/POST_ANDON',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
      GET_ANDONPATH: 'andon/GET_ANDONPATH',
      POST_ANDONTASK: 'andon/POST_ANDONTASK',
    }),
    async submit(operator) {
      const { operatorid, operatorname } = operator;
      const { reason, comments, machinename, servertime, currentplan } = this;
      const { code, name, category, description } = reason;
      let count = 0;
      const andonpathlist =  await this.GET_ANDONPATH(`?query=typecode==%22${code}%22`);
      if (!andonpathlist) {
        Dialog.alert({
          title: this.$t('alert.confirminfo'),
          message: this.$t('andon.noandontypepath'),
          confirmButtonText: this.$t('common.confirmbtn'),
        })
        return;
      }
      const payload = {
        comments,
        typecode: code,
        typename: name,
        typecategory: category,
        typedescription: description,
        machinename,
        // partname,
        // planid,
        starttime: moment(servertime).format('DD-MM-YYYY:hh:mm:ss'),
        starttimestamp: servertime,
        status: 'inProgress',
        createdbycode: operatorid,
        createdbyname: operatorname,
        timeType: "BUSINESS_TIME",
        assetid: 0,
      }
      const result = await this.POST_ANDON(payload);
      if (result) {
        // const { machinename, businesstime } = this;
        const andonlist = await this.GET_ANDON(`?query=machinename==%22${machinename}%22%26%26status==%22inProgress%22`);
        const [andonobj] = andonlist;
        const { id } = andonobj;
        if (andonpathlist) {
          const andontaskresults = await Promise.all(andonpathlist.map(async andonpath => {
            const { alertrole, alertdelay, unit  } = andonpath;
            let clock = 0;
            if (Number(unit) === 1) {
              clock = servertime + alertdelay*60*1000
            } else {
              clock = servertime + alertdelay*3600*1000
            }
            let context = {
              machinename,
              typename: name,
              typedescription: description,
              alertdelay,
              unit,
              comments,
              starttimestamp: servertime,
              createdbycode: operatorid,
              createdbyname: operatorname.split('').map(item => item.charCodeAt()),
            };
            if (currentplan.length > 0) {
              const {
                planid,
                moldname
              } = currentplan[0];
              const partname = currentplan.map(plan => plan.partname).join();
              const partnumber = currentplan.map(plan => plan.partnumber).join();
              context = {
                ...context,
                planid,
                moldname,
                partname,
                partnumber,
              }
            } else {
              context = {
                ...context,
                planid: '',
                moldname: '',
                partname: '',
                partnumber: '',
              }
            }
            const payload = {
              taskid: `andontask-${new Date().getTime() + count}`,
              alertrole,
              clock,
              recordid: id,
              context:JSON.stringify(context),
              // sendingtime: moment(servertime).format('DD-MM-YYYY:hh:mm:ss'),
              status: 0
            }
            count++;
            return await this.POST_ANDONTASK(payload)
          }))
          if (andontaskresults.every(i => i)) {
            this.GET_ANDON(`?query=machinename==%22${machinename}%22%26%26status==%22inProgress%22`);
            this.reason = '';
            this.reasontype = '';
            this.comments = '';
            Toast.success(this.$t('alert.actionsuccessfully'));
            this.$emit('closeDialog');
          }
        }
      }
    }
  },
  watch: {
    andonreasons(andonreasons) {
      this.reasonlist = andonreasons;
      const reasontypelist = andonreasons.map(reason => reason.category);
      this.reasontypelist = [...new Set(reasontypelist)];
    },
    reasontype(reasontype) {
      this.reasonlist = this.andonreasons.filter(reason => reason.category === reasontype );
    }
  }
}
</script>
