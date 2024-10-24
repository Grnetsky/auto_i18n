// const { parse, compileTemplate } = require('@vue/compiler-sfc');
// const { parse: parseTemplate, transform } = require('@vue/compiler-dom');
//
// // 读取 .vue 文件
// const filePath = path.resolve(__dirname, 'test.vue');
// const fileContent = fs.readFileSync(filePath, 'utf-8');
//
// // 解析 .vue 文件
// const { descriptor } = parse(fileContent);
//
// // 解析模板 AST
// const templateAST = parseTemplate(descriptor.template.content);
// // console.log(templateAST,'ast')
//
// // 遍历并修改 AST
// function processTextNodes(node) {
//     console.log(node)
//     if (node.type === 2) { // 文本节点
//         console.log(node,'xxxxxxxxxxxxx')
//         node.content = node.content.replace(/([\u4e00-\u9fa5]+)/g, '"\$1"');
//
//     } else if (node.children) {
//         node.children.forEach(processTextNodes);
//     }
// }
//
// processTextNodes(templateAST);
//
// // 反向生成模板字符串
// function astToString(node) {
//     console.log(node)
//     if (node.type === 2) { // 文本节点
//         return node.content;
//     } else if (node.type === 0 || node.type === 1) { // 元素节点
//         let tagOpen = `<${node.tag}`;
//         if (node.props?.length) {
//             const props = node.props.map(prop => `${prop.rawName}="${prop.exp}${(prop)}"`).join(' ');
//             tagOpen += ` ${props}`;
//         }
//         tagOpen += '>';
//         const children = node.children.map(astToString).join('');
//         const tagClose = `</${node.tag}>`;
//         return `${tagOpen}${children}${tagClose}`;
//     }
//     return '';
// }
//
// const newTemplateContent = astToString(templateAST);
// console.log(newTemplateContent,'xxxxxx')
//
// // 重新组合 .vue 文件内容
// const newVueFileContent = `
// <template>
// ${newTemplateContent}
// </template>
//
// <script>
// ${descriptor.script?.content}
// </script>
//
// <style>
// ${descriptor.styles.map(style => style.content).join('\n')}
// </style>
// `;
//
// // 输出新的 .vue 文件内容
// const outputFilePath = path.resolve(__dirname, 'ModifiedComponent.vue');
// fs.writeFileSync(outputFilePath, newVueFileContent);
//
// console.log('Modified .vue file has been generated:', outputFilePath);
import {appendFile, createFolder, findFilesByExtension, writeFile} from '../utils/file.js';

// 定义常量

import cliConfig from '../config.js';
import {addI18nInPackageJon, createI18NFolder, createLanguageFiles} from "../utils/lib";
import {VUE_I18N_VERSION, VUE_I18N, MAIN_JS_APPEND, chineseSet} from "./config";
import Path from "node:path";
import {parseVue} from "./parse";
import {translate} from "../http";

export default function vue3Modifier(dirRootPath,languageList,codeLanguage,resolePaths){
    cliConfig.LANGUAGE = codeLanguage;
    const srcPath = Path.resolve(dirRootPath,'src');
    //1.在package.json中 安装vue-i18n
    addI18nInPackageJon(dirRootPath,VUE_I18N,VUE_I18N_VERSION);
    //2.在src/下创建 i18n文件夹
    const i18nPath = createI18NFolder(dirRootPath)    //4.在main.js中引入vue-i18n

    //3.在i18n文件夹下创建语言文件
    createLanguageFiles(i18nPath,languageList)
    // 4. 写入index.js中的内容
    const indexPath = `${i18nPath}/index.` + cliConfig.LANGUAGE
    const indexContent = `import {createI18n} from 'vue-i18n';
    import {${languageList.join(',')}} from './lang';
    const i18n = new createI18n({
        legacy: false,
        locale: localStorage.getItem('i18n') || navigator.language,    
        silentTranslationWarn: true,
        missingWarn: false,
        silentFallbackWarn: true,
        fallbackWarn: false,  
        globalInjection: true,  
        messages: {
            ${languageList.join(',')}
        }
    });

export default i18n;
`
    writeFile(i18nPath,'index.' + cliConfig.LANGUAGE,indexContent)
    const langIndexContent = languageList.reduce((acc, cur)=>{
        return acc + `export {default as ${cur}} from './${cur}.${cliConfig.LANGUAGE}';\n`
    },'')
    writeFile(Path.resolve(i18nPath,'./lang'),'index.'+ cliConfig.LANGUAGE,langIndexContent);
    appendFile(srcPath,'main.'+cliConfig.LANGUAGE,MAIN_JS_APPEND);

    if(resolePaths.length > 0){
        // 处理指定路径下的.vue文件
        resolePaths.forEach((item)=>{
            const vueList = findFilesByExtension(item,'.vue')
            console.log(vueList,'xxxxxxxxxxxxxxxxx')
            vueList.forEach((vue)=>{
                const content = parseVue(vue)
                writeFile(vue,'',content)
            })
            translate(Array.from(chineseSet),languageList,Path.resolve(i18nPath,'./lang'),codeLanguage)
        })
    }
    // 处理所有.vue文件

}