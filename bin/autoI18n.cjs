const { Command } = require('commander');
const {select,input,Separator,checkbox } =  require('@inquirer/prompts');
const {factory} = require("../src/index");
const cliConfig = require("../src/config");


const program = new Command();

program
    .command('cli')
    .description("Let's do this")
    .action(async () => {
        const frameWork = await select({
            message: '选择项目所使用的前端框架',
            choices: [
                {
                    name: 'vue3',
                    value: 'vue3',
                    description: '使用vue3',
                },
                {
                    name: 'vue2',
                    value: 'vue2',
                    description: '使用vue2',
                }
            ],
        })

        const dirPath= await input({ message: '输入你项目的绝对文件路径' });
        console.log(frameWork,dirPath);
        const language= await input({ message: '输入要兼容的语言代码（具体代码可查看有道语言列表：https://ai.youdao.com/DOCSIRMA/html/trans/api/plwbfy/index.html#section-8）以空格分开' });
        const languageList = language.split(' ')
        const codeLanguage = await select({
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
        })
        cliConfig.LANGUAGE = codeLanguage;
        console.log(cliConfig.LANGUAGE,'xxxxxxxmmmmmmmmmmmmmmmmmmmm');

        const dealList = await checkbox({
            message: 'Select a package manager',
            choices: [
                { name: 'npm', value: 'npm' },
                { name: 'yarn', value: 'yarn' },
                new Separator(),
                { name: 'pnpm', value: 'pnpm', disabled: true },
                {
                    name: 'pnpm',
                    value: 'pnpm',
                    disabled: '(pnpm is not available)',
                },
            ]})
        factory(frameWork,dirPath,languageList,codeLanguage);
    });

program.parse(process.argv);
