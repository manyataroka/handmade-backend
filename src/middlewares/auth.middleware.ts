// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config";
// import { HttpError } from "../errors/http-error";

// export interface AuthRequest extends Request {
//     user?: {
//         id: string;
//         email: string;
//         username: string;
//         firstName?: string;
//         lastName?: string;
//         role?: string;
//     };
// }

// export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers['authorization'];
//     const rawCookie = req.headers['cookie'] || '';
//     const rawCookies: Record<string, string> = {};
//     rawCookie.split(';').forEach((pair) => {
//         const [k, ...rest] = pair.trim().split('=');
//         if (k) rawCookies[k.trim()] = rest.join('=');
//     });
//     const cookieToken = rawCookies['token'];
//     const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
//     const token = cookieToken || headerToken;

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Authentication required" });
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as any;
//         const normalizedRole = decoded?.role || (decoded?.email === 'admin@craftybee.com' || decoded?.username === 'admin' ? 'admin' : 'user');
//         req.user = {
//             ...decoded,
//             role: normalizedRole,
//         };
//         next();
//     } catch (err) {
//         return res.status(403).json({ success: false, message: "Invalid or expired token" });
//     }
// };

// export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//         return res.status(401).json({ success: false, message: "Authentication required" });
//     }
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ success: false, message: "Admin access required" });
//     }
//     next();
// };
