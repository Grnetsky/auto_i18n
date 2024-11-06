import {createFolder, getRootDirectory, readFile, writeFile} from "./file";
import * as path from "node:path";
import defaultConfig from "../../i18n.config";
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
    config._target.forEach((lang)=>{
        const langPath = `${i18nPath}/lang/${lang}.json`
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

export function replaceQuotes(input,callback) {
    return input.replace(/(['"])(.*?)\1/g, (match, quote, p1) =>{
        callback(p1);
        return `$t(${quote}${p1}${quote})`
    });
}


function isValidVariableName(name) {
    // 检查名称是否是有效的变量名
    const variableNamePattern = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
    return variableNamePattern.test(name);
}

function normalizeVariableName(name) {
    // 将不合法的名称转换为合法的变量名
    return name.replace(/[^a-zA-Z0-9_$]+/g, '_').replace(/^[^a-zA-Z_$]+/, 'var_');
}

export function normalizeArray(arr) {
    return arr.map(name => {
        if (isValidVariableName(name)) {
            return name; // 如果是合法名称，则保持不变
        }
        return normalizeVariableName(name); // 否则转换为合法名称
    });
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

export function deepAssign(target, ...sources) {
    if (!isObject(target)) {
        throw new TypeError('Target must be an object');
    }

    sources.forEach(source => {
        if (isObject(source)) {
            Object.keys(source).forEach(key => {
                const targetValue = target[key];
                const sourceValue = source[key];

                // 如果目标值和源值均为对象，递归合并
                if (isObject(targetValue) && isObject(sourceValue)) {
                    deepAssign(targetValue, sourceValue);
                } else {
                    // 否则直接赋值
                    target[key] = sourceValue;
                }
            });
        }
    });

    return target;
}
export function initConfig(program,init = {}) {
    let userConfig = {...init}
    if(program.config){
        userConfig = require(path.resolve(__dirname,program.config))
    }
    const config = deepAssign(defaultConfig, userConfig);
    if(config.input){
        config.rootPath = getRootDirectory(config.input)
    }
    config._target = normalizeArray(config.target)
    const validate = !validateConfig(config)
    if(validate.error){
        throw new Error(validate.error)
    }
    return config
}

function validateConfig(config){
    if(config.target && !Array.isArray(config.target)){
        return {
            error:"目标语言项必须为数组"
        }
    }
    return {
        success:true
    }
}

