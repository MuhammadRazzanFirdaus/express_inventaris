const { response } = require("express");

module.exports = {
    // key object yang akan dipanggil pas export/require di file lain
    response: (status, message, data) => {
        if (data) {
            // kalau response memiliki data
            return {
                status: status,
                message: message,
                data: data
            }
        } else {
            // kalau response ga puya data / error hasil di postman nya jangan kirim key data di jsonnya
            return {
                status: status,
                message: message
            }
        }
    }
}