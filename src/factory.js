
const vue3Modifier = require('./vue3')

module.exports =  function factory(config,resolvePaths) {
    switch (frameWork) {
        case "vue3":
            vue3Modifier(config,resolvePaths);
    }
}

