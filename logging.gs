function log(msg) {
    let args = [...arguments].map((v) => JSON.stringify(v));
    args.unshift('info');
    writeLog(args);
}

function logInfo(msg) {
    let args = [...arguments].map((v) => JSON.stringify(v));
    args.unshift('info');
    writeLog(args);
}

function logError(msg) {
    let args = [...arguments].map((v) => JSON.stringify(v));
    args.unshift('error');
    writeLog(args);
}

function writeLog(values) {
    var sheet = GoogleSheet.getSheetByName("log");
    if (sheet != null) {
        var newRow = sheet.getLastRow() + 1;
        sheet.getRange(newRow, 1, 1, values.length).setValues([values]);
    }
}