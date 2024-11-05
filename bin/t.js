// 此功能用于webstorm的外部脚本调用
import {readFile, writeFile} from "../src/utils/file";
import config from '../i18n.config';
import {translate} from "../src/http";

const filePath = process.argv[2];
const target  = process.argv.slice(3);
config.target = target;
const fileText = readFile(filePath,'','utf8')
const re = /\$t\(\s*(["'`])([^"'`]*)\1\s*\)/g;
let matches;
const results = [];

while ((matches = re.exec(fileText)) !== null) {
    results.push(matches[2]); // matches[2] 是捕获组内的文字
}
console.log(results)
translate(results,undefined,config,false).then((json)=>{
    console.log(json)
})