const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/serverConfig");
const { findUser, createUser } = require("../repositories/userRepository");
const { findOtp } = require("../repositories/otpRepository");

async function loginUser(authDetails) {
  let { phone, password } = authDetails;
  phone = phone.replace(/\D/g, "");

  // 1 Check user
  const user = await findUser({ phone });
  if (!user) {
    throw { reason: "User not found", statusCode: 400 };
  }

  // 1.5 Check if suspended
  if (user.status === "suspended") {
    throw { reason: "you are suspened by the admin please contant to admin", statusCode: 403 };
  }

  // 2 Verify password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw { reason: "Invalid password", statusCode: 400 };
  }

  const role = user.role || "user";

  // 3 Generate token
  const token = jwt.sign(
    { id: user._id, phone: user.phone, role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    role,
    userData: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

async function registerAndLogin(userDetails) {
  let { name, email, phone, password, role } = userDetails;
  phone = phone.replace(/\D/g, "");

  // 1 Check duplicates
  const existing =
    (await findUser({ email })) || (await findUser({ phone }));

  if (existing) {
    throw {
      reason: "User with this email or phone already exists",
      statusCode: 400,
    };
  }

  // 2 OTP must be verified
  const otpStillExists = await findOtp(phone);
  if (otpStillExists) {
    throw {
      reason: "Phone number not verified. Please verify OTP.",
      statusCode: 400,
    };
  }

  // 3 Validate password (raw)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw { reason: "Weak password", statusCode: 400 };
  }

  // 4 Hash ONCE
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5 Create user
  const user = await createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role: role || "user",
    isVerified: true,
  });

  // 6 Auto-login token
  const token = jwt.sign(
    { id: user._id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    role: user.role,
    userData: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

module.exports = { loginUser, registerAndLogin };
