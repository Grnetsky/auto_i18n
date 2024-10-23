import {createFolder, readFile, writeFile} from "./file";
import cliConfig from "../config";

export function addI18nInPackageJon(packagePath,libName,version){
    const packageJson = JSON.parse(readFile(packagePath,cliConfig.PACKAGE_JSON))
    packageJson.dependencies[libName] = version
    writeFile(packagePath,cliConfig.PACKAGE_JSON,JSON.stringify(packageJson,null,2))
}

export function createI18NFolder(dirRootPath){
    const i18nPath = `${dirRootPath}/src/i18n`
    const langPath = `${i18nPath}/lang`
    const indexPath = `${i18nPath}/index.` + cliConfig.LANGUAGE

    createFolder(dirRootPath,i18nPath)
    createFolder(dirRootPath,langPath)
    writeFile(dirRootPath,indexPath,'')
    return i18nPath
}

export function createLanguageFiles(i18nPath,langList) {
    langList.forEach((lang)=>{
        const langPath = `${i18nPath}/lang/${lang}.` + cliConfig.LANGUAGE
        writeFile(i18nPath,langPath,cliConfig.LangFileDefaultContent)
    })
}