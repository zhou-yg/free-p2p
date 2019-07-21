import { api, Events } from '../../common/api';

export default {
    fetch: (url, {body}) => {
        console.log(url, body);

        return api.fetch(url, body);
    },

    url_list: Events.GET_FILE_LIST,
    url_create_folder: `dir/create`,
    url_get_content: Events.GET_FILE_DATA,
    url_download: Events.GET_FILE_DATA,
    url_upload: `items/upload`,
    url_remove: `items/remove`,
    url_rename: `item/move`,
    url_move: `items/move`,
    url_copy: `items/copy`,
    url_edit: `file/edit`,
    url_compress: `items/compress`,
    url_extract: `file/extract`,

    isEditableFilePattern: /\.(txt|diff?|patch|svg|asc|cnf|cfg|conf|html?|cfm|cgi|aspx?|ini|pl|py|md|css|cs|jsx?|jsp|log|htaccess|htpasswd|gitignore|gitattributes|env|json|atom|eml|rss|markdown|sql|xml|xslt?|sh|rb|as|bat|cmd|cob|for|ftn|frm|frx|inc|lisp|scm|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb|tmpl|lock|go|yml|yaml|tsv|lst)$/i,
    isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
    isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,

    actions: {
        create_folder: true,
        move: true,
        copy: true,
        copy_folder: true,
        compress: true,
        extract: true,
        edit: true,
        remove: true,
        upload: true,
        upload_by_chunks: true,
        preview_images: true,
    }
};
