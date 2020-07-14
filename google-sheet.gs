class GoogleSheet {
    static getSheetByName(tableName) {
        return SpreadsheetApp.openById(DB_SHEET_ID).getSheetByName(tableName);
    }
}

class DB {
    static newQuery() {
        return new DB;
    }

    /**
     * @param {Array[]} data
     * @return {Object[]}
     */
    transform(data) {
        let fieldNames = data.shift();
        return data.map(row => arrayCombine(fieldNames, row));
    }

    table(name) {
        this.tableName = name;
        return this;
    }

    insert(values) {
        let sheet = GoogleSheet.getSheetByName(this.tableName);
        let newRowNum = sheet.getLastRow() + 1;
        sheet.getRange(newRowNum, 1, 1, values.length).setValues([values]);
    }

    all() {
        let sheet = GoogleSheet.getSheetByName(this.tableName);
        let lastRow = sheet.getLastRow();
        let lastColumn = sheet.getLastColumn();
        let data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
        return this.transform(data);
    }
}