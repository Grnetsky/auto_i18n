import {translateMap} from "./vue3/config";
import {writeFile} from "./utils/file";
import config from "./config";

const http = require('http');
const CryptoJS = require("crypto-js");
const querystring = require('querystring');

export function translate(chineseList,langList,langPath,codeLanguage) {

    for (let i = 0; i < langList.length; i++) {
        var appKey = '440b4cce9f385b32';
        var key = '3IpcveGENOsrkU3gAKAZJGtnDk5wqAh8';//注意：暴露appSecret，有被盗用造成损失的风险
        var salt = (new Date).getTime();
        var curtime = Math.round(new Date().getTime() / 1000);
        var query = chineseList;
        var from = 'zh-CHS';
        var to = langList[i];
        var str1 = appKey + truncate(query.join("")) + salt + curtime + key;
        var vocabId = '';

        var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
        const postData = querystring.stringify({
            q: query,
            appKey: appKey,
            salt: salt,
            from: from,
            to: to,
            sign: sign,
            signType: "v3",
            curtime: curtime,
            vocabId: vocabId,
        });

        const options = {
            hostname: 'openapi.youdao.com',
            port: 80,
            path: '/v2/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log(result);
                    if (result.errorCode === '0') {
                        const json = {};
                        const translateResults = result.translateResults;
                        translateResults.forEach((item) => {
                            json[item.query] = item.translation;
                        });
                        writeFile(langPath, langList[i]+'.'+codeLanguage, `const a = ${JSON.stringify(json, null, 2)};export default a`);
                    } else {
                        console.error(`Error: ${result.errorCode}`);
                    }
                } catch (e) {
                    console.error(e.message);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
        });

        req.write(postData);
        req.end()
    }
}
function truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}
