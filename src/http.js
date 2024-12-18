import {writeFile} from "./utils/file";
import fs from "fs";
import path from "node:path";
const http = require('http');
const CryptoJS = require("crypto-js");
const querystring = require('querystring');

export function translate(chineseList,langPath,config,write=true) {
    return Promise.allSettled(
        config.target.map((target,index) => {
            return new Promise((resolve, reject) => {
                var appKey = config.AppID;
                var key = config.key;
                var salt = (new Date).getTime();
                var curtime = Math.round(new Date().getTime() / 1000);
                var query = chineseList;
                var from = config.from;
                var to = target;
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
                            if (result.errorCode === '0') {
                                const json = {};
                                const translateResults = result.translateResults;
                                translateResults.forEach((item,index) => {
                                    json[chineseList[index]] = item.translation;
                                });
                                const _langPath = langPath || path.resolve(config.rootPath,'src/i18n/lang');
                                if(!fs.existsSync(path.resolve(_langPath,config._target[index]+'.json'))){
                                    fs.writeFileSync(path.resolve(_langPath,config._target[index]+'.json'), config.langFileDefaultContent, { encoding: 'utf8' });
                                }
                                if(write) writeFile(langPath, config._target[index]+'.json', JSON.stringify(json, null, 2));
                                resolve(json);
                            } else {
                                console.error(`Error: ${result.errorCode}`);
                                reject(result.errorCode);
                            }
                        } catch (e) {
                            console.error(e.message);
                            reject(e.message);
                        }
                    });
                });

                req.on('error', (e) => {
                    console.error(`Problem with request: ${e.message}`);
                    reject(e.message);
                });

                req.write(postData);
                req.end()
            })
        })
    )
}
function truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}
