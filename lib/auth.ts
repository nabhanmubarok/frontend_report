import Cookies from "js-cookie";

export interface User {
  id: number;
  username: string;
  role: "user" | "admin" | "super_admin";
}

export const getUser = (): User | null => {
  try {
    const raw = Cookies.get("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuth = (token: string, user: User) => {
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("user", JSON.stringify(user), { expires: 7 });
};

export const clearAuth = () => {
  Cookies.remove("token");
  Cookies.remove("user");
};

export const getImageUrl = (filename: string | null) => {
  if (!filename) return null;
return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://backendreport-production-cd31.up.railway.app"}/uploads/${filename}`;};

export const isAdmin = (user: User | null) =>
  user?.role === "admin" ;

export const isSuperAdmin = (user: User | null) =>
  user?.role === "super_admin";
