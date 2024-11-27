import { supabase } from "../lib/supabase";
import { storeUserUUID } from "./storageService";

export async function registerUser(
  email,
  password,
  fullName,
  birthdate,
  height,
  weight,
  condition
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error during registration:", error.message);
      throw new Error(error.message);
    }

    const userId = data.user.id;

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name: fullName,
        birthdate: birthdate,
        height: parseInt(height) || null,
        weight: parseInt(weight) || null,
        condition: condition || null,
      },
    ]);

    if (profileError) {
      console.error("Error adding profile:", profileError.message);
      throw new Error(profileError.message);
    }

    console.log("User registered successfully!");
    console.log("Session:", data.session);

    if (data.user) {
      await storeUserUUID(data.user.id);
    }

    return { success: true, message: "User registered successfully!" };
  } catch (err) {
    console.error("Registration failed:", err.message);
    return { success: false, message: err.message };
  }
}

export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error during login:", error.message);
      throw new Error(error.message);
    }

    console.log("User logged in successfully!", data);
    console.log("Session:", data.session);

    if (data.user) {
      await storeUserUUID(data.user.id);
    }

    return { success: true, message: "User logged in successfully!", data };
  } catch (err) {
    console.error("Login failed:", err.message);
    return { success: false, message: err.message };
  }
}
