// 此功能用于webstorm的外部脚本调用
import {readFile, writeFile} from "../src/utils/file";
import {translate} from "../src/http";

export default (config)=>{
    const fileText = readFile(config.input,'','utf8')

    const chineseSet = new Set()
    let jscript = ''
    let pre = ''
//判断文件类型
    switch (config.input.split('.').pop()) {
        case 'ts':
            jscript = fileText
            pre = `import i18n from "/src/i18n"\nconst $t = i18n.global.t\n`
            break;
        case 'js':
            jscript = fileText
            pre = `import i18n from "/src/i18n"\nconst $t = i18n.global.t\n`
            break;
        case 'vue':
            pre = `\nimport {getCurrentInstance} from 'vue';\nconst { proxy } = getCurrentInstance();\nconst $t = proxy.$t\n`
            jscript = parseVueFile(fileText)
            break;
    }
    writeFile(config.input,'', fileText.replace(jscript,pre + wrapChineseWithT(jscript)))


    function parseVueFile(fileText) {
        const match = fileText.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
        if (match) {
            return match[1]
        }
        return ''
    }

    function wrapChineseWithT(scriptContent) {
        //
        const chineseRegex = /(["'`])([^"'`]*[\u4e00-\u9fa5]+[^"'`]*)\1/g;

        return scriptContent.replace(chineseRegex, (fullMatch, quote, chineseString) => {
            chineseSet.add(chineseString)
            return `$t(${quote}${chineseString}${quote})`;
        });
    }

    translate(Array.from(chineseSet),undefined,config,false).then((json)=>{
        json.forEach((item,index) => {
            if(item.status ===  'fulfilled'){
                const data = item.value
                const langPath = `${config.rootPath}/src/i18n/lang/${config._target[index]}.json`
                const langJson = JSON.parse(readFile(config.input,langPath))
                Object.assign(langJson,data)
                writeFile(langPath,'',JSON.stringify(langJson,null,2))
            }
        })
        console.log("执行完成(js)")
    })
}
