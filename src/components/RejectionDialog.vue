<template>
  <v-dialog
    v-model="isdialog"
    persistent
    max-width="80%"
  >
    <v-card height="650">
      <v-card-title>
        {{$t('rejection.selectrejectionreason')}}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-card class="pa-4" height="400">
              {{$t('rejection.selectrejectiontype')}}
              <v-radio-group v-model="reasontype">
                <v-radio
                  v-for="(type, k) in reasontypelist"
                  :key="k"
                  :label="type"
                  :value="type"
                ></v-radio>
              </v-radio-group>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-4" height="400" style="overflow: scroll;">
              {{$t('rejection.selectrejectionreason')}}
              <v-radio-group v-model="reason">
                <v-radio
                  v-for="(reason, k) in reasonlist"
                  :key="k"
                  :label="reason.reasonname"
                  :value="reason"
                ></v-radio>
              </v-radio-group>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <div class="d-flex px-6">
        <div style="width:300px" class="mr-3">
          <v-select
            v-model="selectedplan"
            :items="currentplan"
            :label="$t('rejection.selectpartname')"
            outlined
            item-text="partname"
            item-value="planid"
            return-object
            dense
            :hint="selectedplan.partnumber"
            persistent-hint
          >
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-html="data.item.partname"></v-list-item-title>
                <v-list-item-subtitle v-html="data.item.partnumber"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-select>
        </div>
        <div style="width:100px" class="mr-3">
          <v-text-field
            v-model="inspectedquantity"
            :label="$t('rejection.inspectedquantity')"
            outlined
            dense
            readonly
            @focus="handleFocus('inspectedquantity')"
            @click="setKeyboard(true)"
            :error-messages="quantityvertify"
            :disabled="!selectedplan.planid"
          ></v-text-field>
        </div>
        <div style="width:100px" class="mr-3">
          <v-text-field
            v-model="quantity"
            :label="$t('rejection.quantity')"
            outlined
            dense
            readonly
            @focus="handleFocus('quantity')"
             @click="setKeyboard(true)"
            :error-messages="rejectionvertify"
            :disabled="!selectedplan.planid"
          ></v-text-field>
        </div>
        <div style="width:150px" class="mr-3">
          <v-text-field
            style="width:150px"
            v-model="remark"
            :label="$t('rejection.remark')"
            outlined
            dense
          ></v-text-field>
        </div>
        <div style="width:100px">
          <v-checkbox
            v-model="isQc"
            :label="$t('rejection.isqc')"
          ></v-checkbox>
        </div>
      </div>
      <div class="d-flex px-6">
        <v-spacer></v-spacer>
        <v-btn 
        min-width="100"
        class="mr-3"
        color="warning" 
        @click="isdialog = false"
        >
        {{$t('common.cancelbtn')}}
        </v-btn>
        <v-btn 
        min-width="100"
        color="primary" 
        @click="HANDLE_AUTHACTION({authaction:action.addrejection,callback:submit})" 
        :disabled="submitdisabled"
        >
        {{$t('common.confirmbtn')}}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import { Toast } from 'vant';
