import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { paginationMetadata } from "../utils/response";

const userRepository = new UserRepository();

export class UserService {
    async createUser(data: CreateUserDTO) {
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if (emailCheck) {
            throw new HttpError(403, "Email already in use");
        }
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if (usernameCheck) {
            throw new HttpError(403, "Username already in use");
        }
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;

        const newUser = await userRepository.createUser(data);
        const userObj: any = newUser.toObject ? newUser.toObject() : newUser;
        delete userObj.password;
        return userObj;
    }

    async loginUser(data: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs.compare(data.password, user.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid credentials");
        }
        const normalizedRole = user.role || (user.email === 'admin@craftybee.com' || user.username === 'admin' ? 'admin' : 'user');
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: normalizedRole,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
        const userObj: any = user.toObject ? user.toObject() : user;
        delete userObj.password;
        userObj.role = normalizedRole;
        return { token, user: userObj };
    }

    async getUserById(id: string) {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const userObj: any = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return userObj;
    }

    async updateProfile(id: string, data: { firstName?: string; lastName?: string; username?: string }) {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        if (data.username && data.username !== user.username) {
            const existing = await userRepository.getUserByUsername(data.username);
            if (existing) {
                throw new HttpError(403, "Username already in use");
            }
        }
        const updated = await userRepository.updateUser(id, data);
        if (!updated) {
            throw new HttpError(404, "User not found");
        }
        const userObj: any = updated.toObject ? updated.toObject() : updated;
        delete userObj.password;
        return userObj;
    }

    async changePassword(id: string, currentPassword: string, newPassword: string) {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const valid = await bcryptjs.compare(currentPassword, user.password);
        if (!valid) {
            throw new HttpError(401, "Current password is incorrect");
        }
        const hashed = await bcryptjs.hash(newPassword, 10);
        await userRepository.updateUser(id, { password: hashed });
        return true;
    }

    async listAllUsers(page: number = 1, limit: number = 20) {
        const allUsers = await userRepository.getAllUsers();
        const total = allUsers.length;
        const startIndex = (page - 1) * limit;
        const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);
        const safeUsers = paginatedUsers.map((u: any) => {
            const obj = u.toObject ? u.toObject() : u;
            delete obj.password;
            return obj;
        });
        return {
            data: safeUsers,
            metadata: paginationMetadata(total, page, limit),
        };
    }

    async toggleUserRole(id: string) {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const newRole = user.role === "admin" ? "user" : "admin";
        const updated = await userRepository.updateUser(id, { role: newRole });
        if (!updated) {
            throw new HttpError(404, "User not found");
        }
        const userObj: any = updated.toObject ? updated.toObject() : updated;
        delete userObj.password;
        return userObj;
    }

    async deleteUser(id: string) {
        return userRepository.deleteUser(id);
    }
}
