function log(msg) {
    logDebug.apply(null, [...arguments]);
}

function logInfo(msg) {
    let args = [...arguments].map((v) => JSON.stringify(v));
    args.unshift('info');
    writeLog(args);
}

function logDebug(msg) {
    if(!DEBUG) {
        return;
    }
    let args = [...arguments].map((v) => JSON.stringify(v));
    args.unshift('debug');
    writeLog(args);
}

function logError(msg) {
    let args = [...arguments].map((v) => JSON.stringify(v));
    args.unshift('error');
    writeLog(args);
}

function writeLog(values) {
    return DB.newQuery().table('log').insert(values);
}