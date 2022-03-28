import Vue from 'vue';
import Router from 'vue-router';
import Setting from '../pages/Setting';
import Login from '../pages/Login';
import Production from '../pages/Production';
import Downtime from '../pages/Downtime';
import Cycletime from '../pages/Cycletime';
import Rejection from '../pages/Rejection';
import Plan from '../pages/Plan';
import Andon from '../pages/Andon';
import Maintenance from '../pages/Maintenance';
import Document from '../pages/Document';
import store from '@/store';
// store.commit('setting/SET_lOADING', true);
const initalMachinename = localStorage.getItem('machinename');

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      // name: initalMachinename ? 'Login' : 'Setting',
      // component: initalMachinename ? Login : Setting,
      redirect: initalMachinename ? '/admin' : 'setting'
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
    },
    {
      path: '/admin',
      name: 'Login',
      component: Login,
    },
    {
      path: '/production',
      name: 'Production',
      component: Production,
    },
    {
      path: '/downtime',
      name: 'Downtime',
      component: Downtime,
    },
    {
      path: '/cycletime',
      name: 'Cycletime',
      component: Cycletime,
    },
    {
      path: '/rejection',
      name: 'Rejection',
      component: Rejection,
    },
    {
      path: '/plan',
      name: 'Plan',
      component: Plan,
    },
    {
      path: '/andon',
      name: 'Andon',
      component: Andon,
    },
    {
      path: '/maintenance',
      name: 'Maintenance',
      component: Maintenance,
    },
    {
      path: '/document',
      name: 'Document',
      component: Document,
    },
  ],
});
const init = async () => {
  await store.dispatch('setting/GET_SESSIONID');
  await store.dispatch('login/GETOPERATOR', {machinename: localStorage.getItem('machinename'), operatorstatus: 'In Progress'});
  setInterval(() => {
    store.dispatch('setting/GET_SESSIONID');
  }, 3600000);
  router.beforeEach(async (to, from, next) => {
    const machinename = localStorage.getItem('machinename');
    const isAuthorized = store.state.login.isAuthorized;
    if (machinename) {
      if ((to.name !== 'Login' && to.name !== 'Setting') && !isAuthorized) {
        next({ name: 'Login' });
      } else {
        next();
      }
    } else {
      if (to.name !== 'Setting') {
        next({ name: 'Setting' });
      } else {
        next();
      }
    }
  })
};
init()

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router;
