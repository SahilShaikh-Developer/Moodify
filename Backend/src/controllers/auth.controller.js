const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");
const { OAuth2Client } = require("google-auth-library");

/**Cookie settings */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5173",
);

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    /**Checking-1 Validation */
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /**Checking-2 existing user*/
    const isAlreadyRegistered = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({
        message: "User with the same email or username already exists",
      });
    }

    /**Hash password */
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    /**Creating JWT token */
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    /**Token save on Cookies */
    res.cookie("token", token, cookieOptions);
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password, username } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Credentials required",
      });
    }
    const userEmail = Array.isArray(email) ? email[0] : email;
    const userPassword = Array.isArray(password) ? password[0] : password;

    /**Find user */
    const user = await userModel
      .findOne({
        $or: [{ email: userEmail }, { username }],
      })
      .select("+password");

    /**Checking-2 User */
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Block
    if (user.provider === "google") {
      return res.status(400).json({
        message: "Please login using google",
      });
    }
    /**Checking-1 Password */
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getMe(req, res) {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    message: "User details fetched successfully",
    user,
  });
}

async function logoutUser(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "Token missing",
      });
    }

    // decode token to get expiration time
    const decoded = jwt.decode(token);
    const expiry = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1);

    //Store in redis
    await redisClient.set(token, "blacklisted", { EX: expiry });
    res.clearCookie("token", cookieOptions);

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function googleAuth(req, res) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Google token is required",
      });
    }

    //Verify Google token
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        message: "Failed to retrieve id_token from Google",
      });
    }
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not found",
      });
    }

    //Check if user exists
    let user = await userModel.findOne({ email });

    //If user does not exists
    if (!user) {
      user = await userModel.create({
        username: name,
        email,
        provider: "google",
        googleId: sub,
        picture,
      });
    }

    // JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
}

module.exports = { registerUser, loginUser, getMe, logoutUser, googleAuth };
