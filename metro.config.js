const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure 'react-native' field is prioritized over 'browser'
// This fixes issues where libraries like async-storage resolve to their web implementation
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
