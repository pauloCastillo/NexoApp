import * as SecureStore from "expo-secure-store";
import { TOKEN_KEYS } from "../types/token";

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
  } catch {
    return null;
  }
}

export async function setTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
  await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, refreshToken);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
  await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null && token !== "";
}
