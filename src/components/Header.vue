<template>
  <v-app-bar
    app
    height="50"
    width="100%"
  >
    <img src="../assets/shopworx.png" width="150">
    <!-- <input type="file" capture="camera" accept="image/*" multiple="multiple"> -->
    <span class="mx-5 text-h5 text-truncate" style="max-width: 300px;">{{$t(`common.${$route.name.toLowerCase()}`)||'ShopWorx Operator Assistance System'}}</span>
    <v-spacer></v-spacer>
    <!-- <span class="mr-5 text-h6">H630-10</span> -->
    <v-btn
      text
      outlined
      class="mr-5 text-h6"
    >
      {{machinename || 'No Machine Selected'}}
    </v-btn>
    <span>{{businesstime.shiftName}}</span>
    <span class="body-1 mx-5">{{moment(servertime).format('YYYY-MM-DD HH:mm:ss')}}</span>
    <!-- <v-btn
      href="https://github.com/vuetifyjs/vuetify/releases/latest"
      target="_blank"
      text
    >
      <span class="mr-2">Latest Release</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn> -->
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
export default {
  name: 'Header',
  data (){
    return {
      moment
    }
  },
  computed: {
    ...mapState({
      servertime: state => state.setting.servertime,
      machinename: state => state.setting.machinename,
      // shiftname: state => state.setting.shiftname,
      businesstime: state => state.setting.businesstime,
    }),
  },
}
</script>
