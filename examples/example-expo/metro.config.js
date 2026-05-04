const path = require("path");

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const extraNodeModules = {
  "react-native-timer-picker": path.resolve(__dirname, "../../src"),
};

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
  get: (target, name) =>
    // redirects dependencies referenced from src/ to local node_modules
    name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
});

config.watchFolders = [...(config.watchFolders ?? []), path.resolve(__dirname, "../../src")];

module.exports = config;
