function log(msg) {
    logInfo(msg);
}

function logInfo(msg) {
    let args = [...arguments].map(() => JSON.stringify(msg));
    writeLog(args.unshift('info'));
}

function logError(msg) {
    let args = [...arguments].map(() => JSON.stringify(msg));
    writeLog(args.unshift('error'));
}

function writeLog(values) {
    var sheet = GoogleSheet.getSheetByName("log");
    if (sheet != null) {
        var newRow = sheet.getLastRow() + 1;
        sheet.getRange(newRow, 1, 1, values.length).setValues([values]);
    }
}