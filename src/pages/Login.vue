<template>
  <div class="setting d-flex height100 width100">
    <div style="width:50%;">
      <p class="text-h6">{{$t('login.loggedin')}}</p>
      <v-data-table
        :headers="headers"
        v-model="employeeSelected"
        :items="employeeList"
        show-select
        item-key="_id"
        :items-per-page="20"
        hide-default-footer
        class="elevation-1 mt-5"
        :no-data-text="$t('common.notabledata')"
        height="calc(100vh - 300px)">
      </v-data-table>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn
        color="primary"
        class="mt-5"
        :disabled="employeeSelected.length === 0"
        @click="putOperator"
        >
        {{$t('login.logout')}}
        </v-btn>
      </div>
    </div>
    <v-divider vertical class="mx-2"/>
    <div style="width:50%;" class="d-flex flex-column align-center">
      <div style="width:50%;" class="mt-16">
        <v-text-field
          v-model="username"
          :label="$t('login.operatorcode')"
          outlined
          clearable
          readonly
          @touchstart.native.stop="setKeyboard(true)"
          @focus="handleFocus('username')"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :label="$t('login.password')"
          outlined
          clearable
          type="password"
        ></v-text-field>
        <v-btn
        color="primary"
        width="100%"
        :disabled="!username||!password"
        @click="submit"
        >
        {{$t('login.login')}}
        </v-btn>
      </div>
      <div style="width:80%;position:relative;" class="mt-10">
        <span class="or">
          {{$t('login.or')}}
        </span>
        <v-divider style="width:200%;"/>
      </div>
      <div style="width:50%;" class="mt-16">
        <v-text-field
          :label="$t('login.scan')"
          outlined
          v-model="employeeId"
          type="password"
          name="input-10-1"
          solo
          clearable
          @change="handleChange"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations,mapActions } from 'vuex';
