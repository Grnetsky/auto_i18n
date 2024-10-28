export default {
    outPut: '../',
    input:'',
    PACKAGE_JSON : 'package.json',
    language : 'js',
    excludes : ['node_modules','dist','^.'],
    langFileDefaultContent:'const a = {};export default a',
    AppID: '440b4cce9f385b32',
    key: '3IpcveGENOsrkU3gAKAZJGtnDk5wqAh8',
    target:['en'],
    framework:'',
    vue3:{
        VUE_I18N_VERSION : "^10.0.4",
        VUE_I18N : 'vue-i18n',
        includes : ['*.vue'],
        excludes : ['node_modules','dist','^.'],
        MAIN_JS_APPEND : `\nimport i18n from "./i18n";\n app.use(i18n)\n`,
        chineseSet : new Set(),
    }
}