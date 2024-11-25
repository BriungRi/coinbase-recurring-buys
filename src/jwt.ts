import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
const ALGORITHM = "ES256";

export const generateJWT = (
  keyName: string,
  keySecret: string,
  uri: string
): string => {
  const payload = {
    iss: "cdp",
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120,
    sub: keyName,
    uri,
  };

  const header = {
    alg: ALGORITHM,
    kid: keyName,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  return jwt.sign(payload, keySecret, { algorithm: ALGORITHM, header });
};
