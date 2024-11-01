// 此功能用于webstorm的外部脚本调用
import {readFile, writeFile} from "../src/utils/file";
import config from '../i18n.config';
import {translate} from "../src/http";

const filePath = process.argv[2];
const target  = process.argv.slice(3);
config.target = target;
const fileText = readFile(filePath,'','utf8')

const chineseSet = new Set()
let jscript = ''
let pre = ''
//判断文件类型
switch (filePath.split('.').pop()) {
    case 'ts':
        jscript = fileText
        break;
    case 'js':
        jscript = fileText
        break;
    case 'vue':
        pre = `\nimport {getCurrentInstance} from 'vue';\nconst { proxy } = getCurrentInstance();\nconst $t = proxy.$t\n`
        jscript = parseVueFile(fileText)
        break;
}
writeFile(filePath,'', fileText.replace(jscript,pre + wrapChineseWithT(jscript)))


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
    console.log(json,'result')
})