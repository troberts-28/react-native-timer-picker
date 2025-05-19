import React, { useCallback, useEffect, useRef } from "react";

import {
    Animated,
    Easing,
    Modal as ReactNativeModal,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";

import { styles } from "./styles";
import type { ModalProps } from "./types";

export const Modal = (props: ModalProps) => {
    const {
        animationDuration = 300,
        children,
        contentStyle,
        isVisible = false,
        modalProps,
        onHide,
        onOverlayPress,
        overlayOpacity = 0.4,
        overlayStyle,
        testID = "modal",
    } = props;

    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const isMounted = useRef(false);
    const animatedOpacity = useRef(new Animated.Value(0));

    useEffect(() => {
        isMounted.current = true;
        if (isVisible) {
            show();
        }

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const backdropAnimatedStyle = {
        opacity: animatedOpacity.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, overlayOpacity],
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
            useNativeDriver: true,
            duration: animationDuration,
            toValue: 1,
        }).start();
    }, [animationDuration]);

    const hide = useCallback(() => {
        Animated.timing(animatedOpacity.current, {
            easing: Easing.inOut(Easing.quad),
            // Using native driver in the modal makes the content flash
            useNativeDriver: true,
            duration: animationDuration,
            toValue: 0,
        }).start(() => {
            if (isMounted.current) {
                onHide?.();
            }
        });
    }, [animationDuration, onHide]);

    useEffect(() => {
        if (isVisible) {
            show();
        } else {
            hide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    return (
        <ReactNativeModal
            animationType="fade"
            transparent
            visible={isVisible}
            {...modalProps}
            testID={testID}>
            <TouchableWithoutFeedback
                onPress={onOverlayPress}
                testID="modal-backdrop">
                <Animated.View
                    style={[
                        styles.backdrop,
                        backdropAnimatedStyle,
                        { width: screenWidth, height: screenHeight },
                        overlayStyle,
                    ]}
                />
            </TouchableWithoutFeedback>
            <Animated.View
                pointerEvents="box-none"
                style={[styles.content, contentAnimatedStyle, contentStyle]}>
                {children}
            </Animated.View>
        </ReactNativeModal>
    );
};

export default React.memo(Modal);
