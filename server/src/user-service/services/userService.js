import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../models/index";
import emailService from "../../email-service/emailService";

class UserService {
  async register(userData) {
    try {
      const { email, password } = userData;

      // Check existing user
      const existingUser = await db.users.findOne({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        return {
          EM: "Email đã tồn tại!",
          EC: -1,
          DT: [],
        };
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.users.create({
        user_id: uuidv4(),
        email,
        password: hashedPassword,
        user_role: "PATIENT",
      });

      // Create user profile
      let newUser = await db.user_profiles.create({
        profile_id: uuidv4(),
        user_id: user.user_id,
      });

      if (newUser) {
        return {
          EM: "Đăng ký thành công!",
          EC: 0,
          DT: user,
        };
      }
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -1,
        DT: [],
      };
    }
  }

  async login(email, password) {
    try {
      const user = await db.users.findOne({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
          EM: "Email hoặc mật khẩu không đúng!",
          EC: -1,
          DT: [],
        };
      }

      const token = jwt.sign(
        {
          userId: user.user_id,
          email: user.email,
          role: user.user_role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return {
        EM: "Đăng nhập thành công",
        EC: 0,
        DT: {
          user,
          token,
        },
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -3,
        DT: [],
      };
    }
  }

  async logout(userId) {
    try {
      return {
        EM: "Đăng xuất thành công!",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -1,
        DT: [],
      };
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await db.users.findByPk(userId);
      if (!user) {
        return {
          EM: "Không tìm thấy người dùng!",
          EC: -1,
          DT: [],
        };
      }

      // Verify old password
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        return {
          EM: "Mật khẩu cũ không đúng!",
          EC: -2,
          DT: [],
        };
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });
      return {
        EM: "Mật khẩu được đổi thành công!",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -3,
        DT: [],
      };
    }
  }

  async forgotPassword(email) {
    try {
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        return {
          EM: "Email không tồn tại trong hệ thống!",
          EC: -1,
          DT: [],
        };
      }
      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      await emailService.sendPasswordResetEmail(email, resetToken);
      return {
        EM: "Nhấn vào link xác nhận trong email để đổi mật khẩu",
        EC: 0,
        DT: [],
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống : " + error.message,
        EC: -1,
        DT: [],
      };
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
  async getUserProfile(userId) {
    try {
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

      if (!profile) {
        return {
          EM: "Không tìm thấy người dùng!",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Thông tin người dùng",
        EC: 0,
        DT: profile,
      };
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  }

  async updateProfile(userId, profileData) {
    try {
      // Validate date format if provided
      if (profileData.date_of_birth) {
        const isValidDate = !isNaN(
          new Date(profileData.date_of_birth).getTime()
        );
        if (!isValidDate) {
          return {
            EM: "Ngày sinh không đúng định dạng!",
            EC: -2,
            DT: [],
          };
        }
      }

      // Find the user profile
      const userProfile = await db.user_profiles.findOne({
        where: { user_id: userId },
      });

      if (!userProfile) {
        return {
          EM: "Không tìm thấy người dùng!",
          EC: -1,
          DT: [],
        };
      }
      // Update the profile
      let userUpdate = await userProfile.update(profileData);
      if (!userUpdate) {
        return {
          EM: "Không thể cập nhật thông tin người dùng!",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Thông tin người dùng đã được cập nhật thành công!",
        EC: 0,
        DT: userUpdate,
      };
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
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
      if (!users) {
        return {
          EM: "Không tìm thấy người dùng!",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Lấy danh sách người dùng thành công!",
        EC: 0,
        DT: users,
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      };
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
        return {
          EM: "Không tìm thấy người dùng!",
          EC: -1,
          DT: [],
        };
      }
      return {
        EM: "Lấy thông tin người dùng thành công!",
        EC: 0,
        DT: user,
      };
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  }
  async updateRoleUser(userId, newRole) {
    try {
      const user = await db.users.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return {
          EM: "Không tìm thấy người dùng!",
          EC: -1,
          DT: [],
        };
      }
      const validRoles = ["PATIENT", "DOCTOR", "ADMIN"];
      if (!validRoles.includes(newRole)) {
        return {
          EM: "Role phải là PATIENT, DOCTOR hoặc ADMIN",
          EC: -2,
          DT: [],
        };
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

      return {
        EM: "Role đã được cập nhật thành công!",
        EC: 0,
        DT: updatedUser,
      };
    } catch (error) {
      return {
        EM: "Lỗi hệ thống:" + error.message,
        EC: -1,
        DT: [],
      };
    }
  }
  async deleteUser(userId) {
    try {
      const result = await db.users.destroy({
        where: { user_id: userId },
      });

      if (result) {
        return {
          EM: "Xóa người dùng thành công!",
          EC: 0,
          DT: [],
        };
      } else {
        return {
          EM: "Người dùng không tồn tại.",
          EC: 1,
          DT: [],
        };
      }
    } catch (error) {
      return {
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      };
    }
  }
}

export default new UserService();
