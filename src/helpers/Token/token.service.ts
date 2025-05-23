import { jwtDecode } from "jwt-decode";

export default class TokenService {
  static async saveToken(token: string) {
    localStorage.setItem("tk-xm", token);
  }
  static async removeToken() {
    localStorage.removeItem("tk-xm");
  }

  static async getToken(): Promise<string> {
    const userToken: string = localStorage.getItem("tk-xm") || "";
    return userToken;
  }

  static async decodeToken(): Promise<any> {
    const token = await this.getToken();
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      await this.removeToken();
      return null;
    }
  }

  static async isTokenExpired(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) {
      return true;
    }

    const decoded: any = await this.decodeToken();
    if (!decoded || !decoded.exp) {
      await this.removeToken();
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  static async getValidToken(): Promise<string | null> {
    const token = await this.getToken();
    if (!token || (await this.isTokenExpired())) {
      await this.removeToken();
      console.warn("Token is either missing or expired");
      return null;
    }
    return token;
  }

  static async forceLogout() {
    localStorage.removeItem("tk-xm");
    sessionStorage.removeItem("tk-xm");
    sessionStorage.removeItem("redirectUrl");
  }
}
