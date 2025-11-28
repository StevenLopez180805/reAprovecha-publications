import jwt from "jsonwebtoken";

const JWT_SECRET = "kjuyuiopoi1964672679kjuyuiopoi21";

export class AuthApplication{
  static generateToken(payload:object):string{
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});
  }

  static verifyToken(token: string): any{
    return jwt.verify(token, JWT_SECRET);
  }
}