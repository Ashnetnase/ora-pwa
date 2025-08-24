import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Navigate to main app
    navigation.navigate('Main');
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    // Simulate social login API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Navigate to main app
    navigation.navigate('Main');
  };

  const SocialButton = ({ 
    provider, 
    icon, 
    text, 
    style 
  }: { 
    provider: 'google' | 'facebook' | 'apple'; 
    icon: React.ReactNode; 
    text: string; 
    style: any;
  }) => (
    <TouchableOpacity
      style={[styles.socialButton, style]}
      onPress={() => handleSocialLogin(provider)}
      disabled={isLoading}
    >
      {icon}
      <Text style={styles.socialButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.appTitle}>Alartd</Text>
        <Text style={styles.appSubtitle}>New Zealand Disaster Safety</Text>
      </View>

      {/* Auth Form */}
      <Card style={styles.authCard}>
        <CardHeader style={styles.cardHeader}>
          <Tabs defaultValue="login" style={styles.tabs}>
            <TabsList style={styles.tabsList}>
              <TabsTrigger value="login" style={styles.tabTrigger}>Login</TabsTrigger>
              <TabsTrigger value="signup" style={styles.tabTrigger}>Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" style={styles.tabContent}>
              <CardContent style={styles.cardContent}>
                {/* Social Login Buttons */}
                <View style={styles.socialButtonsContainer}>
                  <SocialButton
                    provider="google"
                    style={styles.googleButton}
                    text="Continue with Google"
                    icon={
                      <View style={styles.googleIcon}>
                        <Text style={styles.googleIconText}>G</Text>
                      </View>
                    }
                  />
                  
                  <SocialButton
                    provider="apple"
                    style={styles.appleButton}
                    text="Continue with Apple"
                    icon={
                      <View style={styles.appleIcon}>
                        <Text style={styles.appleIconText}>🍎</Text>
                      </View>
                    }
                  />
                  
                  <SocialButton
                    provider="facebook"
                    style={styles.facebookButton}
                    text="Continue with Facebook"
                    icon={
                      <View style={styles.facebookIcon}>
                        <Text style={styles.facebookIconText}>f</Text>
                      </View>
                    }
                  />
                </View>

                <View style={styles.separatorContainer}>
                  <Separator style={styles.separator} />
                  <Text style={styles.separatorText}>or continue with email</Text>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Label style={styles.label}>Email</Label>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Label style={styles.label}>Password</Label>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <Button 
                    style={isLoading ? styles.submitButtonDisabled : styles.submitButton}
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Text>
                  </Button>
                </View>
                
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Demo hint */}
      <Text style={styles.demoHint}>
        Demo app - use any email and password or social login to continue
      </Text>
    </ScrollView>
  );
}

function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Navigate to main app
    navigation.navigate('Main');
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    // Simulate social login API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Navigate to main app
    navigation.navigate('Main');
  };

  const SocialButton = ({ 
    provider, 
    icon, 
    text, 
    style 
  }: { 
    provider: 'google' | 'facebook' | 'apple'; 
    icon: React.ReactNode; 
    text: string; 
    style: any;
  }) => (
    <TouchableOpacity
      style={[styles.socialButton, style]}
      onPress={() => handleSocialLogin(provider)}
      disabled={isLoading}
    >
      {icon}
      <Text style={styles.socialButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>A</Text>
        </View>
        <Text style={styles.appTitle}>Alartd</Text>
        <Text style={styles.appSubtitle}>New Zealand Disaster Safety</Text>
      </View>

      {/* Auth Form */}
      <Card style={styles.authCard}>
        <CardHeader style={styles.cardHeader}>
          <Tabs defaultValue="signup" style={styles.tabs}>
            <TabsList style={styles.tabsList}>
              <TabsTrigger value="login" style={styles.tabTrigger}>Login</TabsTrigger>
              <TabsTrigger value="signup" style={styles.tabTrigger}>Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" style={styles.tabContent}>
              <CardContent style={styles.cardContent}>
                {/* Social Login Buttons */}
                <View style={styles.socialButtonsContainer}>
                  <SocialButton
                    provider="google"
                    style={styles.googleButton}
                    text="Sign up with Google"
                    icon={
                      <View style={styles.googleIcon}>
                        <Text style={styles.googleIconText}>G</Text>
                      </View>
                    }
                  />
                  
                  <SocialButton
                    provider="apple"
                    style={styles.appleButton}
                    text="Sign up with Apple"
                    icon={
                      <View style={styles.appleIcon}>
                        <Text style={styles.appleIconText}>🍎</Text>
                      </View>
                    }
                  />
                  
                  <SocialButton
                    provider="facebook"
                    style={styles.facebookButton}
                    text="Sign up with Facebook"
                    icon={
                      <View style={styles.facebookIcon}>
                        <Text style={styles.facebookIconText}>f</Text>
                      </View>
                    }
                  />
                </View>

                <View style={styles.separatorContainer}>
                  <Separator style={styles.separator} />
                  <Text style={styles.separatorText}>or sign up with email</Text>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Label style={styles.label}>Email</Label>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Label style={styles.label}>Password</Label>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <Button 
                    style={isLoading ? styles.submitButtonDisabled : styles.submitButton}
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Text>
                  </Button>
                </View>
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Demo hint */}
      <Text style={styles.demoHint}>
        Demo app - use any email and password or social login to continue
      </Text>
    </ScrollView>
  );
}

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={() => null} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  authCard: {
    margin: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  tabs: {
    width: '100%',
  },
  tabsList: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  tabContent: {
    marginTop: 24,
  },
  cardContent: {
    padding: 0,
    gap: 16,
  },
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  googleButton: {
    borderColor: '#4285F4',
  },
  appleButton: {
    borderColor: '#000000',
  },
  facebookButton: {
    borderColor: '#1877F2',
  },
  googleIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#4285F4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appleIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleIconText: {
    fontSize: 16,
  },
  facebookIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#1877F2',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorContainer: {
    position: 'relative',
    marginVertical: 24,
    alignItems: 'center',
  },
  separator: {
    width: '100%',
  },
  separatorText: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6B7280',
  },
  demoHint: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 40,
    paddingHorizontal: 24,
  },
});
