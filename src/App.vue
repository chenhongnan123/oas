<template>
  <v-app>
    <Header/>
    <v-main>
      <side-bar/>
      <v-card height="100%" class="pa-2 pr-15 text-body-2" v-if="servertime">
        <router-view></router-view>
      </v-card>
    </v-main>
    <Loading/>
    <Keyboard/>
    <Footer/>
    <auth-dialog v-if="authdialog"/>
    <qc-alert-dialog :isShowQcAlert="isShowQcAlert" @cancel="isShowQcAlert = false" :isipqc="isipqc"/>
  </v-app>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import Header from './components/Header';
import Footer from './components/Footer';
import SideBar from './components/SideBar';
import Loading from './components/Loading';
import AuthDialog from './components/AuthDialog';
import Keyboard from './components/Keyboard';
import QcAlertDialog from './components/QcAlertDialog';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    SideBar,
    Loading,
    Keyboard,
    AuthDialog,
    QcAlertDialog
  },
  data () {
    return {
      hasSessionId: false,
      isShowQcAlert: false,
      isipqc: false,
      sseClient: null,
      timeout: null,
      readyState: 0,
    }
  },
  computed: {
    ...mapState({
      qclaert: state => state.setting.config.qclaert,
      shiftmmss: state => state.setting.config.shiftmmss,
      servertime: state => state.setting.servertime,
      businesstime: state => state.setting.businesstime,
      authdialog: state => state.login.authdialog,
      machinename: state => state.setting.machinename,
      currentplan: state => state.plan.currentplan,
      shifterformancereport: state => state.production.shifterformancereport,
      hourlydowntimereport: state => state.production.hourlydowntimereport,
      hourlyproductionreport: state => state.production.hourlyproductionreport,
      hourlyproductionparameter: state => state.production.hourlyproductionparameter,
    }),
    ...mapGetters('setting', ['shiftStartTime']),
  },
  methods: {
    ...mapMutations({
      SET_ALERTERRORMSSAGE: 'setting/SET_ALERTERRORMSSAGE',
      SET_SHIFTPRODUCTIONREPORT: 'production/SET_SHIFTPRODUCTIONREPORT',
      SET_HOURLYDOWNTIMEREPORT: 'production/SET_HOURLYDOWNTIMEREPORT',
      SET_HOURLYPRODUCTIONREPORT: 'production/SET_HOURLYPRODUCTIONREPORT',
      SET_HOURLYPRODUCTIONPARAMETER: 'production/SET_HOURLYPRODUCTIONPARAMETER',
      SET_PLAN: 'plan/SET_PLAN',
    }),
    ...mapActions({
      getSessionId: 'setting/GET_SESSIONID',
      GET_NOWORKINGTIME: 'setting/GET_NOWORKINGTIME',
      GETPLAN: 'production/GETPLAN',
      GETINTERVALDATA: 'production/GETINTERVALDATA',
    }),
    sseInit() {
      this.sseClient = new EventSource('/sse/asm');
      this.readyState = this.sseClient.readyState;
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener('shift', async (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        const {
          day,
          shiftName,
        } = this.businesstime;
        if (
          eventData.machinename === this.machinename
          && eventData.shift === shiftName
          && eventData.day === day
        ) {
          // console.log('shift', eventData);
          const {
            servertime,
            shiftStartTime,
          } = this;
          if (Math.ceil(servertime/1000) % 2 === 0) {
            const shiftereport = {...this.shifterformancereport};
            shiftereport.performance = eventData.performance;
            shiftereport.quality = eventData.quality;
            shiftereport.runtime = eventData.runtime;
            const query = `?starttime=${shiftStartTime}&endtime=${servertime}`
            const noworkingtime = await this.GET_NOWORKINGTIME(query);
            if (noworkingtime) {
              shiftereport.workingtime = servertime - shiftStartTime - noworkingtime;
            } else {
              shiftereport.workingtime = servertime - shiftStartTime;
            }
            console.log('shift', eventData);
            this.SET_SHIFTPRODUCTIONREPORT(shiftereport);
          }
        }
      });
      this.sseClient.addEventListener('hourly', (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        const {
          day,
          shiftName,
        } = this.businesstime;
        if (
          eventData.machinename === this.machinename
          && eventData.shift === shiftName
          && eventData.day === day
        ) {
          const {
            servertime,
          } = this;
          if (Math.ceil(servertime/1000) % 2 === 0) {
            const displayHour = eventData.displayHour.substr(0,5);
            if (this.hourlydowntimereport) {
              const downtimereport = [...this.hourlydowntimereport];
              downtimereport.forEach(item => {
                if (item.displayHour === displayHour) {
                  item.totaldowntime = eventData.actm_sum || item.totaldowntime;
                  item.totaldowntimeinmins = eventData.actm_sum/1000/60 || item.totaldowntimeinmins;
                }
              });
              console.log('downtimereport', downtimereport);
              this.SET_HOURLYDOWNTIMEREPORT(downtimereport);
            }
            if (this.hourlyproductionreport) {
              const productionreport = [...this.hourlyproductionreport];
              productionreport.forEach(item => {
                if (item.displayHour === displayHour) {
                  item.rejected = eventData.rqty || item.rejected;
                }
              });
              this.SET_HOURLYPRODUCTIONREPORT(productionreport);
            }
            if (this.hourlyproductionparameter) {
              const productionreportparameter = [...this.hourlyproductionparameter];
              productionreportparameter.forEach(item => {
                if (item.displayHour === displayHour) {
                  item.max = eventData.actm_max || item.max;
                  item.min = eventData.actm_min || item.min;
                  item.avg = eventData.actm_sum/eventData.actm_count || item.avg;
                }
              });
              this.SET_HOURLYPRODUCTIONPARAMETER(productionreportparameter);
            }
            console.log('hourly', eventData);
          }
        }
      });
      this.sseClient.addEventListener('plan', (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        const {
          servertime,
          currentplan,
        } = this;
        if (Math.ceil(servertime/1000) % 2 === 0) {
          const plan = [...currentplan];
          if (plan.find(item => item.planid === eventData.planid)) {
            plan.forEach(item => {
              if (item.planid === eventData.planid) {
                console.log('plan', eventData, plan);
                item.actualquantity = eventData.qty || item.actualquantity;
              }
            });
            this.SET_PLAN(plan);
          }
        }
      });
      this.sseClient.onerror = (event) => {
        console.log('sse error');
        this.readyState = event.target.readyState;
        this.sseClient.close();
        this.reconnectSse();
      };
    },
    reconnectSse() {
      let sseOK = false;
      if (this.sseClient === null) {
        sseOK = false;
      } else {
        sseOK = (this.sseClient.readyState !== EventSource.CLOSED);
      }
      console.log(sseOK, 'sseOK');
      this.readyState = this.sseClient.readyState;
      if (!sseOK) {
        this.sseInit();
      }
    },
  },
  async created() {
    if (this.machinename) {
      this.$router.push('/admin');
    }
    const theme = localStorage.getItem('theme');
    const language = localStorage.getItem('language');
    this.$i18n.locale = language||'zh';
    this.$vuetify.theme.dark = (theme === 'light' ? false : true);
    localStorage.setItem('dark', this.$vuetify.theme.dark);
    this.SET_ALERTERRORMSSAGE(this.$t('alert.networkerror'));
    this.sseInit();
  },
  watch: {
    servertime(servertime) {
      const { qchh, ipqchh } = this.qclaert;
      const hh = moment(servertime).format('hh');
      const mmss = moment(servertime).format('mm:ss');
      if(qchh.includes(hh)) {
        this.isipqc = false;
      }
      if(ipqchh.includes(hh)) {
        this.isipqc = true;
      }
      if ((qchh.includes(hh) || ipqchh.includes(hh)) && mmss === '00:00' && this.machinename) {
        this.isShowQcAlert = true;
      }
      if (this.shiftmmss && this.shiftmmss.includes(mmss) && this.machinename) {
        this.GETINTERVALDATA();
      }
      if (Math.ceil(servertime/1000) % 60 === 0) {
        this.GETPLAN();
      }
    },
  },
};
</script>
<style lang="scss">
  ul,li,i{
    list-style: none;
    font-style: normal;
  }
  .theme--dark{
    .van-key__wrapper{
      .van-key{
        background-color: #1e1e1e;
      }
    }
  }
  .width100{
    height: 100%;
  }
  .height100{
    height: 100%;
  }
</style>
