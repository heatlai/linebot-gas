class GoogleDrive {
    static open(folderPath) {
        return new this(folderPath);
    }
    constructor(folderPath) {
        let folderPaths = folderPath.split('/');
        folderPaths.forEach((path) => {
            if (typeof this.folder === 'undefined') {
                this.folder = DriveApp.getFolderById(GOOGLE_DRIVE_PUBLIC_FOLDER_ID).getFoldersByName(path).next();
            } else {
                this.folder = this.folder.getFoldersByName(path).next();
            }
        })
    }

    getFileUrl(filename) {
        let files = this.folder.getFilesByName(filename);
        return (files.hasNext()) ? 'https://drive.google.com/uc?export=view&id=' + files.next().getId() : null;
    }

    getFileId(filename) {
        let files = this.folder.getFilesByName(filename);
        return (files.hasNext()) ? files.next().getId() : null;
    }

    randomFile() {
        let files = this.folder.getFiles();
        let res = [];
        while (files.hasNext()) {
            res.push(files.next());
        }
        return arrayRandom(res);
    }

    /**
     * @param {File} file
     * @return {{thumbnail: string, origin: string}}
     */
    static getImageInfo(file) {
        let id = file.getId();
        return {
            origin: GoogleDrive.getPublicImageUrl(id),
            thumbnail: GoogleDrive.getPublicImageUrl(id, 300, 250)
            // thumbnail: `https://lh3.googleusercontent.com/d/${fileId}=w${width}-h${height}`
            // thumbnail: `https://drive.google.com/thumbnail?id=${id}`
            // thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w800-h600`
        }
    }

    static getThumbnailUrl(fileId, width, height) {
        let url = `https://drive.google.com/thumbnail?id=${fileId}`;
        if( width || height) url += '&sz=';
        if( width ) url += `w${width}`;
        if( height && width ) url += '-';
        if( height ) url += `h${height}`;
        return url;
    }

    static getPublicImageUrl(fileId, width, height) {
        // lh3 ~ lh6
        let url = `https://lh3.googleusercontent.com/d/${fileId}`;
        if( width || height) url += '=';
        if( width ) url += `w${width}`;
        if( height && width ) url += '-';
        if( height ) url += `h${height}`;
        return url;
    }
}

