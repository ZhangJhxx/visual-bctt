import Vue from 'vue'
import VueI18n from 'vue-i18n'
// element-ui lang
import elementEnLocale from 'element-ui/lib/locale/lang/en'
// element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from './en'
import zhLocale from './zh-cn'
import store from '@/store'
Vue.use(VueI18n)
// http: //element-cn.eleme.io/2.4/#/zh-CN/component/i18n
// 非5.x版本vue-i18n 需要用一下方式兼容
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}
const i18n = new VueI18n({
  // set locale
  // options: en or zh
  messages
})
export default i18n