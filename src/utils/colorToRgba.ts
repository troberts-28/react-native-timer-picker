/**
 * Converts various color formats to RGBA string representation.
 * This function is specifically required for expo-linear-gradient on iOS to handle transparent colors correctly.
 * It supports named colors, RGB, and hex color formats.
 *
 * @param {Object} variables - The input variables object
 * @param {string} variables.color - The color to convert. Can be:
 *   - Named color (e.g., 'transparent', 'black', 'white', 'blue', 'green', 'gray', 'red')
 *   - RGB format (e.g., 'rgb(255, 0, 0)')
 *   - Hex format (e.g., '#FF0000' or '#F00')
 * @param {number} [variables.opacity=1] - The opacity value between 0 and 1
 *
 * @returns {string} The color in RGBA format (e.g., 'rgba(255, 0, 0, 0.5)')
 *
 * @example
 * // Using named color
 * colorToRgba({ color: 'transparent' })
 * // Returns: 'rgba(0, 0, 0, 0)'
 *
 * @example
 * // Using RGB with custom opacity
 * colorToRgba({ color: 'rgb(255, 0, 0)', opacity: 0.5 })
 * // Returns: 'rgba(255, 0, 0, 0.5)'
 *
 * @example
 * // Using hex color
 * colorToRgba({ color: '#FF0000' })
 * // Returns: 'rgba(255, 0, 0, 1)'
 *
 * @example
 * // Using short hex color
 * colorToRgba({ color: '#F00' })
 * // Returns: 'rgba(255, 0, 0, 1)'
 */
export const colorToRgba = (variables: {
    color: string;
    opacity?: number;
}): string => {
    const { color, opacity = 1 } = variables;

    // Handle named colors
    const namedColors: { [key: string]: string } = {
        transparent: "rgba(0, 0, 0, 0)",
        black: "rgba(0, 0, 0, 1)",
        white: "rgba(255, 255, 255, 1)",
        blue: "rgba(0, 0, 255, 1)",
        green: "rgba(0, 128, 0, 1)",
        gray: "rgba(128, 128, 128, 1)",
        red: "rgba(255, 0, 0, 1)",
    };

    if (color in namedColors) {
        return namedColors[color];
    }

    // Handle RGB format
    if (color.startsWith("rgb(")) {
        const rgbValues = color
            .replace("rgb(", "")
            .replace(")", "")
            .split(",")
            .map((value) => parseInt(value.trim(), 10));
        const [r, g, b] = rgbValues;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Handle hex format
    if (color.startsWith("#")) {
        let hexColor = color.slice(1);
        if (hexColor.length === 3) {
            hexColor = hexColor
                .split("")
                .map((value) => value + value)
                .join("");
        }
        const r = parseInt(hexColor.slice(0, 2), 16);
        const g = parseInt(hexColor.slice(2, 4), 16);
        const b = parseInt(hexColor.slice(4, 6), 16);

        // Validate that all color components are valid numbers
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return color; // Return original if malformed
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return color; // Return unchanged if unable to parse
};
