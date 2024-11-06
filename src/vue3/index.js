import {appendFile, createFolder, findFilesByExtension, writeFile} from '../utils/file.js';

// 定义常量

import {addI18nInPackageJon, createI18NFolder, createLanguageFiles, normalizeArray} from "../utils/lib";
import Path from "node:path";
import {parseVue} from "./parse";
import {translate} from "../http";

export default function vue3Modifier(config,resolePaths){
    const srcPath = Path.resolve(config.input,'src');
    const vue3Config = config.vue3
    //1.在package.json中 安装vue-i18n
    addI18nInPackageJon(config);
    //2.在src/下创建 i18n文件夹
    const i18nPath = createI18NFolder(config)    //4.在main.js中引入vue-i18n
    //3.在i18n文件夹下创建语言文件
    createLanguageFiles(i18nPath,config)
    // 4. 写入index.js中的内容
    const indexContent = `import {createI18n} from 'vue-i18n';\nimport {${config._target.join(',')}} from './lang';
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('i18n') || navigator.language,    
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,  
    fallbackLocale: 'zh',
    globalInjection: true,  
    messages: {
        ${config._target.join(',')}
    },
    missing(locale,key){
        return key;
    }
});

export default i18n;
`
    writeFile(i18nPath,'index.' + config.language,indexContent)
    const langIndexContent = config._target.reduce((acc, cur)=>{
        return acc + `import ${'_'+cur} from './${cur}.json';\n`
    },'')

    const exportContent = config._target.reduce((acc, cur)=>{
        return acc + `export const ${cur} = ${'_'+cur};\n`
    },'')
    writeFile(Path.resolve(i18nPath,'./lang'),'index.'+ config.language,langIndexContent + exportContent);
    appendFile(srcPath,'main.'+config.language,vue3Config.MAIN_JS_APPEND);
    if(resolePaths.length > 0){
        // 处理指定路径下的.vue文件
        const vueList = []
        resolePaths.forEach((item)=>{
             vueList.push(...findFilesByExtension(item,'.vue'))
        })
        vueList.push(...findFilesByExtension(srcPath,'.vue',false))
        vueList.forEach((vue)=>{
            const content = parseVue(vue,vue3Config)
            writeFile(vue,'',content)
        })
        translate(Array.from(vue3Config.chineseSet),Path.resolve(i18nPath,'./lang'),config).then(()=>{
            console.log("执行完成(cli-vue3)")
        })
    }
    // 处理所有.vue文件

}