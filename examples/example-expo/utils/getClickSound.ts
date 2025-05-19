import { Asset } from "expo-asset";

export const getClickSound = async () => {
    const [asset] = await Asset.loadAsync(
        require("../assets/select_click.mp3")
    );

    const response = await fetch(asset.uri);
    return await response.arrayBuffer();
};
