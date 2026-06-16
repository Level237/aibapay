import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
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
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    type SharedValue,
} from 'react-native-reanimated';
import { onboardingData } from '../data/onboarding';

const { width, height } = Dimensions.get('window');

const COLORS = {
    primary: '#0031F6',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
};



type OnboardingItemProps = {
    item: (typeof onboardingData)[0];
    index: number;
    x: SharedValue<number>;
};

const OnboardingItem = ({ item, index, x }: OnboardingItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0, 1, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
        };
    });

    return (
        <View style={styles.itemContainer}>
            {/* Full Screen Image */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <Image
                    source={item.image}
                    style={styles.image}
                    contentFit="cover"
                    transition={500}
                />
                {/* Dark Gradient Overlay at Bottom */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                    style={styles.gradientOverlay}
                />
            </Animated.View>

            {/* Text Content */}
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
};

const Pagination = ({ x }: { x: SharedValue<number> }) => {
    return (
        <View style={styles.paginationContainer}>
            {onboardingData.map((_, index) => {
                const animatedDotStyle = useAnimatedStyle(() => {
                    const widthAnim = interpolate(
                        x.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [10, 20, 10],
                        Extrapolation.CLAMP
                    );
                    const opacity = interpolate(
                        x.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [0.5, 1, 0.5],
                        Extrapolation.CLAMP
                    );
                    return {
                        width: widthAnim,
                        opacity,
                    };
                });
                return (
                    <Animated.View
                        key={index}
                        style={[styles.dot, animatedDotStyle]}
                    />
                );
            })}
        </View>
    );
};

const OnboardingScreen = () => {
    const x = useSharedValue(0);
    const flatListRef = React.useRef<Animated.FlatList<any>>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
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
            //router.replace('/welcome');
        }
    };

    const handleSkip = () => {
        //router.replace('/welcome');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Animated.FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={({ item, index }) => (
                    <OnboardingItem item={item} index={index} x={x} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            />

            <View style={styles.bottomWrapper}>
                <Pagination x={x} />

                <View style={styles.buttonContainer}>
                    {/* Left Button: Passer / Skip */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.skipButtonText}>Passer</Text>
                    </TouchableOpacity>

                    {/* Right Button: Next */}
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === onboardingData.length - 1 ? 'Commencer' : 'Suivant'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        height: height * 0.6, // Gradient covers bottom 60%
    },
    textContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        zIndex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'left',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'left',
        lineHeight: 21,
    },
    bottomWrapper: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        zIndex: 2,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    skipButtonText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    nextButtonText: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;