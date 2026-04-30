import useAuthStore from "../state/auth.storelogOut";

export default function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  return { logout };
}
