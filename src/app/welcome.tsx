import { WelcomeScreen } from "@/features/welcome";




export default function Welcome() {
    // If we needed to check if onboarding was already seen, 
    // we would do it here and return <Redirect href="/(tabs)" />

    return (
        <>

            <WelcomeScreen />
        </>
    );
}