<template>
  <v-dialog
    v-model="isdialog"
    persistent
    max-width="30%"
  >
    <v-card>
      <v-card-title>
        {{$t('login.scan')}}
      </v-card-title>
      <v-card-text>
         <v-text-field
          class="scan-field"
          :label="$t('login.scan')"
          outlined
          v-model="operatorcode"
          type="password"
          name="input-10-1"
          solo
          clearable
          autofocus
          @change="handleChange"
        ></v-text-field>
        <v-text-field
          v-model="operatorname"
          :label="$t('login.operatorname')"
          outlined
          :error-messages="errormessages"
        ></v-text-field>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="isdialog = false">{{$t('common.cancelbtn')}}</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import { Toast } from 'vant';
export default {
  name: 'AuthDialog',
  data (){
    return {
      moment,
      operatorcode: '',
      operatorname: '',
      errormessages: ''
    }
  },
  computed: {
    ...mapState({
      servertime: state => state.setting.servertime,
      machinename: state => state.setting.machinename,
      businesstime: state => state.setting.businesstime,
      authdialog: state => state.login.authdialog,
      authaction: state => state.login.authaction,
    }),
    isdialog: {
      set() {
        this.operatorcode = '';
        this.operatorname = '';
        this.errormessages = '';
        this.SET_AUTHDIALOG(false);
      },
      get() {
        return this.authdialog;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      document.querySelector('.scan-field input').focus();
    }, 100);
  },
  methods: {
    ...mapMutations({
      SET_AUTHDIALOG: 'login/SET_AUTHDIALOG',
    }),
    ...mapActions({
      LOGIN: 'login/LOGIN',
      GET_POSITIONAUTH: 'login/GET_POSITIONAUTH',
      AUTHCALLBACK: 'login/AUTHCALLBACK',
    }),
    async scan($event) {
      if ($event.keyCode == 13) {
        const { operatorcode, authaction } = this;
        const operatorresult = await this.LOGIN({ username: operatorcode});
        if (operatorresult) {
          const { id, operatorname } = operatorresult[0]
          this.operatorname = operatorresult[0].operatorname;
          const positionresult = await this.GET_POSITIONAUTH(`?query=positionid==%22${operatorresult[0].positionid}%22%26%26authcode==%22${authaction}%22`);
          if (positionresult) {
            this.operatorcode = '';
            this.operatorname = '';
            this.errormessages = '';
            this.SET_AUTHDIALOG(false);
            this.AUTHCALLBACK({operatorid: id, operatorname});
          } else {
            this.operatorcode = '';
            this.errormessages = this.$t('login.nopermission');
          }
        } else {
          this.operatorcode = '';
          this.operatorname = '';
          this.errormessages = this.$t('login.nocardnumber');
          Toast.fail(this.$t('login.nocardnumber'));
        }
      } else {
        this.operatorcode += String.fromCharCode($event.keyCode);
      }
    },
    async handleChange() {
      const { operatorcode, authaction } = this;
      const operatorresult = await this.LOGIN({ username: operatorcode});
      if (operatorresult) {
        const { id, operatorname } = operatorresult[0]
        this.operatorname = operatorresult[0].operatorname;
        const positionresult = await this.GET_POSITIONAUTH(`?query=positionid==%22${operatorresult[0].positionid}%22%26%26authcode==%22${authaction}%22`);
        if (positionresult) {
          this.operatorcode = '';
          this.operatorname = '';
          this.errormessages = '';
          this.SET_AUTHDIALOG(false);
          this.AUTHCALLBACK({operatorid: id, operatorname});
        } else {
          this.operatorcode = '';
          this.errormessages = this.$t('login.nopermission');
        }
      } else {
        this.operatorcode = '';
        this.operatorname = '';
        this.errormessages = this.$t('login.nocardnumber');
        Toast.fail(this.$t('login.nocardnumber'));
      }
    }
  },
}
</script>
