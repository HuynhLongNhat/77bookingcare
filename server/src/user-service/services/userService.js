import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import db from "../models/index";
import emailService from "../../email-service/emailService";

class UserService {
  async register(userData) {
    const { username, email, password, phone } = userData;

    // Check existing user
    const existingUser = await db.users.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.users.create({
      user_id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      phone,
      user_role: "PATIENT",
    });

    // Create user profile
    await db.user_profiles.create({
      profile_id: uuidv4(),
      user_id: user.user_id,
    });

    return this.sanitizeUser(user);
  }

  async login(username, password) {
    const user = await db.users.findOne({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.user_role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async logout(userId) {
    // Với JWT, server không cần làm gì vì token được lưu ở client
    // Client sẽ xóa token từ localStorage hoặc memory
    return { message: "Logged out successfully" };
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await db.users.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return { message: "Password changed successfully" };
  }

  async forgotPassword(email) {
    try {
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      try {
        await emailService.sendPasswordResetEmail(email, resetToken);
        return { message: "Password reset instructions sent to email" };
      } catch (error) {
        console.error("Error in forgotPassword:", error);
        throw new Error(
          "Failed to send password reset email: " + error.message
        );
      }
    } catch (error) {
      console.error("ForgotPassword service error:", error);
      throw error;
    }
  }

  async getUserProfile(userId) {
    const profile = await db.users.findOne({
      where: { user_id: userId },
      include: [
        {
          model: db.user_profiles,
          as: "user_profiles",
        },
      ],
      attributes: { exclude: ["password"] },
    });

    if (!profile) throw new Error("Profile not found");
    return profile;
  }

  async updateProfile(userId, profileData) {
    try {
      // Validate date format if provided
      if (profileData.date_of_birth) {
        const isValidDate = !isNaN(
          new Date(profileData.date_of_birth).getTime()
        );
        if (!isValidDate) {
          throw new Error("Invalid date format for date_of_birth");
        }
      }

      // Find the user profile
      const userProfile = await db.user_profiles.findOne({
        where: { user_id: userId },
      });

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Update the profile
      await userProfile.update(profileData);

      // Fetch and return the updated profile
      const updatedProfile = await db.users.findOne({
        where: { user_id: userId },
        include: [
          {
            model: db.user_profiles,
            as: "user_profiles",
          },
        ],
        attributes: { exclude: ["password"] },
      });

      if (!updatedProfile) {
        throw new Error("User not found");
      }

      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  // Helper method to remove sensitive data
  sanitizeUser(user) {
    const sanitized = user.toJSON();
    delete sanitized.password;
    return sanitized;
  }

  async getAllUsers() {
    try {
      const users = await db.users.findAll({
        include: [
          {
            model: db.user_profiles,
            as: "user_profiles",
          },
        ],
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
      });

      return {
        data: users,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await db.users.findOne({
        where: { user_id: userId },
        include: [
          {
            model: db.user_profiles,
            as: "user_profiles",
          },
        ],
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      // Validate role if it's being updated
      if (
        updateData.user_role &&
        !["PATIENT", "DOCTOR", "ADMIN"].includes(updateData.user_role)
      ) {
        throw new Error("Invalid role");
      }

      // Validate email format if it's being updated
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          throw new Error("Invalid email format");
        }
      }

      const user = await db.users.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await user.update(updateData);

      // Fetch updated user without password
      const updatedUser = await this.getUserById(userId);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async updateRoleUser(userId, newRole) {
    try {
      const user = await db.users.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Cập nhật role
      await user.update({ user_role: newRole });

      // Lấy thông tin user đã cập nhật (không bao gồm password)
      const updatedUser = await db.users.findOne({
        where: { user_id: userId },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.user_profiles,
            as: "user_profiles",
          },
        ],
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(userId) {
    try {
      const user = await db.users.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await user.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user
      const user = await db.users.findOne({
        where: { user_id: decoded.userId },
      });

      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu
      await user.update({
        password: hashedPassword,
      });

      return {
        success: true,
        message: "Mật khẩu đã được cập nhật thành công",
      };
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      throw new Error("Không thể cập nhật mật khẩu: " + error.message);
    }
  }
}

export default new UserService();
