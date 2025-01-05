import userService from "../services/userService";

const userController = {
  // Auth Controllers
  register: async (req, res) => {
    try {
      const { username, email, password, phone } = req.body;
      const result = await userService.register({
        username,
        email,
        password,
        phone,
      });
      return res.status(201).json({
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await userService.login(username, password);

      // Set token in cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const result = await userService.logout(req.user.userId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await userService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await userService.forgotPassword(email);
      return res.status(200).json({
        message: "Password reset instructions sent to your email",
        data: result,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      return res.status(error.status || 400).json({
        message: error.message || "Failed to process password reset request",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          message: "Token và mật khẩu mới là bắt buộc",
        });
      }

      const result = await userService.resetPassword(token, newPassword);

      return res.status(200).json({
        message: "Mật khẩu đã được cập nhật thành công",
        data: result,
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(400).json({
        message: error.message || "Không thể cập nhật mật khẩu",
      });
    }
  },

  // Profile Controllers
  getProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const profile = await userService.getUserProfile(userId);

      return res.status(200).json({
        data: profile,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { full_name, date_of_birth, gender, address, avatar } = req.body;

      // Chỉ cho phép cập nhật các trường được phép
      const allowedUpdates = {
        full_name,
        date_of_birth,
        gender,
        address,
        avatar,
      };

      // Kiểm tra giá trị của gender
      if (gender && !["M", "F", "OTHER"].includes(gender)) {
        return res.status(400).json({
          message: "Invalid gender value. Must be 'M', 'F', or 'OTHER'",
        });
      }

      const updatedProfile = await userService.updateProfile(
        userId,
        allowedUpdates
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  // Role Management Controllers
  changeUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Kiểm tra role hợp lệ
      const validRoles = ["PATIENT", "DOCTOR", "ADMIN"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Must be PATIENT, DOCTOR, or ADMIN",
        });
      }

      const result = await userService.changeUserRole(userId, role);

      return res.status(200).json({
        message: "User role updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  getUsersByRole: async (req, res) => {
    try {
      const { role } = req.params;
      const users = await userService.getUsersByRole(role);

      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        message: "Users retrieved successfully",
        data: users.data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  updateRoleUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const userRole = req.user.role;
      const updateData = req.body;
      // Kiểm tra quyền truy cập
      if (userRole !== "ADMIN") {
        return res.status(403).json({
          message: "Only admin can update user role",
        });
      }
      // Validate role
      if (!updateData.user_role) {
        return res.status(400).json({
          message: "Role is required",
        });
      }
      // Kiểm tra role hợp lệ
      const validRoles = ["PATIENT", "DOCTOR", "ADMIN"];
      if (!validRoles.includes(updateData.user_role)) {
        return res.status(400).json({
          message: "Invalid role. Must be PATIENT, DOCTOR, or ADMIN",
        });
      }
      const updatedUser = await userService.updateRoleUser(
        userId,
        updateData.user_role
      );
      return res.status(200).json({
        message: "User role updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);

      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },
};

export default userController;
