<template>
  <van-number-keyboard
    :title="value"
    theme="custom"
    :extra-key="['.','_']"
    :show="show"
    v-model="value"
    close-button-text="OK"
    @blur="show = false"
    @input="onInput"
    @delete="onDelete"
    @close="onClose"
    z-index="300"
  />
</template>

<script>
import { NumberKeyboard } from 'vant';
import { mapState,mapMutations } from 'vuex';
export default {
  name: 'Keyboard',
  data (){
    return {
    }
  },
  components: {
    VanNumberKeyboard: NumberKeyboard
  },
  methods: {
    ...mapMutations({
      setKeyboard: 'setting/SET_KEYBOARD',
      setKeyboardValue: 'setting/SET_KEYBOARD_VALUE',
    }),
    onInput(keyCode) {
      console.log(keyCode);
    },
    onDelete(val) {
      console.log(val);
    },
    onClose() {
      console.log('close');
    },
  },
  computed: {
    ...mapState({
      isShowKeyboard: state => state.setting.isShowKeyboard,
      keyboardValue: state => state.setting.keyboardValue,
    }),
    show: {
      set(val) {
        this.setKeyboard(val);
      },
      get() {
        return this.isShowKeyboard;
      }
    },
    value: {
      set(val) {
        this.setKeyboardValue(val);
      },
      get() {
        return this.keyboardValue;
      }
    },
  },
  watch: {
    show(show) {
      if (!show) {
        document.querySelectorAll('input').forEach((inputElement) => {
          inputElement.blur();
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .col{
    padding: 0;
  }
</style>
