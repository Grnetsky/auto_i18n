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
                // 需要递归获取子目录递归调用
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

    // 将路径分割为数组，
    const pathSegments = filePath.split(path.sep);

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
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err);
            return;
        }

        const newData = textToPrepend + data;

        fs.writeFile(filePath, newData, 'utf8', (err) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    });
}