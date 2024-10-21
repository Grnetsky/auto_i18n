const { parse, compileTemplate } = require('@vue/compiler-sfc');
const { parse: parseTemplate, transform } = require('@vue/compiler-dom');
const fs = require('fs');
const path = require('path');

// 读取 .vue 文件
const filePath = path.resolve(__dirname, 'test.vue');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// 解析 .vue 文件
const { descriptor } = parse(fileContent);

// 解析模板 AST
const templateAST = parseTemplate(descriptor.template.content);
// console.log(templateAST,'ast')

// 遍历并修改 AST
function processTextNodes(node) {
    if (node.type === 2) { // 文本节点
        console.log(node,'xxxxxxxxxxxxx')
        node.content = node.content.replace(/([\u4e00-\u9fa5]+)/g, '"\$1"');

    } else if (node.children) {
        node.children.forEach(processTextNodes);
    }
}

processTextNodes(templateAST);

// 反向生成模板字符串
function astToString(node) {
    if (node.type === 2) { // 文本节点
        return node.content;
    } else if (node.type === 1) { // 元素节点
        let tagOpen = `<${node.tag}`;
        if (node.props.length) {
            const props = node.props.map(prop => `${prop.name}="${prop.value.content}"`).join(' ');
            tagOpen += ` ${props}`;
        }
        tagOpen += '>';
        const children = node.children.map(astToString).join('');
        const tagClose = `</${node.tag}>`;
        return `${tagOpen}${children}${tagClose}`;

    }
    return '';
}

const newTemplateContent = astToString(templateAST);
console.log(newTemplateContent,'xxxxxx')

console.log(descriptor,'xxxdddddddddddd')
// 重新组合 .vue 文件内容
const newVueFileContent = `
<template>
${newTemplateContent}
</template>

<script>
${descriptor.scriptSetup.content}
</script>

<style>
${descriptor.styles.map(style => style.content).join('\n')}
</style>
`;

// 输出新的 .vue 文件内容
const outputFilePath = path.resolve(__dirname, 'ModifiedComponent.vue');
fs.writeFileSync(outputFilePath, newVueFileContent);

console.log('Modified .vue file has been generated:', outputFilePath);
