import { registerAPI } from "../api/auth.api";
import useAuthStore from "../state/auth.store";

export default function useRegister() {
  const { setUser, setLoading } = useAuthStore();

  async function register(formData) {
    try {
      setLoading(true);
      const data = await registerAPI(formData);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { register };
}

