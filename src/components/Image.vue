<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="100%" transition="dialog-transition">
    <v-card color="primary" dark v-if="!imagesrc">
      <v-card-text>
        {{ 'Loadong' }}
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
    <v-card height="620px" v-else>
      <v-card-text class="pt-5">
        <img height="100%" width="auto" style="margin: 0 auto;display: block;" :src="imagesrc" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red"
          text
          class="text-none"
          @click="
            SETPREVIEWTYPE(0);
            imagesrc = null;
            SETPREVIEWDATA(null);
          "
        >
          {{ $t('common.closebtn') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  // mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';

export default {
  name: 'Img',
  data() {
    return {
      imagesrc: null,
    };
  },
  computed: {
    ...mapState('document', ['previewType', 'previewData']),
    dialog() {
      return this.previewType === 2;
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        const reader = new FileReader();
        reader.readAsDataURL(this.previewData);
        reader.onload = async (event) => {
          this.imagesrc = event.target.result;
        };
      }
      return null;
    },
  },
  methods: {
    ...mapMutations('document', ['SETPREVIEWTYPE', 'SETPREVIEWDATA']),
  },
};
</script>
