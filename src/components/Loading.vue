<template>
  <v-overlay
      :value="isLoading"
      z-index="1000"
    >
      <v-progress-circular
        :size="100"
        :width="10"
        color="purple"
        indeterminate
        z-index="1000"
      >
      loading
      </v-progress-circular>
    </v-overlay>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Loading',
  data (){
    return {}
  },
  computed: {
    ...mapState({
      isLoading: state => state.setting.isLoading,
    }),
  },
}
</script>
<style lang="scss" scoped>
  
</style>
