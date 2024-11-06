const {select,input,Separator,checkbox } =  require('@inquirer/prompts');
const {factory} = require("../src/index");
const {getAllFolderPaths, getRootDirectory } = require("../src/utils/file");
const {initConfig,normalizeArray} = require("../src/utils/lib");
const autoJs = require("../bin/autoJs.js");
const t = require("../bin/t.js");
const path = require("node:path");

const defaultConfig = require("../i18n.config");
const {Command} = require("commander");
const program = new Command();

program
    .command('cli')
    .description("Let's do this")
    .option('-c, --config <path>', '配置文件',)
    .action(async () => {
        const config = initConfig(program)
        if(!config.frameWork) {
            config.frameWork = await select({
                message: '选择项目所使用的前端框架',
                choices: [
                    {
                        name: 'vue3',
                        value: 'vue3',
                        description: '使用vue3',
                    }
                ],
            })
        }
        if(!config.input){
            config.input = await input({ message: '输入你项目的绝对文件路径' });
        }


        !config.target.length && ( config.target = await input({ message: '输入要兼容的语言代码（具体代码可查看有道语言列表：https://ai.youdao.com/DOCSIRMA/html/trans/api/plwbfy/index.html#section-8）以空格分开' }).then((s)=>{return s.split(' ')}));

        !config.language &&  (config.language = await select({
            message: '选择项目所使用的语言',
            choices: [
                {
                    name: 'javascript',
                    value: 'js',
                },
                {
                    name: 'typescript',
                    value: 'ts',
                }
            ],
        }))

        const srcPath = path.resolve(config.input,'./src');
        const srcSubDirs = getAllFolderPaths(srcPath)
        let dealList = [path.resolve(config.input)]
        if(srcSubDirs.length > 0){
            dealList = await checkbox({
                message: 'Select a package manager',
                choices: [
                    ...srcSubDirs.map((item)=>({
                        value: item,
                        name: item,
                    }))
                ]})
        }
        // 获取目录下的路径
        factory(config,dealList);
    });

program.command('js')
    .description("翻译整个文件中js部分的内容")
    .option('-f, --file <path>', '目标文件',)
    .action(async (options,command) => {
        const config = initConfig(program,{input:options.file})
        const remainingArgs = command.args;
        if(remainingArgs) {
            config.target = remainingArgs
            config._target = normalizeArray(remainingArgs)
        }
        autoJs.default(config)
    })

program.command('t')
    .description("翻译整个文件中的$t()包裹的内容")
    .option('-f, --file <path>', '目标文件',)
    .action(async (options,command) => {
        const config = initConfig(program,{input:options.file})
        const remainingArgs = command.args;
        if(remainingArgs) {
            config.target = remainingArgs
            config._target = normalizeArray(remainingArgs)
        }
        t.default(config)
    })

program.parse(process.argv);


