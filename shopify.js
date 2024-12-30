const { Shopify } = require('@shopify/shopify-api');
require('dotenv').config();

Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: [process.env.SHOPIFY_SCOPES],
    HOST_NAME: process.env.SHOPIFY_HOST.replace(/https?:\/\//, ""),
    IS_EMBEDDED_APP: false,
    API_VERSION: '2023-07',
    SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

module.exports = Shopify;