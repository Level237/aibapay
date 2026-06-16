import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
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

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

const COLORS = {
    primary: '#0031F6', // Electric Indigo
    background: '#FFFFFF',
    text: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    border: '#E2E8F0', // Slate 200
    inputBg: '#F8FAFC', // Slate 50
    google: '#DB4437',
    googleBg: '#F1F5F9',
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
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword && !showPassword}
                    //onFocus={() => setIsFocused(true)}
                    //onBlur={() => setIsFocused(false)}
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

export function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login attempt with phone:', phone);
    };

    const handleGoogleLogin = () => {
        console.log('Google login attempt');
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Top Bar - Static Back Button */}
            <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ChevronLeft size={28} color={COLORS.text} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + 20 }
                    ]}
                >
                    {/* Header Section */}
                    <Animated.View
                        entering={FadeInUp.duration(800).springify()}
                        style={styles.header}
                    >
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                        <Text style={styles.welcomeTitle}>Bon retour !</Text>
                        <Text style={styles.welcomeSubtitle}>Connectez-vous à votre compte AIBAPAY pour continuer.</Text>
                    </Animated.View>

                    {/* Form Section */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800).springify()}
                        style={styles.form}
                    >
                        <CustomInput
                            label="Numéro de téléphone"
                            placeholder="Ex: 0102030405"
                            icon={Phone}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />

                        <CustomInput
                            label="Mot de passe"
                            placeholder="••••••••"
                            icon={Lock}
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>Se connecter</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OU</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Login */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={handleGoogleLogin}
                            activeOpacity={0.8}
                        >
                            <View style={styles.googleIconWrapper}>
                                <Image
                                    source={require('@/assets/images/google.png')}
                                    style={styles.googleIcon}
                                    contentFit="contain"
                                />
                            </View>
                            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Footer Section */}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(800).springify()}
                        style={styles.footer}
                    >
                        <Text style={styles.noAccountText}>
                            Vous n'avez pas de compte ?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
                            <Text style={styles.signUpText}>S'inscrire</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
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
    topBar: {
        paddingHorizontal: 16,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.inputBg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },

    welcomeTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
        letterSpacing: -0.8,
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        fontWeight: '500',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        height: 60,
        paddingHorizontal: 16,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFFFFF',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 2,
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
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '800',
    },
    loginButton: {
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
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        overflow: 'hidden',
    },
    googleIcon: {
        width: 20,
        height: 20,
    },
    googleButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    noAccountText: {
        color: COLORS.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    signUpText: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '900',
    },
});

export default LoginScreen;