import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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
    primary: '#8B5CF6',
    background: '#121212',
    accent: '#0232f8',
    text: '#ffffff',
    textSecondary: '#B0B4BA',
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
    const isFirst = index === 0;

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0, 1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    return (
        <View style={styles.itemContainer}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <Image
                    source={item.image}
                    style={styles.image}
                    contentFit={isFirst ? 'contain' : 'cover'}
                    transition={500}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.92)']}
                    style={styles.gradientOverlay}
                />
            </Animated.View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
};

// ─── Dot ──────────────────────────────────────────────────────────────────────
// BUG FIX #1 : useAnimatedStyle() appelé dans .map() → violation Rules of Hooks.
// Solution : chaque dot est un composant React indépendant avec son propre hook.

const Dot = ({ index, x }: DotProps) => {
    const animatedDotStyle = useAnimatedStyle(() => {
        const dotWidth = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 24, 8],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.4, 1, 0.4],
            Extrapolation.CLAMP
        );
        return { width: dotWidth, opacity };
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
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    // BUG FIX #2 : condition était `< length` → scrollToIndex hors limites → crash.
    const handleNext = () => {
        console.log(currentIndex);
        console.log(onboardingData.length - 1);

        if (currentIndex <= onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            onComplete();
        }
    };

    const handleSkip = () => onComplete();

    // Fond qui transite de #0232f8 (bleu) → #121212 (sombre) en swipant
    const animatedContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            x.value,
            [0, width, 2 * width],
            [COLORS.accent, COLORS.background, COLORS.background]
        );
        return { backgroundColor };
    });

    // Bouton "Passer" s'efface progressivement sur le dernier slide
    const animatedSkipStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [width * (onboardingData.length - 2), width * (onboardingData.length - 1)],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    // Bouton suivant s'élargit en capsule sur le dernier slide
    const animatedNextButtonStyle = useAnimatedStyle(() => {
        const buttonWidth = interpolate(
            x.value,
            [width * (onboardingData.length - 2), width * (onboardingData.length - 1)],
            [56, 150],
            Extrapolation.CLAMP
        );
        return { width: buttonWidth };
    });

    // Texte "Commencer" apparaît en fade-in sur le dernier slide
    const animatedNextTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [width * (onboardingData.length - 1.5), width * (onboardingData.length - 1)],
            [0, 1],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const isLastSlide = currentIndex === onboardingData.length - 1;

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Bouton "Passer" — statique, haut à droite */}
            <View style={[styles.headerContainer, { top: insets.top + 12 }]}>
                <Animated.View style={animatedSkipStyle}>
                    {/* BUG FIX #3 : pointerEvents n'existe pas sur TouchableOpacity.
                        On l'applique sur le View parent à la place. */}
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
            </View>

            {/* Slides défilants */}
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
            />

            {/* Footer fixe — pagination + bouton */}
            <View style={[styles.bottomWrapper, { paddingBottom: insets.bottom + 16 }]}>
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
                                    <ChevronRight size={20} color="#FFFFFF" strokeWidth={3} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </Animated.View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    itemContainer: {
        width,
        height,
        justifyContent: 'flex-end',
        paddingBottom: 160,
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
        height: height * 0.55,
    },
    textContainer: {
        paddingHorizontal: 24,
        zIndex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'left',
        marginBottom: 12,
        letterSpacing: 0.5,
        lineHeight: 38,
    },
    description: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'left',
        lineHeight: 22,
    },
    bottomWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        zIndex: 2,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 56,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginRight: 8,
    },
    nextButtonWrapper: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    nextButton: {
        flex: 1,
        justifyContent: 'center',
    },
    nextButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: 6,
    },
    chevronWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 6,
    },
    getStartedTextWrapper: {
        position: 'absolute',
        left: 18,
        justifyContent: 'center',
    },
    getStartedText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
