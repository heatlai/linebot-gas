class GoogleDrive {
    static open(folderName) {
        return new this(folderName);
    }
    constructor(folderName) {
        let folders = DriveApp.getFolderById(GOOGLE_DRIVE_PUBLIC_FOLDER_ID).getFoldersByName(folderName);
        this.folder = folders.next();
    }
    getFileUrl(filename) {
        let files = this.folder.getFilesByName(filename);
        return (files.hasNext()) ? 'https://drive.google.com/uc?export=view&id=' + files.next().getId() : null;
    }

    static getImageInfo(filename) {
        let files = GoogleDrive.open('images').folder.getFilesByName(filename);
        if( ! files.hasNext() ) {
            return null;
        }
        let id = files.next().getId();
        return {
            url: `https://drive.google.com/uc?export=view&id=${id}`,
            // thumbnail: `https://drive.google.com/thumbnail?id=${id}`
            thumbnail: `https://lh3.googleusercontent.com/d/${id}=w300`
        }
    }

    static getThumbnailUrl(filename, width, height) {
        let folder = GoogleDrive.open('images').folder;
        let files = folder.getFilesByName(filename);
        if( ! files.hasNext() ) {
            return null;
        }
        let id = files.next().getId();
        let url = `https://drive.google.com/thumbnail?id=${id}`;
        if( width || height) url += '&sz=';
        if( width ) url += `w${width}`;
        if( height && width ) url += '-';
        if( height ) url += `h${height}`;

        //"https://drive.google.com/thumbnail?id=1wjkM7cNZQuqW_CVYl1RdASfc5A8XGn42&sz=w800-h600"
        return url;
    }
}

