const fs = require('fs');
const path = require('path');
const { OpenCC } = require('opencc');

// 获取命令行参数
const filePath = process.argv[2];
const target = process.argv[3] || 't'; // 默认转换为繁体

// 根据目标语言创建 OpenCC 实例
let openccConfig;
switch (target) {
    case 't':
        openccConfig = 's2t.json';
        break;
    case 's':
        openccConfig = 't2s.json';
        break;
    // 可以添加其他转换配置
    default:
        console.error('未知的目标语言，仅支持 "t" 或 "s"');
        process.exit(1);
}
const opencc = new OpenCC(openccConfig);

/**
 * 转换并复制文件/文件夹的名字到目标路径
 * @param {string} srcPath 源文件夹路径
 * @param {string} destPath 目标文件夹路径
 */
async function convertAndCopy(srcPath, destPath) {
    // 读取源文件夹的内容
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });

    for (let entry of entries) {
        // 转换名称
        const traditionalName = await opencc.convertPromise(entry.name);

        const srcFullPath = path.join(srcPath, entry.name);
        const destFullPath = path.join(destPath, traditionalName);

        if (entry.isDirectory()) {
            fs.mkdirSync(destFullPath, { recursive: true });
            await convertAndCopy(srcFullPath, destFullPath);
        } else if (entry.isFile()) {
            // 复制文件
            fs.copyFileSync(srcFullPath, destFullPath);
        }
    }
}

(async () => {
    const sourceDirectory = path.resolve(__dirname, filePath);
    const sourceDirName = path.basename(sourceDirectory);
    const targetDirName = `${sourceDirName}_${target}`;
    const destinationDirectory = path.resolve(sourceDirectory, '../', targetDirName);

    try {
        // 确保目标目录存在
        fs.mkdirSync(destinationDirectory, { recursive: true });

        // 开始转换和复制
        await convertAndCopy(sourceDirectory, destinationDirectory);
        console.log(`转换完成，新目录名为: ${targetDirName}`);
    } catch (error) {
        console.error('出现错误:', error);
    }
})();
