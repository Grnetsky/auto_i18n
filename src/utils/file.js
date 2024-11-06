import Path from "node:path";
import fs from "fs";
import path from "node:path";

export function readFile(path, fileName, code = "utf8") {
    const filePath = Path.resolve(path,fileName);
    let res =  ''
    res = fs.readFileSync(filePath, {encoding:code});
    return res
}
// 写入文件
export function writeFile(path,fileName,content,code = "utf8",) {
    const filePath = Path.resolve(path,fileName);
    fs.writeFileSync(filePath, content, {encoding:code})
    return filePath;
}



// 创建新文

export function createFolder(path,fileName) {
    const filePath = Path.resolve(path,fileName);
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    return filePath;
}

export function appendFile(path,fileName,content) {
    const filePath = Path.resolve(path,fileName);
    fs.appendFileSync(filePath, content);
    return filePath;
}

export function getAllFolderPaths(directory) {
    let folderPaths = [];

    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        for (const item of items) {
            if (item.isDirectory()) {
                const folderPath = Path.join(directory, item.name);
                folderPaths.push(folderPath);
                // 如果需要递归获取子目录，可以递归调用
                // const subFolderPaths = await getAllFolderPaths(folderPath);
                // folderPaths = folderPaths.concat(subFolderPaths);
            }
        }
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
    }

    return folderPaths;
}

export function getRootDirectory(filePath) {

    // 将路径分割为数组，示例: ['C:', 'Users', 'Andy', 'Desktop', '蔡豪', 'account-fe', 'src', 'i18n', 'language']
    const pathSegments = filePath.split(path.sep);

    // 查找 'src' 的索引，假设 'src' 是项目根目录后的第一个目录
    const srcIndex = pathSegments.indexOf('src');

    if (srcIndex === -1) {
        throw new Error("The specified path is not within a recognizable Vue project structure.");
    }

    // 构建根目录路径
    const rootPath = pathSegments.slice(0, srcIndex).join(path.sep);

    return rootPath;
}

export function findFilesByExtension(directory, extension,recursion = true) {
    let filePaths = [];
    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        for (const item of items) {
            const itemPath = Path.join(directory, item.name);

            if (item.isDirectory() && recursion) {
                // 递归调用以处理子目录
                const subDirFiles = findFilesByExtension(itemPath, extension);
                filePaths = filePaths.concat(subDirFiles);
            } else if (item.isFile()) {
                if (Path.extname(item.name) === extension) {
                    filePaths.push(itemPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
    }

    return filePaths;
}




export function prependTextToFile(filePath, textToPrepend, callback) {
    // 读取文件内容
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        // 在文件内容前面添加文本
        const newData = textToPrepend + data;

        // 将新的内容写回文件
        fs.writeFile(filePath, newData, 'utf8', (err) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });
}