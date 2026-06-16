import OnboardingScreen from "@/features/welcome/screens/onboarding";



export default function Onboarding() {
    // If we needed to check if onboarding was already seen, 
    // we would do it here and return <Redirect href="/(tabs)" />

    return (
        <>

            <OnboardingScreen />
        </>
    );
}