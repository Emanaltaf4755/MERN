const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhander");
const sendEmail = require("../utils/sendEmail");

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a simple id",
            url: "profilepicurl",
        },
    });

    const token = user.getJWTToken();

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
        success: true,
        user: userData,
        token,
    });
});

// Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check email and password
    if (!email || !password) {
        return next(
            new ErrorHandler("Please enter email and password", 400)
        );
    }

    // Find user and include hidden password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(
            new ErrorHandler("Invalid email or password", 401)
        );
    }

    // Compare entered password with hashed password
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(
            new ErrorHandler("Invalid email or password", 401)
        );
    }

    // Generate JWT token
    const token = user.getJWTToken();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
        success: true,
        user: userData,
        token,
    });
   
});
// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
res.cookie("token", null, {
expires: new Date(Date.now()),
httpOnly: true,
});

res.status(200).json({
    success: true,
    message: "Logged Out",
});

});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new ErrorHandler("User not found with this email", 404)
        );
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create password reset URL
    const resetPasswordUrl =
        `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset link is:\n\n${resetPasswordUrl}\n\nThis link will expire in 15 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
        new ErrorHandler("Email could not be sent", 500)
    );
}
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // 1. Hash the token received from the URL
    const resetPasswordToken = require("crypto")
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // 2. Find user with matching token that has not expired
    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler("Reset password token is invalid or has expired", 400)
        );
    }

    // 3. Check whether both passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("Password and confirm password do not match", 400)
        );
    }

    // 4. Set the new password
    user.password = req.body.password;

    // 5. Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 6. Save the updated user
    await user.save();

    // 7. Generate a new JWT and log in the user
    const token = user.getJWTToken();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
        token,
    });
});



//get user details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    // Check new password and confirm password
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("New password and confirm password do not match", 400)
        );
    }

    // Update password
    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});






exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            name,
            email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// Get all users (Admin only)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
});


// Get single user (Admin only)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});