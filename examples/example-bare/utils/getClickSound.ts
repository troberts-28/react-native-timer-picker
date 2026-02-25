import { Platform } from "react-native";
import RNFS from "react-native-fs";

/**
 * Retrieves and processes a click sound file for use in the application.
 * The function handles platform-specific file paths and converts the sound file
 * into an ArrayBuffer format suitable for audio playback.
 *
 * For Android: Reads from android/app/src/main/assets/select_click.mp3
 * For iOS: Reads from the main bundle path/select_click.mp3
 *
 * @returns {Promise<ArrayBuffer>} A promise that resolves to an ArrayBuffer containing the sound file data
 * @throws {Error} If the file cannot be read or if the platform is not supported
 *
 * @example
 * const soundBuffer = await getClickSound();
 * // Use soundBuffer with AudioContext or other audio APIs
 */
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
