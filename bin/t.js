// 此功能用于webstorm的外部脚本调用
import {readFile, writeFile} from "../src/utils/file";
import {translate} from "../src/http";
export default (config)=>{

    const fileText = readFile(config.input,'','utf8')
    const re = /\$t\(\s*(["'`])([^"'`]*)\1\s*\)/g;
    let matches;
    const results = [];

    while ((matches = re.exec(fileText)) !== null) {
        results.push(matches[2]); // matches[2] 是捕获组内的文字
    }
    translate(results,undefined,config,false).then((json)=>{
        json.forEach((item,index) => {
            if(item.status ===  'fulfilled'){
                const data = item.value
                const langPath = `${config.rootPath}/src/i18n/lang/${config._target[index]}.json`
                const langJson = JSON.parse(readFile(config.input,langPath))
                Object.assign(langJson,data)
                writeFile(langPath,'',JSON.stringify(langJson,null,2))
            }
        })
        console.log("执行完成(t)")
    })
}