import { Toast } from 'vant';
import moment from 'moment';
// let interval = null;
export default {
  name: 'Login',
  data (){
    return {
      username: '',
      password: '',
      employeeId: '',
      headers: [
      ],
      employeeList: [
        // { employeenumber: '12345', employeename: '张三', date: '2021-04-02', time: '19:20:10' },
        // { employeenumber: '123456', employeename: '张三', date: '2021-04-02', time: '19:20:10' },
      ],
      employeeSelected: [],
    }
  },
  computed: {
    ...mapState({
      authconfig: state => state.setting.config.auth,
      businesstime: state => state.setting.businesstime,
      keyboardValue: state => state.setting.keyboardValue,
      servertime: state => state.setting.servertime,
      machinename: state => state.setting.machinename,
    }),
  },
  watch: {
    keyboardValue(val) {
      this[this.currentFocus] = val;
    },
    '$i18n.locale'() {
      this.items =  [
        { text: this.$t('login.operatorcode'), value: 'operatorid' },
        { text: this.$t('login.operatorname'), value: 'operatorname' },
        { text: this.$t('login.logindate'), value: 'logindate' },
        { text: this.$t('login.logintime'), value: 'logintime' },
      ]
    }
  },
  async created() {
    const { machinename } = this;
    const employeeList = await this.getOperator({ machinename, operatorstatus: 'In Progress' });
    if (employeeList) {
      this.employeeList = employeeList;
      localStorage.setItem('operator', JSON.stringify(employeeList[0]));
    }
    this.headers =  [
      { text: this.$t('login.operatorcode'), value: 'operatorid' },
      { text: this.$t('login.operatorname'), value: 'operatorname' },
      { text: this.$t('login.logindate'), value: 'logindate' },
      { text: this.$t('login.logintime'), value: 'logintime' },
    ]
    this.init();
    // clearInterval(interval);
    // interval = setInterval(() => {
    //   // this.init();
    //   this.init();
    // }, 60 * 60 * 1000);
  },
  methods: {
    ...mapMutations({
      setKeyboard: 'setting/SET_KEYBOARD',
      setKeyboardValue: 'setting/SET_KEYBOARD_VALUE',
    }),
    ...mapActions({
      GET_BUSINESSTIME: 'setting/GET_BUSINESSTIME',
      LOGIN: 'login/LOGIN',
      POSTOPERATOR: 'login/POSTOPERATOR',
      GETOPERATOR: 'login/GETOPERATOR',
      PUTOPERATOR: 'login/PUTOPERATOR',
      GETINTERVALDATA: 'production/GETINTERVALDATA',
      PUTOPERATORBYQUERY: 'login/PUTOPERATORBYQUERY',
    }),
    handleFocus(currentFocus) {
      if (this.currentFocus !== currentFocus) {
        this.currentFocus = currentFocus;
        this.setKeyboardValue('');
      }
    },
    async init() {
      this.GETINTERVALDATA();
    },
    async submit() {
      this.handleChange();
    },
    async postOperator(loginresult) {
      const { servertime, machinename } = this;
      const payload = {
        operatorname: loginresult.operatorname || '-',
        operatorcode: loginresult.operatorcode || '-',
        operatorid: loginresult.id || '-',
        machinename,
        logindate: moment(servertime).format('YYYY-MM-DD'),
        logintime: moment(servertime).format('HH:mm:ss'),
        timestamp: servertime,
        signintime: servertime,
        status: 'In Progress',
      }
      const postresult = await this.POSTOPERATOR(payload);
      if(postresult) {
        this.username = '';
        this.password = '';
        this.employeeId = '';
        Toast.success(this.$t('alert.actionsuccessfully'));
        const employeeList = await this.getOperator({ machinename, operatorstatus: 'In Progress' });
        if (employeeList) {
          this.employeeList = employeeList;
        }
      }
    },
    async scan($event) {
      if ($event.keyCode == 13) {
        const { employeeId, machinename } = this;
        const operatorResult = await this.getOperator({ operatorcode: employeeId, machinename, operatorstatus: 'In Progress' });
        if (!operatorResult) {
          const loginresult = await this.LOGIN({ username: employeeId });
          if (loginresult) {
            this.postOperator(loginresult[0]);
          } else {
            this.username = '';
            this.password = '';
            this.employeeId = '';
          }
        } else {
          this.employeeId = '';
          Toast.fail(this.$t('login.cardnumberlogged'));
        }
      } else {
        this.employeeId += String.fromCharCode($event.keyCode);
      }
    },
    async handleChange(logintext) {
      const { employeeId, machinename, authconfig } = this;
      const {  username, password, } = this;
      const { issingle } = authconfig;
      let loginData = {};
      if (!logintext) {
        loginData = {  username, password, }
      } else {
        loginData = {  username: employeeId }
      }
      console.log(logintext, loginData, 'loginData');
      const loginresult = await this.LOGIN(loginData);
      if (loginresult) {
        if (issingle) {
          await this.PUTOPERATORBYQUERY({
            payload: { status: 'Complete', assetid: 4, },
            param: `?query=machinename=="${machinename}"%26%26status=="In Progress"`
          });
          await this.postOperator(loginresult[0]);
          // Cookies.set('operator', loginresult[0]);
          localStorage.setItem('operator', JSON.stringify(loginresult[0]));
        } else {
          const operatorResult = await this.getOperator({ operatorcode: employeeId, machinename, operatorstatus: 'In Progress' });
          if (!operatorResult) {
            this.postOperator(loginresult[0]);
          } else {
            this.employeeId = '';
            Toast.fail(this.$t('login.cardnumberlogged'));
          }
        }
      } else {
        this.username = '';
        this.password = '';
        this.employeeId = '';
      }
    },
    async getOperator(payload) {
      const loginresult = await this.GETOPERATOR(payload);
      if (loginresult) {
        return loginresult;
      }
      return false;
    },
    async putOperator() {
      const { servertime, employeeSelected, machinename } = this;
      const payload = {
        logoutdate: moment(servertime).format('YYYY-MM-DD'),
        logouttime: moment(servertime).format('HH:mm:ss'),
        signouttime: servertime,
        status: 'Complete',
        assetid: 4,
      }
      const putResults = await Promise.all(employeeSelected.map(item => {
        const param = {
          id:item._id,
          payload
        }
        return this.PUTOPERATOR(param);
      }));
      if(putResults.every(i => i)) {
        Toast.success(this.$t('alert.actionsuccessfully'));
        // Cookies.remove('operator');
        localStorage.removeItem('operator');
        const employeeList = await this.getOperator({ machinename, operatorstatus: 'In Progress' });
        if (employeeList) {
          this.employeeList = employeeList;
        } else {
          this.employeeList = [];
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.or{
  position: absolute;
  width: 30px;
  left: 50%;
  top: -10px;
  // background: #fff;
  text-align: center;
  transform: translate(-50%);
}
</style>
