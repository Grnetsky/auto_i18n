import Path from "node:path";
import fs from "fs";

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

export function findFilesByExtension(directory, extension) {
    console.log(`Searching in directory: ${directory}, for extension: ${extension}`);
    let filePaths = [];
    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        for (const item of items) {
            const itemPath = Path.join(directory, item.name);

            if (item.isDirectory()) {
                // 递归调用以处理子目录
                console.log(`Entering directory: ${itemPath}`);
                const subDirFiles = findFilesByExtension(itemPath, extension);
                filePaths = filePaths.concat(subDirFiles);
            } else if (item.isFile()) {
                console.log(`Found file: ${itemPath}`);
                if (Path.extname(item.name) === extension) {
                    console.log(`File matches extension: ${itemPath}`);
                    filePaths.push(itemPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
    }

    return filePaths;
}
