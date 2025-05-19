import { Platform } from "react-native";
import RNFS from "react-native-fs";

export const getClickSound = async () => {
    let fileData: string;
    if (Platform.OS === "android") {
        // this reads from android/app/src/main/assets - place your click sound in this folder
        fileData = await RNFS.readFileAssets("select_click.mp3", "base64");
    } else {
        // this reads from the iOS project - add your file to the project on xcode
        const filePath = `${RNFS.MainBundlePath}/select_click.mp3`;
        fileData = await RNFS.readFile(filePath, "base64");
    }

    const binaryString = atob(fileData); // Base64 to binary
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
};
