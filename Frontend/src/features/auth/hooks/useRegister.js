import { registerAPI } from "../api/auth.api";
import useAuthStore from "../state/auth.store";

export default function useRegister() {
  const { setUser, setLoading } = useAuthStore();

  async function register(formData) {
    try {
      setLoading(true);
      const data = await registerAPI(formData);
      setUser(data.user);

      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  }

  return { register };
}

