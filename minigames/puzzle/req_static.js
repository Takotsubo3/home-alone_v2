// Traitement de l'envoi d'une "requête statique" - handle static file requests 
"use strict";
 
const fs = require("fs");
const path = require("path");
const url = require("url");
//const nunjucks = require("nunjucks");

function req_static(res, filePath) {
    const absPath = path.join(__dirname, filePath); // Resolve the absolute path of the requested file
    const extname = path.extname(absPath).toLowerCase(); // Get the file extension
    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".mp3": "audio/mpeg",
        ".ico": "image/x-icon",
    };

    const contentType = mimeTypes[extname] || "application/octet-stream"; // Default MIME type

    fs.readFile(absPath, (err, data) => {
        if (err) {
            // If the file doesn't exist, return a 404 error
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write(`404 Not Found: ${filePath} not found`);
            res.end();
        } else {
            // Serve the file with the correct MIME type
            res.writeHead(200, { "Content-Type": contentType });
            res.write(data);
            res.end();
        }
    });
}

module.exports = req_static;
