import fs from "fs";
import {chineseSet} from "./config";
import DomParser,{XMLSerializer} from "xmldom";
export function parseVue(vuePath) {
    if (fs.existsSync(vuePath)) {
        const content = fs.readFileSync(vuePath, { encoding: 'utf8' });
        let content2 = ''
        const doc = new DomParser.DOMParser().parseFromString(content, 'text/xml');
        const template = doc.getElementsByTagName('template')[0];

        if (template) {
            const serializer = new XMLSerializer();
            for (let i = 0; i < template.childNodes.length; i++) {
                const child = template.childNodes[i];
                content2 += serializer.serializeToString(child);
            }
            console.log('Template content:', content);
        } else {
            console.log('No <template> tag found.');
        }
        const newContent = replaceChinese(content2)
        return content.replace(content2, newContent);

    }
    return null;
}

// 用正则处理文件
function replaceChinese(content) {
    // 定义正则表达式
    const textInElementRegex = /([\u4e00-\u9fa5]+)/g;
    const textInAttributeRegex = /(\w+)=["']([^"']*[\u4e00-\u9fa5][^"']*)["']/g;

    // 处理文件内容
    let newContent = content.replace(textInElementRegex, (match, p1) => {
        chineseSet.add(p1)
        return `{{$t('${p1}')}}`;
    });
    //
    // newContent = newContent.replace(textInAttributeRegex, (match, p1, p2) => {
    //     chineseSet.add(p2)
    //     return `:${p1}="$t('${p2}')"`;
    // });

    return newContent;
}
// 用vue解析器处理文件
function repeatWithVue(content){

}