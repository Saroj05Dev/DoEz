const { loginUser } = require("../services/authService");

async function login(req, res) {
  const loginPayload = req.body;

  try {
    const user = await loginUser(loginPayload);

    // Set JWT in httpOnly cookie
    res.cookie("authToken", user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token: user.token, // optional (for testing tools)
        userRole: user.role,
        userData: user.userData,
      },
      error: {},
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || error.reason,
      error: error,
    });
  }
}

async function logout(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: {},
    error: {},
  });
}

module.exports = {
  login,
  logout,
};
