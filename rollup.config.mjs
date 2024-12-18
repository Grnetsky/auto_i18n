import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json'; // 导入 JSON 插件

export default {
    input: ['bin/pI18n.js'],  // 多个入口文件
    output: [
        {
            dir: 'dist',            // 输出目录
            format: 'cjs',             // 输出格式
            entryFileNames: '[name].js', // 输出文件名模板
        },
    ],
    plugins: [
        json(),
        resolve(), // 处理模块解析
        commonjs(), // 转换 CommonJS 模块为 ES6
        babel({
            babelrc: true,
            babelHelpers: 'bundled',
        }),
    ],
    external:[]
};
