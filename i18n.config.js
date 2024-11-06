module.exports =  {
    outPut: '../',
    input:'',
    PACKAGE_JSON : 'package.json',
    language : '',
    excludes : ['node_modules','dist','^.'],
    langFileDefaultContent:'{}',
    AppID: '440b4cce9f385b32',
    key: '3IpcveGENOsrkU3gAKAZJGtnDk5wqAh8',
    target:[],
    frameWork:'',
    from:'zh-CHS',
    vue3:{
        DepVersion : "^10.0.4",
        Dep : 'vue-i18n',
        includes : ['*.vue'],
        excludes : ['node_modules','dist','^.'],
        MAIN_JS_APPEND : `\nimport i18n from "./i18n";\n app.use(i18n)\n`,
        chineseSet : new Set(),
    }
}