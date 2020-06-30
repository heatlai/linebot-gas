class GoogleSheet {
    static getSheetByName(tableName) {
        return SpreadsheetApp.openById(DB_SHEET_ID).getSheetByName(tableName);
    }
}