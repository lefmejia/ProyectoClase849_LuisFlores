import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ScreenWrapper from "../components/ScreenWrapper";
import { supabase } from "../services/supabaseClient";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { env } from "../config/env";

export default function RegisterScreen ({ navigation }: any) {
     //definicion de una variable de estado en ReactN
const [email, setEmail] = useState("");
const [password, setPassword] = useState ("");
const [name, setName] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");

  GoogleSignin.configure({
    webClientId: env.webClientId,
  })

const handleRegister = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if(error)
  {
    Alert.alert("Error al registrarse", error.message);
  }
  else if(data.user !== null){
    navigation.navigate("MainTabs");
  }
}

const handleIdToken = async (response:any) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.data.idToken,
            })
    return {data, error}
}

const handleRegisterWithGoogle = async () => {
  try {
          await GoogleSignin.hasPlayServices()
          const response = await GoogleSignin.signIn()
          if (isSuccessResponse(response)) {
            const { data, error } = await handleIdToken(response);
            if (error) {
              Alert.alert("Error al registrarse", error.message);
            } else if (data.user !== null) {
              navigation.navigate("MainTabs");
            }
          }
        } catch (error: any) {
          if (error.code === statusCodes.IN_PROGRESS) {
            console.log("operation (e.g. sign in) is in progress already");
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log("play services not available or outdated");
          } else {
            console.log("some other error happened", error);
          }
        }
}

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        
        <CustomInput 
          placeholder={"Ingresa tu nombre"} 
          value={name} 
          onChange={setName}
          />
            <CustomInput 
            type={"number"}
          placeholder={"Ingresa tu numero de telefono"} 
          value={phoneNumber} 
          onChange={setPhoneNumber}
          />
        <CustomInput 
          type={"email"} 
          placeholder={"micorreo@gmail.com"} 
          value={email} 
          onChange={setEmail}
          />
        <CustomInput 
          type={"password"} 
          placeholder={"Ingresa tu contraseña"} 
          value={password} 
          onChange={setPassword}
          />
        <CustomButton
          title={"Registrarse"}
          onPress={handleRegister}
        />
        <CustomButton
          title={"Continuar con Google"}
          onPress={handleRegisterWithGoogle}
          variant="secondary"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    
  },
});