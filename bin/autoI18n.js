const {select,input,Separator,checkbox } =  require('@inquirer/prompts');
const {factory} = require("../src/index");
const {getAllFolderPaths, deepAssign} = require("../src/utils/file");
const path = require("node:path");

const defaultConfig = require("../i18n.config");
const {Command} = require("commander");
const program = new Command();

program
    .command('cli')
    .description("Let's do this")
    .option('-c, --config <path>', '配置文件',)
    .action(async () => {
        let userConfig = {}
        if(program.config){
            userConfig = require(path.resolve(__dirname,program.config))
        }
        const config = deepAssign(defaultConfig, userConfig);
        const validate = !validateConfig(config)
        if(validate.error){
            throw new Error(validate.error)
        }

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

program.parse(process.argv);


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