export default {
  name: 'RejectionDialog',
  data (){
    return {
      moment,
      reasontypelist: [],
      reasonlist: [],
      reasontype: '',
      reason: '',
      inspectedquantity: '',
      quantity: '',
      selectedplan: {},
      remark: '',
      isQc: false,
    }
  },
  props:['rejectiondialog', 'rejectionreasons'],
  computed: {
    ...mapState({
      shifterformancereport: state => state.production.shifterformancereport,
      action: state => state.setting.config.action,
      servertime: state => state.setting.servertime,
      machinename: state => state.setting.machinename,
      businesstime: state => state.setting.businesstime,
      currentplan: state => state.plan.currentplan,
      keyboardValue: state => state.setting.keyboardValue,
    }),
    isdialog: {
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
      get() {
        return this.rejectiondialog;
      }
    },
    quantityvertify() {
      const { inspectedquantity, selectedplan, shifterformancereport } = this;
      if (inspectedquantity && inspectedquantity <= 0 || inspectedquantity%1 !== 0) {
        return this.$t('rejection.inspectedquantityvertify')
      }
      if (shifterformancereport && shifterformancereport.production && shifterformancereport.production.length > 0) {
        const currentproduction = shifterformancereport.production.find(item => item.planid === selectedplan.planid);
        if (inspectedquantity > currentproduction.produced) {
          return this.$t('rejection.inspectvertifylimit');
        }
      }
      return '';
    },
    rejectionvertify() {
      const { quantity, selectedplan, shifterformancereport } = this;
      if (quantity && quantity < 0 || quantity%1 !== 0) {
        return this.$t('rejection.quantityvertify');
      }
      if (shifterformancereport && shifterformancereport.production && shifterformancereport.production.length > 0) {
        const currentproduction = shifterformancereport.production.find(item => item.planid === selectedplan.planid);
        if (quantity > currentproduction.produced) {
          return this.$t('rejection.quantityvertifylimit');
        }
      }
      return '';
    },
    submitdisabled() {
      const { reason, inspectedquantity, quantity, selectedplan, quantityvertify, rejectionvertify } = this;
      return !reason || !inspectedquantity || !quantity || !selectedplan.planid ||!!quantityvertify || !!rejectionvertify
    }
  },
  methods: {
    ...mapMutations({
      setKeyboard: 'setting/SET_KEYBOARD',
      setKeyboardValue: 'setting/SET_KEYBOARD_VALUE',
    }),
    ...mapActions({
      GET_REJECTION: 'rejection/GET_REJECTION',
      POST_REJECTION: 'rejection/POST_REJECTION',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
    }),
    handleFocus(currentFocus) {
      this.currentFocus = currentFocus;
      this.setKeyboardValue('');
    },
    async submit(operator) {
      const { operatorid, operatorname } = operator;
      const { reason, inspectedquantity, quantity, machinename, businesstime, currentplan, servertime, selectedplan, remark, isQc } = this;
      const { partname, partnumber, partdescription } = selectedplan;
      if (currentplan.length === 0) {
        Toast.fail(this.$t('alert.noplanrunning'));
        return;
      }
      const { reasoncode, reasonname, category, department } = reason;
      const { planid } = currentplan[0];
      const payload = {
        reasoncode,
        reasonname,
        inspectedquantity,
        quantity,
        remark,
        isQc,
        category,
        department,
        machinename,
        partname,
        partnumber,
        partdescription,
        planid,
        operatorid,
        operatorname,
        timestamp: servertime,
        // timeType: "BUSINESS_TIME",
        assetid: 2,
      }
      const result = await this.POST_REJECTION(payload);
      if (result) {
        await this.GET_REJECTION(`?query=machinename=="${machinename}"%26%26date==${businesstime.date}%26%26shiftName=="${businesstime.shiftName}"`);
        this.$emit('closeDialog');
        this.reset();
        Toast.success(this.$t('alert.actionsuccessfully'));
      }
    },
    reset() {
      this.reasontype = '';
      this.reason = '';
      this.inspectedquantity = '';
      this.quantity = '';
      this.remark = '';
      this.isQc = false;
    }
  },
  watch: {
    keyboardValue(val) {
      this[this.currentFocus] = val;
    },
    quantity(quantity) {
      if (!quantity) {
        return false;
      }
      if (!this.inspectedquantity || (Number(this.inspectedquantity) < Number(quantity))) {
        if (!this.rejectionvertify) {
          this.inspectedquantity = quantity;
        } else {
          this.inspectedquantity = null;
        }
      }
      return true;
    },
    currentplan: {
      handler(currentplan) {
        console.log(currentplan, 'currentplan');
        this.selectedplan = currentplan[0] || {};
      },
      immediate: true
    },
    rejectionreasons(rejectionreasons) {
      this.reasonlist = rejectionreasons;
      const reasontypelist = rejectionreasons.map(reason => reason.category);
      this.reasontypelist = [...new Set(reasontypelist)];
    },
    reasontype(reasontype) {
      this.reasonlist = this.rejectionreasons.filter(reason => reason.category === reasontype );
    }
  }
}
</script>
<style scoped>
  .v-input--selection-controls{
    margin-top: 0!important;
  }
</style>
