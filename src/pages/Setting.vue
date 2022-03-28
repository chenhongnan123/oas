<template>
  <div class="setting d-flex height100 width100">
    <div style="width:50%;">
      <v-text-field
        :value="serverip"
        :label="$t('setting.serverip')"
        readonly
      ></v-text-field>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <!-- <v-btn color="primary" @click="HANDLE_AUTHACTION({authaction:action.updateip,callback:goInital})">{{$t('setting.updatebtn')}}</v-btn> -->
      </div>
      <v-select
        v-model="theme"
        :items="themeItems"
        :label="$t('setting.selecttheme')"
        item-text="name"
        item-value="id"
      ></v-select>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="changeTheme(theme)">{{$t('setting.updatebtn')}}</v-btn>
      </div>
      <v-select
        v-model="language"
        :items="languageItems"
        :label="$t('setting.selectlanguage')"
        item-text="name"
        item-value="id"
      ></v-select>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="changeLanguage(language)">{{$t('setting.updatebtn')}}</v-btn>
      </div>
    </div>
    <v-divider vertical class="mx-2"/>
    <div style="width:50%;">
      <v-card>
        <v-card-title>
          {{$t('setting.machinename')}}
        </v-card-title>
        <v-card-text style="height: calc(100vh - 250px);overflow:scroll;" class="pb-5">
          <v-radio-group v-model="machinename">
            <v-radio
              v-for="machine in machineList"
              :key="machine._id"
              :label="machine.machinename"
              :value="machine.machinename"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn color="primary" class="mt-5" :disabled="!machinename" @click="HANDLE_AUTHACTION({authaction:action.updatemachine,callback:updateMachine})">{{$t('setting.updatebtn')}}</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { Toast } from 'vant';
export default {
  name: 'Setting',
  data (){
    return {
      currentFocus: '',
      machineList: [],
      serverip: '',
      machinename: '',
      themeItems: [
        {name:'浅色模式', id:'light'},
        {name:'深色模式', id:'dark'},
      ],
      theme: localStorage.getItem('theme')||'dark',
      languageItems: [
        {name:'English', id:'en'},
        {name:'中文', id:'zh'},
      ],
      language: localStorage.getItem('language')||'zh',
    }
  },
  computed: {
    ...mapState({
      keyboardValue: state => state.setting.keyboardValue,
      action: state => state.setting.config.action,
    }),
  },
  watch: {
    keyboardValue(val) {
      this[this.currentFocus] = val;
    },
    '$i18n.locale'() {
      this.themeItems = [
        {name:this.$t('setting.light'), id:'light'},
        {name:this.$t('setting.dark'), id:'dark'},
      ]
      this.SET_ALERTERRORMSSAGE(this.$t('alert.networkerror'));
    }
  },
  async created() {
    const machineList = await this.GET_MACHINE();
    this.machineList = machineList.reverse();
    this.serverip = window.location.host;
  },
  methods: {
    ...mapMutations({
      setKeyboard: 'setting/SET_KEYBOARD',
      setKeyboardValue: 'setting/SET_KEYBOARD_VALUE',
      SET_MACHINENAME: 'setting/SET_MACHINENAME',
      SET_ALERTERRORMSSAGE: 'setting/SET_ALERTERRORMSSAGE',
    }),
    ...mapActions({
      GET_MACHINE: 'setting/GET_MACHINE',
      HANDLE_AUTHACTION: 'login/HANDLE_AUTHACTION',
    }),
    handleFocus(currentFocus) {
      if (this.currentFocus !== currentFocus) {
        this.currentFocus = currentFocus;
        this.setKeyboardValue('');
      }
    },
    changeTheme(id) {
      this.$vuetify.theme.dark = (id === 'dark' ? true : false);
      localStorage.setItem('theme', id);
      localStorage.setItem('dark', (id === 'dark' ? true : false));
    },
    changeLanguage(id) {
      this.$i18n.locale = id;
      localStorage.setItem('language', id);
    },
    async updateMachine() {
      const { machinename } = this;
      localStorage.setItem('machinename', machinename);
      this.SET_MACHINENAME(machinename);
      Toast.success(this.$t('alert.actionsuccessfully'));
      this.$router.push('/admin');
    },
    goInital() {
      Toast.success('敬请期待');
    }
  }
}
</script>
