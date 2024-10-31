import fs from "fs";
import {containsChinese, replaceQuotes, startsWithAny} from "../utils/lib";
import * as htmlparser2 from "htmlparser2";
import domSerializer from "dom-serializer";


const propPrefix = [':','@','v-on','v-bind']
export function parseVue(vuePath,config) {
    if (fs.existsSync(vuePath)) {
        const content = fs.readFileSync(vuePath, { encoding: 'utf8' });
        let content2 = ''

        const match = content.match(/<template>([\s\S]*)<\/template>/);

        if (match) {
            const dom = htmlparser2.parseDocument(match[0],{ // 似乎可以只通过该类去处理
                lowerCaseTags:false,
                lowerCaseAttributeNames:false,
                recognizeSelfClosing:true
            })
            domParser(dom,config)
            let serializedHtml = domSerializer(dom, {
                decodeEntities: false, // 保留实体编码
                lowerCaseAttributeNames: false, // 保留属性名称的大小写
                lowerCaseTags: false, // 保留标签名称的大小写
                xmlMode: false, // 关闭 XML 模式
                preserveNewlines: true // 尽量保留换行符
            });
            return content.replace(match[0], serializedHtml)
        }
    }
    return null;
}


// 用正则处理文件
function replaceChinese(content,attr,config) {
    // 定义正则表达式
    const textInElementRegex = /([\u4e00-\u9fa5]+)/g;
    const textInAttributeRegex = /(.+)/g;

    let newContent = ''
    switch (attr){
        case 0:  //处理为标签内文本  '你好'
            newContent = content.replace(textInElementRegex, (match, p1) => {
                config.chineseSet.add(p1)
                return `{{$t('${p1}')}}`;
            });
            break
        case 1: //处理为文本表达式 '这是。'+1
            newContent = content.replace(textInAttributeRegex, (match, p1) => {
                config.chineseSet.add(p1)
                return `$t('${p1}')`;
            });
            break
        case 2: // 处理为属性
            newContent = replaceQuotes(content, (p1) => {
                config.chineseSet.add(p1)
            })
            break
    }
    // 处理文件内容

    //

    return newContent;
}

function domParser(dom,config){
    if (!dom)return
    // dom.childNodes.forEach(c=>c.ownerDocument)
    Array.from(dom.childNodes).forEach(child=>{
        if(child.type === 'text'){ //文本
            if(!containsChinese(child.data))return; // 不包含中文 则返回
            // 包含中文则可能存在中文与表达式共存的情况
            // 1. 纯文本 2. 表达式
            let newContent;
            if(isExp(child.data)){
                newContent = parseExp(child.data,(p1)=>{config.chineseSet.add(p1)});
            }else{
                newContent = parseText(child.data,0,config);
            }
            child.data = newContent;
        }else if(child.type === 'tag'){
            Object.entries(child.attribs).forEach(attr => {
                const propValue = attr[1];
                let prop = attr[0];
                // 不包含任何中文 则返回
                if(!containsChinese(propValue))return;
                // 发现是表达式 则只把双引号部分处理了
                if(startsWithAny(prop,propPrefix)){
                    const newContent = parseText(propValue,2,config);
                    child.attribs[prop] = newContent;
                }else { // 纯文本
                    const newContent = parseText(propValue,1,config);
                    prop = ':' + prop
                    delete child.attribs[attr[0]]
                    child.attribs[prop] = newContent;
                } // 表示为表达式 目前暂不处理
            })
            domParser(child,config)
        }else{
            console.log(child.type)
        }
    })
}

function parseText(text,attr,config) {
    const newContent = replaceChinese(text,attr,config)
    return newContent;
}

function parseExp(exp, callback) {
    // {{ }} 目前只处理这种
    const expStr = exp.replace(/{{(.*?)}}/g, (match, content) => {
        // 处理 {{...}} 内的内容
        const newContent = content.replace(/(['"])(.*?)\1/g, (match, quote, text) => {
            // 判断引号内的内容是否包含中文
            if (/([\u4e00-\u9fa5]+)/.test(text)) {
                callback(text);
                return `$t(${quote}${text}${quote})`; // 替换为 $t()
            }
            return match; // 如果没有中文，则返回原匹配
        });
        return `{{${newContent}}}`; // 保留外层 {{ }}
    });
    return expStr;
}

function isExp(text) {
    return /{{(.*?)}}/.test(text.trim())
}