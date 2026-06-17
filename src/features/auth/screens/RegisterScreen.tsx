import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
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
    background: '#FFFFFF',
    text: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    border: '#E2E8F0', // Slate 200
    inputBg: '#F8FAFC', // Slate 50
    googleBg: '#F1F5F9',
    overlay: 'rgba(0, 0, 0, 0.4)',
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const CustomInput = ({
    label,
    placeholder,
    icon: Icon,
    isPassword,
    value,
    onChangeText,
    keyboardType = 'default'
}: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused
            ]}>
                <View style={styles.iconWrapper}>
                    <Icon size={20} color={isFocused ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        {showPassword ?
                            <EyeOff size={20} color={COLORS.textSecondary} /> :
                            <Eye size={20} color={COLORS.textSecondary} />
                        }
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function RegisterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        console.log('Register attempt:', phone);
    };

    const handleGoogleRegister = () => {
        console.log('Google register attempt');
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(auth)/login');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1 }}>
                    {/* 1. Hero Image Section */}
                    <View style={[styles.heroContainer, { height: height * 0.4 }]}>
                        <Image
                            source={require('@/assets/images/register.png')}
                            style={styles.heroImage}
                            contentFit="cover"
                        />
                        {/* Overlay Controls */}
                        <View style={[styles.topOverlay, { paddingTop: insets.top + 10 }]}>
                            <TouchableOpacity onPress={handleBack} style={styles.overlayButton}>
                                <ChevronLeft size={24} color="white" strokeWidth={2.5} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.replace('/(auth)/login' as any)} style={styles.overlayButton}>
                                <Text style={styles.overlayButtonText}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 2. Content Sheet Section */}
                    <View style={styles.contentContainer}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header inside sheet */}
                            <Animated.View
                                entering={FadeInUp.duration(600).springify()}
                                style={styles.sheetHeader}
                            >
                                <Text style={styles.title}>Créer un compte</Text>
                                <Text style={styles.subtitle}>
                                    Entrez vos informations pour commencer à gérer vos finances.
                                </Text>
                            </Animated.View>

                            {/* Form Section */}
                            <Animated.View
                                entering={FadeInDown.delay(200).duration(800).springify()}
                                style={styles.form}
                            >
                                {/* Phone Section with Country Code Mock */}
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Numéro de téléphone</Text>
                                    <View style={styles.phoneInputRow}>
                                        <TouchableOpacity style={styles.countrySelector}>
                                            <Text style={styles.flag}>🇨🇲</Text>
                                            <Text style={styles.callingCode}>+237</Text>
                                            <ChevronDown size={14} color={COLORS.textSecondary} />
                                        </TouchableOpacity>
                                        <View style={styles.phoneInputContainer}>
                                            <TextInput
                                                style={styles.phoneInput}
                                                placeholder="675443242"
                                                placeholderTextColor="#94A3B8"
                                                value={phone}
                                                onChangeText={setPhone}
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <CustomInput
                                    label="Mot de passe"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    isPassword
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <CustomInput
                                    label="Confirmer le mot de passe"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    isPassword
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />

                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={handleRegister}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.registerButtonText}>S'inscrire</Text>
                                </TouchableOpacity>

                                {/* Divider */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OU</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Google Register */}
                                <TouchableOpacity
                                    style={styles.googleButton}
                                    onPress={handleGoogleRegister}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.googleIconWrapper}>
                                        <Image
                                            source={require('@/assets/images/google.png')}
                                            style={styles.googleIcon}
                                            contentFit="contain"
                                        />
                                    </View>
                                    <Text style={styles.googleButtonText}>S'inscrire avec Google</Text>
                                </TouchableOpacity>

                                <Text style={styles.termsText}>
                                    En continuant, vous acceptez nos <Text style={styles.linkText}>Conditions</Text> et <Text style={styles.linkText}>Politique de confidentialité</Text>.
                                </Text>
                            </Animated.View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    heroContainer: {
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    overlayButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 28,
        paddingTop: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    sheetHeader: {
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
        letterSpacing: -1,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    form: {
        gap: 20,
    },
    inputWrapper: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginLeft: 4,
    },
    phoneInputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    countrySelector: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        gap: 4,
    },
    flag: {
        fontSize: 18,
    },
    callingCode: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
    phoneInputContainer: {
        flex: 1,
        height: 56,
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    phoneInput: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        height: 56,
        paddingHorizontal: 16,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFFFFF',
    },
    iconWrapper: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '600',
    },
    eyeIcon: {
        padding: 8,
    },
    registerButton: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 6,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: 16,
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '700',
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.googleBg,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    googleIconWrapper: {
        marginRight: 12,
        width: 28,
        height: 28,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    googleIcon: {
        width: 18,
        height: 18,
    },
    googleButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },
    termsText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 10,
    },
    linkText: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});

export default RegisterScreen;