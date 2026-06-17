import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
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
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

const COLORS = {
    primary: '#0031F6', // Electric Indigo
    background: '#ffffffff', // Deep Charcoal
    surface: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(0, 0, 0, 0.1)',
    text: '#000000',
    textSecondary: '#5b5f63ff',
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const HeroSection = () => (
    <Animated.View
        entering={FadeInUp.duration(1000).springify()}
        style={styles.heroContainer}
    >
        <Image
            source={require('@/assets/images/homepage.png')} // Fallback image detected in assets
            style={styles.heroImage}
            contentFit="contain"
        />
        <LinearGradient
            colors={['transparent', COLORS.background]}
            style={styles.heroGradient}
            locations={[0.7, 1]}
        />
    </Animated.View>
);

const ContentSection = () => (
    <View style={styles.contentContainer}>
        <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
            <Text style={styles.title}>
                Gérez vos finances{"\n"}
                <Text style={{ color: COLORS.primary }}>grâce à Aibapay.</Text>
            </Text>
            <Text style={styles.description}>
                Rejoignez des milliers de commercants qui font confiance à Aibapay pour leurs transactions quotidiennes.
            </Text>
        </Animated.View>
    </View>
);

const ActionSection = ({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) => (
    <Animated.View
        entering={FadeInDown.delay(400).duration(800).springify()}
        style={styles.actionContainer}
    >
        <TouchableOpacity
            style={styles.mainButton}
            onPress={onLogin}
            activeOpacity={0.8}
        >
            <Text style={styles.mainButtonText}>Se connecter</Text>
            <View style={styles.iconCircle}>
                <ArrowRight size={20} color="#FFF" strokeWidth={3} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.secondaryLink}
            onPress={onRegister}
            activeOpacity={0.6}
        >
            <Text onPress={onRegister} style={styles.secondaryLinkText}>
                Nouveau ici ? <Text style={styles.linkHighlight}>Créer un compte</Text>
            </Text>
        </TouchableOpacity>
    </Animated.View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function WelcomeScreen() {
    const insets = useSafeAreaInsets();

    const handleLogin = () => {
        router.push("/(auth)/login")
    };
    const handleRegister = () => {
        router.push("/(auth)/register")
        console.log('kke')
    };

    return (
        <View style={[styles.container, { backgroundColor: COLORS.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <HeroSection />

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <ContentSection />
                <ActionSection onLogin={handleLogin} onRegister={handleRegister} />
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroContainer: {
        width: width,
        height: height * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: "100%",
        height: '90%',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        height: 700,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 32,
    },
    contentContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: COLORS.text,
        lineHeight: 42,
        letterSpacing: -1,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 24,
        fontWeight: '500',
    },
    actionContainer: {
        gap: 24,
        alignItems: 'center',
    },
    mainButton: {
        backgroundColor: COLORS.primary,
        width: '100%',
        height: 64,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingLeft: 32,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    mainButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryLink: {
        paddingVertical: 8,
    },
    secondaryLinkText: {
        color: COLORS.textSecondary,
        fontSize: 15,
        fontWeight: '600',
    },
    linkHighlight: {
        color: COLORS.primary,
        fontWeight: '800',
    },
});

export default WelcomeScreen;