const fs = require("fs")
const path = require('path');
const Path = require("node:path");
const vue3Modifier = require('./vue3')

module.exports =  function factory(frameWork,dirPath,targetLanList) {
    console.log(template,'xxxxxxxxxx')
    switch (frameWork) {
        case "vue3":
            vue3Modifier(dirPath,targetLanList);
    }
}
