import useAuthStoreLogin from "../state/auth.storelogin";

export default function useLogin() {
  const login = useAuthStoreLogin((state) => state.login);
  const loading = useAuthStoreLogin((state) => state.loading);

  return { login, loading };
}
