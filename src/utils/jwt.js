import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Generate a JSON Web Token (JWT) with the provided payload
export async function generateToken(payload) {
  const generatedToken = jwt.sign(payload, "IIVSIUVISUBCIBUIWVFYUVWVY", {
    expiresIn: "1h",
  });
  return generatedToken;
}

// Verify and decode a JWT to extract the payload
export async function verifyToken(generatedToken) {
  return jwt.verify(generatedToken, "IIVSIUVISUBCIBUIWVFYUVWVY");
}

export async function generateAdminToken(payload) {
  const generatedToken = jwt.sign(payload, "IOSNCNCSOCINOICOIIKCI", {
    expiresIn: "1h",
  });
  return generatedToken;
}

export async function verifyAdminToken(generatedToken) {
  return jwt.verify(generatedToken, "IOSNCNCSOCINOICOIIKCI");
}
