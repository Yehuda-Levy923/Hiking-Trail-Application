import authService from "../services/authService.js";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";

export const authController = {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  register: asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Check if email already exists
    const emailExists = await authService.emailExists(email);
    if (emailExists) {
      throw ApiError.badRequest("Email already registered");
    }

    // Create user
    const user = await authService.create({ email, password, name });

    // Generate token
    const token = authMiddleware.generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user,
        token,
      },
    });
  }),

  /**
   * POST /api/auth/login
   * Login user
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Verify credentials
    const user = await authService.verifyCredentials(email, password);

    if (!user) {
      throw ApiError.badRequest("Invalid email or password");
    }

    // Generate token
    const token = authMiddleware.generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  }),

  /**
   * GET /api/auth/me
   * Get current user info (protected route)
   */
  me: asyncHandler(async (req, res) => {
    const user = await authService.findById(req.user.id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  }),
};

export default authController;
