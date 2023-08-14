import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    DeviceEventEmitter,
    Dimensions,
    Easing,
    Modal as ReactNativeModal,
    TouchableWithoutFeedback,
} from "react-native";

import { styles } from "./Modal.styles";

interface ModalProps {
    children?: React.ReactElement;
    onOverlayPress?: () => void;
    onHide?: () => void;
    isVisible?: boolean;
    modalProps?: any;
    contentStyle?: any;
    overlayStyle?: any;
}

const MODAL_ANIM_DURATION = 300;
const MODAL_BACKDROP_OPACITY = 0.4;

export const Modal = ({
    children,
    onOverlayPress,
    onHide,
    isVisible = false,
    modalProps,
    contentStyle,
    overlayStyle,
}: ModalProps): React.ReactElement => {
    const [screenHeight, setScreenHeight] = useState(
        Dimensions.get("window").height
    );
    const [screenWidth, setScreenWidth] = useState(
        Dimensions.get("window").width
    );

    const isMounted = useRef(false);
    const animatedOpacity = useRef(new Animated.Value(0));

    const handleDimensionsUpdate = (dimensionsUpdate: any) => {
        const updatedScreenWidth = dimensionsUpdate.window.width;
        const updateadScreenHeight = dimensionsUpdate.window.height;
        if (
            updatedScreenWidth !== screenWidth ||
            updateadScreenHeight !== screenHeight
        ) {
            setScreenHeight(updateadScreenHeight);
            setScreenWidth(updatedScreenWidth);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        if (isVisible) {
            show();
        }
        const deviceEventEmitter = DeviceEventEmitter.addListener(
            "didUpdateDimensions",
            handleDimensionsUpdate
        );

        return () => {
            deviceEventEmitter.remove();
            isMounted.current = false;
        };
    }, []);

    const backdropAnimatedStyle = {
        opacity: animatedOpacity.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, MODAL_BACKDROP_OPACITY],
        }),
    };
    const contentAnimatedStyle = {
        transform: [
            {
                translateY: animatedOpacity.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [screenHeight, 0],
                    extrapolate: "clamp",
                }),
            },
        ],
    };

    const show = useCallback(() => {
        Animated.timing(animatedOpacity.current, {
            easing: Easing.inOut(Easing.quad),
            // Using native driver in the modal makes the content flash
            useNativeDriver: false,
            duration: MODAL_ANIM_DURATION,
            toValue: 1,
        }).start();
    }, []);

    const hide = useCallback(() => {
        Animated.timing(animatedOpacity.current, {
            easing: Easing.inOut(Easing.quad),
            // Using native driver in the modal makes the content flash
            useNativeDriver: false,
            duration: MODAL_ANIM_DURATION,
            toValue: 0,
        }).start(() => {
            if (isMounted.current) {
                onHide?.();
            }
        });
    }, []);

    useEffect(() => {
        if (isVisible) {
            show();
        } else {
            hide();
        }
    }, [isVisible]);

    return (
        <ReactNativeModal
            transparent
            animationType="fade"
            visible={isVisible}
            {...modalProps}>
            <TouchableWithoutFeedback onPress={onOverlayPress}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        backdropAnimatedStyle,
                        { width: screenWidth, height: screenHeight },
                        overlayStyle,
                    ]}
                />
            </TouchableWithoutFeedback>
            {isVisible && (
                <Animated.View
                    style={[styles.content, contentAnimatedStyle, contentStyle]}
                    pointerEvents="box-none">
                    {children}
                </Animated.View>
            )}
        </ReactNativeModal>
    );
};

export default Modal;
