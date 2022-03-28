<template>
  <v-footer app>
    <v-row  class="text-subtitle-2 pl-3 pb-2">
      <v-col cols="1">
        <!-- {{$t('common.alarm')}}:  -->
      </v-col>
      <v-col cols="8">
        <!-- <v-carousel
          cycle
          hide-delimiters
          :show-arrows="false"
          height="100%"
          vertical
          :interval="config.alarminterval||2000"
        >
          <v-carousel-item>
            <span class="error--text d-block" style="width:90%;">
              Alarm1
            </span>
          </v-carousel-item>
          <v-carousel-item>
            <span class="error--text d-block" style="width:90%;">
              Alarm2
            </span>
          </v-carousel-item>
        </v-carousel> -->
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="text-right">
        {{$t('common.version')}}: {{config.verssion}}
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Footer',
  data (){
    return {}
  },
  computed: {
    ...mapState({
      config: state => state.setting.config ? state.setting.config.footer : {},
    }),
  }
}
</script>
<style lang="scss">
  footer{
    z-index: 99!important;
    .col{
      padding: 0;
    }
  }
  
</style>
