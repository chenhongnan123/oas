<template>
  <div class="maintenance height100">
    <!-- <iframe :src="`http://${host}/#/dashboard?from=oas&locale=${$i18n.locale === 'en' ? 'en' : 'zhHans'}&machine=${machinename}`" frameborder="0" height="100%" width="100%"></iframe> -->
    <iframe :src="`http://${host}/tpm/#/dashboard?from=oas&locale=${$i18n.locale === 'en' ? 'en' : 'zhHans'}&machine=${machinename}`" frameborder="0" height="100%" width="100%"></iframe>
  </div>
</template>

<script>
console.log(window.location.host, 'window.location.host');
import { mapState } from 'vuex';
export default {
  name: 'Maintenance',
  data (){
    return {
      // host: '192.168.30.69',
      host: window.location.host,
    }
  },
  computed: {
    ...mapState({
      machinename: state => state.setting.machinename,
    }),
  },
}
</script>
<style lang="scss">
.maintenance{
  height: 650px;
}
</style>
