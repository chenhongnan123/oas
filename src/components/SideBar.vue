<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    permanent
    right
    absolute
    clipped
    touchless
  >
    <v-list-item @click.stop="mini = !mini">
      <v-list-item-icon>
        <v-icon>{{ 'mdi-menu' }}</v-icon>
      </v-list-item-icon>

      <v-list-item-title class="text-h5">{{ $t('common.menu') }}</v-list-item-title>

      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>
    <v-list dense>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
        
      >
        <div
          v-for="item in items"
          :key="item.title"
        >
          <v-divider v-if="item.router === 'admin'" :style="`margin-top:${590-items.length*40}px;`"></v-divider>
          <v-list-item
            link
            :disabled="!machinename || !isAuthorized && (item.router !== 'setting')"
            @click="$router.push(`/${item.router}`)"
          >
            <v-list-item-icon>
              <v-icon >{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-1">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import i18n from '../plugins/i18n';
import { mapState } from 'vuex';
export default {
  name: 'Header',
  data (){
    return {
      drawer: true,
      items: [
        { title: i18n.t('common.production'), icon: 'mdi-chart-areaspline', router: 'production' },
        { title: i18n.t('common.downtime'), icon: 'mdi-window-closed', router: 'downtime' },
        { title: i18n.t('common.cycletime'), icon: 'mdi-timelapse', router: 'cycletime' },
        { title: i18n.t('common.rejection'), icon: 'mdi-file-remove', router: 'rejection' },
        { title: i18n.t('common.plan'), icon: 'mdi-calendar-text-outline', router: 'plan' },
        { title: i18n.t('common.andon'), icon: 'mdi-cellphone-sound', router: 'andon' },
        { title: i18n.t('common.maintenance'), icon: 'mdi-calendar-multiple', router: 'maintenance' },
        { title: i18n.t('common.document'), icon: 'mdi-file-document-multiple', router: 'document' },
        { title: i18n.t('common.login'), icon: 'mdi-account', router: 'admin' },
        { title: i18n.t('common.setting'), icon: 'mdi-cog-outline', router: 'setting' },
      ],
      mini: true,
      selectedItem:7
    }
  },
  computed: {
    ...mapState({
      machinename: state => state.setting.machinename,
      isAuthorized: state => state.login.isAuthorized,
    }),
  },
  methods: {
    monitsign(path) {
      if (!path) {
        return false;
      }
      this.items.forEach((item, k) => {
        if (path.includes(item.router)) {
          this.selectedItem = k;
        }
      });
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.monitsign(route.path);
      },
      immediate: true,
    },
    '$i18n.locale'() {
      this.items = [
        { title: i18n.t('common.production'), icon: 'mdi-chart-areaspline', router: 'production' },
        { title: i18n.t('common.downtime'), icon: 'mdi-window-closed', router: 'downtime' },
        { title: i18n.t('common.cycletime'), icon: 'mdi-timelapse', router: 'cycletime' },
        { title: i18n.t('common.rejection'), icon: 'mdi-file-remove', router: 'rejection' },
        { title: i18n.t('common.plan'), icon: 'mdi-calendar-text-outline', router: 'plan' },
        { title: i18n.t('common.andon'), icon: 'mdi-cellphone-sound', router: 'andon' },
        { title: i18n.t('common.maintenance'), icon: 'mdi-calendar-multiple', router: 'maintenance' },
        { title: i18n.t('common.document'), icon: 'mdi-file-document-multiple', router: 'document' },
        { title: i18n.t('common.login'), icon: 'mdi-account', router: 'admin' },
        { title: i18n.t('common.setting'), icon: 'mdi-cog-outline', router: 'setting' },
      ]
    }
  }
}
</script>
