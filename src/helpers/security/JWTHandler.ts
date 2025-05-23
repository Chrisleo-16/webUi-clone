import { SignJWT, jwtVerify } from "jose";
import { User3partyDTO } from "@/types/user3party.types";
import dotenv from "dotenv";

dotenv.config();

export default class JWTHandler {
  private static readonly secretKey =
    process.env.JWT_CONTINUE_3PARTY_SECRET ||
    "0TSKwiJg88kEoQkJrhNCNTpEcvjILEDpTTXZNEdts0=";

  static async encode(payload: User3partyDTO): Promise<string> {
    console.log("JWTHandler.encode called with payload:", payload);
    try {
      const secretKeyBuffer = new TextEncoder().encode(this.secretKey);

      const jwt = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secretKeyBuffer);

      console.log("JWT created successfully");
      return jwt;
    } catch (error) {
      console.error("Error encoding JWT:", error);
      throw new Error(
        `Failed to create JWT: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  static async decode<T>(token: string): Promise<T> {
    try {
      const secretKeyBuffer = new TextEncoder().encode(this.secretKey);
      const { payload } = await jwtVerify(token, secretKeyBuffer);
      return payload as unknown as T;
    } catch (error) {
      throw new Error(
        `Failed to decode JWT: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
