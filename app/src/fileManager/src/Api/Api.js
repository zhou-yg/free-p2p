import config from './../config.js';

/**
 * Fetch API to list files from directory
 * @param {String} path
 * @returns {Object}
 * { "result": [
    {
        "name": "magento",
        "rights": "drwxr-xr-x",
        "size": "4096",
        "date": "2016-03-03 15:31:40",
        "type": "dir"
    }, {
        "name": "index.php",
        "rights": "-rw-r--r--",
        "size": "549923",
        "date": "2016-03-03 15:31:40",
        "type": "file"
    }
]}
 */
export function list(path) {
    return config.fetch(config.url_list, {
        body: {
            path,
        },
    });
};


/**
 * Fetch API to create a directory
 * @param {String} path
 * @param {String} directory
 * @returns {Object}
 * { "result": "<?php echo random(); ?>" }
 */
export function createDirectory(path, directory) {
    return config.fetch(config.url_create_folder, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ({
            path, directory
        })
    });
};


/**
 * Fetch API to get file body
 * @param {String} path
 * @returns {Object}
 * { "result": "<?php echo random(); ?>" }
 */
export function getFileContent(path) {
    return config.fetch(config.url_get_content, {
        body: {
            path: path || '/',
        },
    });
};


/**
 * Fetch API to remove a file or folder
 * @param {String} path
 * @param {Array} filenames
 * @param {Boolean} recursive
 * @returns {Object}
 * { "result": { "success": true, "error": null } }
 */
export function remove(path, filenames, recursive = true) {
    return config.fetch(config.url_remove, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ({
            path, filenames, recursive
        })
    });
};

/**
 * Fetch API to move files
 * @param {String} path
 * @param {Array} filenames
 * @param {Boolean} recursive
 * @returns {Object}
 * { "result": { "success": true, "error": null } }
 */
export function move(path, destination, filenames) {
    return config.fetch(config.url_move, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ({
            path, destination, filenames
        })
    });
};

/**
 * Fetch API to move files
 * @param {String} path
 * @param {Array} filenames
 * @param {Boolean} recursive
 * @returns {Object}
 * { "result": { "success": true, "error": null } }
 */
export function rename(path, destination) {
    return config.fetch(config.url_rename, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ({
            path, destination
        })
    });
};

/**
 * Fetch API to copy files
 * @param {String} path
 * @param {Array} filenames
 * @param {Boolean} recursive
 * @returns {Object}
 * { "result": { "success": true, "error": null } }
 */
export function copy(path, destination, filenames) {
    return config.fetch(config.url_copy, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ({
            path, destination, filenames
        })
    });
};

/**
 * Fetch API to copy files
 * @param {String} path
 * @param {Object<FileList>} fileList
 * @returns {Object}
 */
export function upload(path, fileList, formData = new FormData()) {
    throw new Error('未完成');
    
    [...fileList].forEach(f => {
        formData.append('file[]', f);
    });
    formData.append('path', path);

    return config.fetch(config.url_upload, {
        method: 'POST',
        body: formData, 
        headers: {
            // a workaround for node connector, passing the path by header
            path: path
        }
    });
};
