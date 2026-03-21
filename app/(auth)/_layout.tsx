import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding-1" />
      <Stack.Screen name="onboarding-2" />
      <Stack.Screen name="onboarding-3" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="signup-profile" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="forgot-password-confirmation" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
