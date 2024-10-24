export const PACKAGE_JSON = 'package.json'
export const VUE_I18N_VERSION = "^10.0.4"
export const VUE_I18N = 'vue-i18n'
export const includes = ['*.vue']
export const excludes = ['node_modules','dist','^.']
export const MAIN_JS_APPEND = `\nimport i18n from "./i18n";\n
app.use(i18n)\n`

export const chineseSet = new Set()
export const translateMap = {}