import { router } from 'expo-router';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from './firebase/config';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const icon = require('../assets/images/logo_egida.png');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [ocupacion, setOcupacion] = useState('');

  const register = async () => {
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (
    !nombre ||
    !apellido ||
    !telefono ||
    !dni ||
    !fechaNacimiento ||
    !ocupacion ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    alert('Complete todos los campos');
    return;
  }

  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await sendEmailVerification(userCredential.user);

    alert('Se envió un correo de verificación');

    console.log(userCredential.user);

    router.push('/verify-email');

  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#10172B',
        alignItems: 'center',
        paddingTop: 50,
      }}
    >
      <StatusBar style="light" />

      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 20,
          top: 50,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: 'white', fontSize: 30 }}>←</Text>
      </TouchableOpacity>

      <Image
        source={icon}
        style={{
          width: 160,
          height: 160,
        }}
      />

      <Text
        style={{
          color: 'white',
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Registrarse
      </Text>

      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.halfInput}
        />

        <TextInput
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
          style={styles.halfInput}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          style={styles.halfInput}
        />

        <TextInput
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
          style={styles.halfInput}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="Fecha nacimiento"
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
          style={styles.halfInput}
        />

        <TextInput
          placeholder="Ocupación"
          value={ocupacion}
          onChangeText={setOcupacion}
          style={styles.halfInput}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={register}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Crear cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: {
    backgroundColor: '#F0F0F2',
    width: 250,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  row: {
    flexDirection: 'row' as const,
    gap: 4,
    marginBottom: 10,
  },

  halfInput: {
    backgroundColor: '#F0F0F2',
    width: 120,
    height: 40,
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: '#F0F0F2',
    width: 130,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 30,
  },
};