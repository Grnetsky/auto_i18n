import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json'; // 导入 JSON 插件

export default {
    input: 'bin/autoI18n.js', // 入口文件路径
    output: {
        file: 'dist/bundle.js', // 输出文件路径
        format: 'cjs' // 输出格式为 CommonJS
    },
    plugins: [
        json(),
        resolve(), // 处理模块解析
        commonjs(), // 转换 CommonJS 模块为 ES6
        babel({
            exclude: 'node_modules/**',
        }),
    ],
    external:[]
};
