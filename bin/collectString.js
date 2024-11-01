// 此功能用于webstorm的外部脚本调用
import {readFile,writeFile} from "../src/utils/file";

const filePath = process.argv[2];
const fileText = readFile(filePath,'','utf8')

let jscript = ''
//判断文件类型
switch (filePath.split('.').pop()) {

    case 'ts':
        jscript = fileText
        break;
    case 'js':
        jscript = fileText
        break;
    case 'vue':
        jscript = parseVueFile(fileText)
        break;
}
writeFile(filePath,'', fileText.replace(jscript,wrapChineseWithT(jscript)))


function parseVueFile(fileText) {
    const match = fileText.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
    if (match) {
        return match[1]
    }
    return ''
}

function wrapChineseWithT(scriptContent) {
    // 定义一个正则表达式来匹配包含中文字符的字符串
    const chineseRegex = /(["'`])([^"'`]*[\u4e00-\u9fa5]+[^"'`]*)\1/g;

    // 使用 replace 方法替换中文字符串
    return scriptContent.replace(chineseRegex, (fullMatch, quote, chineseString) => {
        // 返回用 $t() 包裹的字符串
        return `$t(${quote}${chineseString}${quote})`;
    });
}