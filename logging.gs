function log(msg) {
    logInfo(msg);
}

function logInfo(msg) {
    var sheet = GoogleSheet.getSheetByName("log");
    if (sheet != null) {
        var newRow = sheet.getLastRow() + 1;
        sheet.getRange(newRow, 1, 1, 2).setValues(
            [['info', JSON.stringify(msg)]]
        );
    }
}

function logError(msg) {
    var sheet = GoogleSheet.getSheetByName("log");
    if (sheet != null) {
        var newRow = sheet.getLastRow() + 1;
        sheet.getRange(newRow, 1, 1, 2).setValues(
            [['error', JSON.stringify(msg)]]
        );
    }
}