import {createFolder, readFile, writeFile} from "./file";
export function addI18nInPackageJon(config){
    const packageJson = JSON.parse(readFile(config.input,config.PACKAGE_JSON))
    packageJson.dependencies[config[config.frameWork].Dep] = config[config.frameWork].DepVersion
    writeFile(config.input,config.PACKAGE_JSON,JSON.stringify(packageJson,null,2))
}

export function createI18NFolder(config){
    const i18nPath = `${config.input}/src/i18n`
    const langPath = `${i18nPath}/lang`
    const indexPath = `${i18nPath}/index.` + config.language

    createFolder(config.input,i18nPath)
    createFolder(config.input,langPath)
    writeFile(config.input,indexPath,'')
    return i18nPath
}

export function createLanguageFiles(i18nPath,config) {
    config.target.forEach((lang)=>{
        const langPath = `${i18nPath}/lang/${lang}.` + config.language
        writeFile(i18nPath,langPath,config.langFileDefaultContent)
    })
}

export function decodeHTMLEntities(text) {
    const entities = {
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&#39;': "'"
    };
    return text.replace(/&[a-z]+;/g, match => entities[match] || match);
}

export function containsChinese(str) {
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(str);
}

export function startsWithAny(str, charList) {
    return charList.some(char => str.startsWith(char));
}
