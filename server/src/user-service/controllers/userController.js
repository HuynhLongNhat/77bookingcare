import userService from "../services/userService";

const userController = {
  // Auth Controllers
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      const data = await userService.register({ email, password });

      return res.status(201).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      // Xử lý lỗi không mong muốn ở controller
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      // Set token in cookie
      res.cookie("token", result.DT.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  logout: async (req, res) => {
    try {
      const result = await userService.logout(req.user.userId);
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
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
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await userService.forgotPassword(email);
      return res.status(200).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
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
    console.log("user", req.user.userId);
    try {
      const userId = req.user.userId;
      const profile = await userService.getUserProfile(userId);
      return res.status(200).json({
        EM: profile.EM,
        EC: profile.EC,
        DT: profile.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { full_name, phone, date_of_birth, gender, address, avatar } =
        req.body;
      // Chỉ cho phép cập nhật các trường được phép
      const allowedUpdates = {
        full_name,
        phone,
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
        EM: updatedProfile.EM,
        EC: updatedProfile.EC,
        DT: updatedProfile.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  // Role Management Controllers
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        EM: users.EM,
        EC: users.EC,
        DT: users.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);

      return res.status(404).json({
        EM: user.EM,
        EC: user.EC,
        DT: user.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  updateRoleUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const newRole = req.body;
      const updatedUser = await userService.updateRoleUser(
        userId,
        newRole.user_role
      );
      return res.status(200).json({
        EM: updatedUser.EM,
        EC: updatedUser.EC,
        DT: updatedUser.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      let user = await userService.deleteUser(userId);

      return res.status(200).json({
        EM: user.EM,
        EC: user.EC,
        DT: user.DT,
      });
    } catch (error) {
      return res.status(500).json({
        EM: "Lỗi hệ thống: " + error.message,
        EC: -1,
        DT: [],
      });
    }
  },
};

export default userController;
