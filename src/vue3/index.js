// 引入相关模块
const fs = require('fs');
const path = require('path');
const { parse, compileTemplate } = require('@vue/compiler-sfc');
const { parse: parseTemplate, transform } = require('@vue/compiler-dom');
const { readFile, writeFile } = require('../utils/file');

// 定义常量
const PACKAGE_JSON = '../config/PACKAGE_JSON';
const VUE_I18N_VERSION = require('../config/VUE_I18N_VERSION');

// 定义函数来处理 Vue 文件
function processVueFile(filePath) {
    // 读取文件内容
    const fileContent = readFile(filePath);

    // 解析 Vue 文件
    const { descriptor } = parse(fileContent);

    // 解析模板 AST
    const templateAST = parseTemplate(descriptor.template.content);

    // 遍历并修改 AST
    function processTextNodes(node) {
        if (node.type === 2) { // 文本节点
            node.content = node.content.replace(/([\u4e00-\u9fa5]+)/g, '"\$t(\$1)"');
        } else if (node.children) {
            node.children.forEach(processTextNodes);
        }
    }

    processTextNodes(templateAST);

    // 反向生成模板字符串
    function astToString(node) {
        if (node.type === 2) { // 文本节点
            return node.content;
        } else if (node.type === 0 || node.type === 1) { // 元素节点
            let tagOpen = `<${node.tag}`;
            if (node.props?.length) {
                const props = node.props.map(prop => `${prop.rawName}="${prop.exp}${(prop)}"`).join(' ');
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

    // 重新组合 Vue 文件内容
    const newVueFileContent = `
    <template>
    ${newTemplateContent}
    </template>
    <script>
    ${descriptor.script?.content}
    </script>
    <style>
    ${descriptor.styles.map(style => style.content).join('\n')}
    </style>
    `;

    // 写入新的 Vue 文件内容
    writeFile(filePath, newVueFileContent);
}

// 导出函数
module.exports = {
    processVueFile
};
