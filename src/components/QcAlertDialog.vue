<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="70%"
    >
      <v-card :color="isipqc ? '#FFFF80' : '#F59A23'" light class="text-center pt-5" height="500px">
        <v-card-text class="text-h4" style="line-height: 400px;">
          <span>
            {{isipqc ? $t('alert.ipqcchecktext') : $t('alert.qcchecktext')}}
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="dialog=false"
          >
            {{$t('common.closebtn')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'QcAlertDialog',
  data (){
    return {
    }
  },
  props: ['isShowQcAlert', 'isipqc'],
  computed: {
    dialog: {
      set() {
        this.$emit('cancel');
      },
      get() {
        return this.isShowQcAlert;
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>