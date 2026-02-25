import { Asset } from "expo-asset";

/**
 * Loads and returns the click sound effect as an ArrayBuffer.
 * This function loads a sound file from the assets directory and converts it to an ArrayBuffer
 * that can be used for audio playback.
 *
 * @returns {Promise<ArrayBuffer>} A promise that resolves to the sound file as an ArrayBuffer
 * @throws {Error} If the asset fails to load or if the fetch request fails
 *
 * @example
 * const clickSound = await getClickSound();
 * // Use clickSound with Audio API or other audio playback methods
 */
export const getClickSound = async () => {
  const [asset] = await Asset.loadAsync(require("../assets/select_click.mp3"));

  const response = await fetch(asset.uri);
  return await response.arrayBuffer();
};
