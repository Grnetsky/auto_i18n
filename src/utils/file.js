import Path from "node:path";
import fs from "fs";

function readFile(path,fileName,code = "utf8") {
    const filePath = Path.resolve(path,fileName);
    fs.readFile(filePath, code, (err, data) => {
        if (err) {
            return console.error(`Error reading file: ${err.message}`);
        }
        console.log(`File content:\n${data}`);
    });
}

module.exports = {
    readFile
};