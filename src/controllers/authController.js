const { loginUser } = require("../services/authService");

async function login(req, res) {
  const loginPayload = req.body;

  try {
    const user = await loginUser(loginPayload);

    // ✅ Set JWT in httpOnly cookie
    res.cookie("authToken", user.token, {
      httpOnly: true,
      secure: false,      // true only in HTTPS (production)
      sameSite: "lax",    // 🔥 FIXED (NOT strict)
      maxAge: 1000 * 60 * 60 // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token: user.token,     // optional (for testing tools)
        userRole: user.role,
        userData: user.userData
      },
      error: {}
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || error.reason,
      error: error
    });
  }
}

async function logout(req, res) {
  res.cookie("authToken", user.token, {
  httpOnly: true,
  secure: false,      
  sameSite: "lax",   
  maxAge: 1000 * 60 * 60


  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: {},
    error: {}
  });
}

module.exports = {
  login,
  logout
};
