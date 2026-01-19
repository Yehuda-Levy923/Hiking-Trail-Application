import authService from "../services/authService.js";
import passwordResetService from "../services/passwordResetService.js";
import favoritesService from "../services/favoritesService.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";

export const usersController = {
  // ==========================================
  // Profile Endpoints
  // ==========================================

  /**
   * GET /api/users/profile
   * Get current user's profile
   */
  getProfile: asyncHandler(async (req, res) => {
    const user = await authService.findById(req.user.id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  }),

  /**
   * PUT /api/users/profile
   * Update current user's profile
   */
  updateProfile: asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if new email is already used by another user
    if (email) {
      const emailInUse = await authService.emailExistsForOther(email, userId);
      if (emailInUse) {
        throw ApiError.badRequest("Email already in use");
      }
    }

    const updatedUser = await authService.updateProfile(userId, { name, email });

    if (!updatedUser) {
      throw ApiError.notFound("User not found");
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  }),

  // ==========================================
  // Favorites Endpoints
  // ==========================================

  /**
   * GET /api/users/favorites
   * Get current user's favorite trails
   */
  getFavorites: asyncHandler(async (req, res) => {
    const favorites = await favoritesService.getUserFavorites(req.user.id);

    res.json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  }),

  /**
   * POST /api/users/favorites/:trailId
   * Add a trail to favorites
   */
  addFavorite: asyncHandler(async (req, res) => {
    const { trailId } = req.params;

    await favoritesService.addFavorite(req.user.id, parseInt(trailId, 10));

    res.status(201).json({
      success: true,
      message: "Trail added to favorites",
    });
  }),

  /**
   * DELETE /api/users/favorites/:trailId
   * Remove a trail from favorites
   */
  removeFavorite: asyncHandler(async (req, res) => {
    const { trailId } = req.params;

    await favoritesService.removeFavorite(req.user.id, parseInt(trailId, 10));

    res.json({
      success: true,
      message: "Trail removed from favorites",
    });
  }),

  /**
   * GET /api/users/favorites/:trailId
   * Check if a trail is favorited
   */
  checkFavorite: asyncHandler(async (req, res) => {
    const { trailId } = req.params;

    const isFavorited = await favoritesService.isFavorited(
      req.user.id,
      parseInt(trailId, 10)
    );

    res.json({
      success: true,
      data: { is_favorited: isFavorited },
    });
  }),
};

export const authController = {
  // ==========================================
  // Password Reset Endpoints
  // ==========================================

  /**
   * POST /api/auth/forgot-password
   * Request password reset
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Always return success message (for security - don't reveal if email exists)
    const successMessage =
      "If an account with that email exists, a password reset link has been sent.";

    // Find user by email
    const user = await authService.findByEmail(email);

    if (user) {
      // Create reset token
      const token = await passwordResetService.createToken(user.id);

      // Log reset link to console (in production, this would send an email)
      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      console.log("\n========================================");
      console.log("PASSWORD RESET LINK (for testing):");
      console.log(resetUrl);
      console.log("========================================\n");
    }

    res.json({
      success: true,
      message: successMessage,
    });
  }),

  /**
   * POST /api/auth/reset-password
   * Reset password with token
   */
  resetPassword: asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Validate token
    const tokenRecord = await passwordResetService.validateToken(token);

    if (!tokenRecord) {
      throw ApiError.badRequest(
        "Reset token is invalid or has expired. Please request a new password reset."
      );
    }

    // Update password
    await authService.updatePassword(tokenRecord.user_id, password);

    // Mark token as used
    await passwordResetService.markTokenUsed(token);

    res.json({
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });
  }),
};

export default { usersController, authController };
