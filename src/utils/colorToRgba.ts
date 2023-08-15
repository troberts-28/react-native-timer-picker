export const colorToRgba = (variables: { color: string; opacity?: number }) => {
    // this function is required for expo-linear-gradient on iOS. To fade to transparent, we need
    // to be able to add opacity to the background color. Supplying 'transparent' does not work
    // because that is actually a transparent black (rgba(0, 0, 0, 1)), which results in dodgy rendering

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
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return color; // Return unchanged if unable to parse
};
