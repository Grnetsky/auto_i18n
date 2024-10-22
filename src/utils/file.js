import Path from "node:path";
import fs from "fs";

function readFile(path,fileName,code = "utf8") {
    const filePath = Path.resolve(path,fileName);
    let res =  ''
    fs.readFile(filePath, code, (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return ''
        }
        res = data
    });
    return res
}
// 写入文件
export function writeFile(path,fileName,code = "utf8",content) {
    const filePath = Path.resolve(path,fileName);
    fs.writeFile(filePath, content, {encoding:code}, (err) => {
        if (err) {
            console.error(`Error writing file: ${err.message}`);
            return ''
        }
    });
    return filePath;
}
module.exports = {
    readFile
};