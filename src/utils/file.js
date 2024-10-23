import Path from "node:path";
import fs from "fs";

export function readFile(path, fileName, code = "utf8") {
    const filePath = Path.resolve(path,fileName);
    console.log(filePath,'xxxxxxxxxx');
    let res =  ''
    res = fs.readFileSync(filePath, {encoding:code});
    console.log(res,'res')
    return res
}
// 写入文件
export function writeFile(path,fileName,content,code = "utf8",) {
    const filePath = Path.resolve(path,fileName);
    console.log(fileName,content,'content')
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