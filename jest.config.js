module.exports = {
    preset: "react-native",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "node",
    modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/examples/"],
    transformIgnorePatterns: [
        "node_modules/(?!(react-native|@react-native|@react-native-community|@react-navigation|react-clone-referenced-element|@react-native-picker)/)",
    ],
};
