import useAuthStoreLogin from "../state/auth.storelogin";

export default function useLogout() {
  const logout = useAuthStoreLogin((state) => state.logout);
  return { logout };
}
