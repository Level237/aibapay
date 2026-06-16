import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onboardingData } from '../data/onboarding';

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: '#0031F6', // Electric Indigo
    background: '#0F0F10', // Deep Charcoal
    text: '#FFFFFF',
    textSecondary: '#d1d1d1ff', // Slate
    glass: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',
};

// ─── Types ────────────────────────────────────────────────────────────────────

type OnboardingItemProps = {
    item: (typeof onboardingData)[0];
    index: number;
    x: SharedValue<number>;
};

type DotProps = {
    index: number;
    x: SharedValue<number>;
};

// ─── Slide Item ───────────────────────────────────────────────────────────────

const OnboardingItem = ({ item, index, x }: OnboardingItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0, 1, 0],
            Extrapolation.CLAMP
        );
        const scale = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.92, 1, 0.92],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ scale }]
        };
    });

    return (
        <View style={styles.itemContainer}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <Image
                    source={item.image}
                    style={styles.image}
                    contentFit="cover"
                    transition={800}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(15,15,16,0.2)', COLORS.background]}
                    style={styles.gradientOverlay}
                    locations={[0, 0.3, 0.85]}
                />
            </Animated.View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
};

// ─── Dot (Liquid Style) ──────────────────────────────────────────────────────

const Dot = ({ index, x }: DotProps) => {
    const animatedDotStyle = useAnimatedStyle(() => {
        const widthInterpolation = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 24, 8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.2, 1, 0.2],
            Extrapolation.CLAMP
        );

        const backgroundColor = interpolateColor(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            ['#FFFFFF', COLORS.primary, '#FFFFFF']
        );

        return {
            width: widthInterpolation,
            opacity,
            backgroundColor
        };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ x }: { x: SharedValue<number> }) => (
    <View style={styles.paginationContainer}>
        {onboardingData.map((_, i) => (
            <Dot key={i} index={i} x={x} />
        ))}
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface OnboardingProps {
    onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingProps) {
    const x = useSharedValue(0);
    const flatListRef = useRef<Animated.FlatList<any>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const insets = useSafeAreaInsets();

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            onComplete();
        }
    };

    const getItemLayout = (_: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    });

    const handleSkip = () => onComplete();

    // Skip button fades out on last slide
    const animatedSkipStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [width * (onboardingData.length - 2), width * (onboardingData.length - 1)],
            [1, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ translateY: interpolate(x.value, [width * (onboardingData.length - 2), width * (onboardingData.length - 1)], [0, -10], Extrapolation.CLAMP) }]
        };
    });

    // Next button morphs into capsule
    const animatedNextButtonStyle = useAnimatedStyle(() => {
        const buttonWidth = interpolate(
            x.value,
            [width * (onboardingData.length - 2), width * (onboardingData.length - 1)],
            [64, 160],
            Extrapolation.CLAMP
        );
        return { width: buttonWidth };
    });

    const animatedNextTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [width * (onboardingData.length - 1.2), width * (onboardingData.length - 1)],
            [0, 1],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const isLastSlide = currentIndex === onboardingData.length - 1;

    return (
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header: Skip Button (Top Right) */}
            <Animated.View style={[styles.headerContainer, { top: insets.top + 12 }, animatedSkipStyle]}>
                <View pointerEvents={isLastSlide ? 'none' : 'auto'}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.skipText}>Passer</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Slides */}
            <Animated.FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={({ item, index }) => (
                    <OnboardingItem item={item} index={index} x={x} />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                getItemLayout={getItemLayout}
            />

            {/* Footer: Pagination (Left) + Next Button (Right) */}
            <View style={[styles.bottomWrapper, { paddingBottom: insets.bottom + 24 }]}>
                <View style={styles.controlsRow}>
                    <Pagination x={x} />

                    <Animated.View style={[styles.nextButtonWrapper, animatedNextButtonStyle]}>
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <View style={styles.nextButtonContent}>
                                <Animated.View style={[styles.getStartedTextWrapper, animatedNextTextStyle]}>
                                    <Text style={styles.getStartedText} numberOfLines={1}>
                                        Commencer
                                    </Text>
                                </Animated.View>
                                <View style={styles.chevronWrapper}>
                                    <ChevronRight size={24} color="#FFFFFF" strokeWidth={2.5} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: 'absolute',
        right: 24,
        zIndex: 10,
    },
    skipButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24,
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    itemContainer: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'flex-end', // Push content to bottom
        paddingBottom: 150, // Space for buttons/pagination
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.75,
    },
    textContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 38,
        fontWeight: '900',
        color: COLORS.text,
        textAlign: 'left',
        marginBottom: 16,
        letterSpacing: -0.8,
        lineHeight: 44,
    },
    description: {
        fontSize: 18,
        color: COLORS.textSecondary,
        textAlign: 'left',
        lineHeight: 28,
        fontWeight: '500',
    },
    bottomWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 32,
        zIndex: 2,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 64,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    nextButtonWrapper: {
        height: 50,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    nextButton: {
        flex: 1,
        justifyContent: 'center',
    },
    nextButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 3,
    },
    chevronWrapper: {
        width: 38,
        height: 38,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 8,
    },
    getStartedTextWrapper: {
        position: 'absolute',
        left: 24,
        justifyContent: 'center',
    },
    getStartedText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
});

export default OnboardingScreen;