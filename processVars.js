let host = '';
let protocol = '';
if (process.env.NODE_ENV === 'development') {
    host = 'localhost:3000';
    protocol = 'http';
} else if (process.env.NODE_ENV === 'production') {
    host = 'eddbapi.kodeblox.com';
    protocol = 'https';
}

module.exports = {
    host, protocol
}
