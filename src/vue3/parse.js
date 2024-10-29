import fs from "fs";
import {containsChinese, startsWithAny} from "../utils/lib";
import * as htmlparser2 from "htmlparser2";
import domSerializer from "dom-serializer";


const propPrefix = [':','@','v-on','v-bind']
export function parseVue(vuePath,config) {
    if (fs.existsSync(vuePath)) {
        const content = fs.readFileSync(vuePath, { encoding: 'utf8' });
        let content2 = ''

        const match = content.match(/<template>([\s\S]*)<\/template>/);

        if (match) {
            const dom = htmlparser2.parseDocument(match[0],{
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

    let newContent = ''
    if (!attr){
        newContent = content.replace(textInElementRegex, (match, p1) => {
            config.chineseSet.add(p1)
            return `{{$t('${p1}')}}`;
        });
    }else {
        newContent = content.replace(textInElementRegex, (match, p1) => {
            config.chineseSet.add(p1)
            return `$t('${p1}')`;
        });
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
            const newContent = parseText(child.data,false,config);
            child.data = newContent;
        }else if(child.type === 'tag'){
            Object.entries(child.attribs).forEach(attr => {
                const propValue = attr[1];
                let prop = attr[0];
                if(startsWithAny(prop,propPrefix))return // 表示为表达式 目前暂不处理
                const newContent = parseText(propValue,true,config);
                if(containsChinese(newContent) && !startsWithAny(prop,propPrefix)){
                    prop = ':' + prop
                    delete child.attribs[attr[0]]
                    child.attribs[prop] = newContent;
                }
                child.attribs[prop] = newContent;
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