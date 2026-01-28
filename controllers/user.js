// const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helpers.js/helpers");
const { sendConfirmationEmail, sendRemindersEmail } = require("../lib/sendConfirmationEmail");

const UserController = {

  create: async (req, res) => {
    try {
      const { name, email, password, phone, address, role } = req.body;


      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "This email already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create user
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role
      });

      try {
        await sendConfirmationEmail({
          email: email,
          name: name,
          subject: `Welcome ${name}! Your Account Is Ready`
        });
      } catch (emailErr) {
        console.error("Email failed to send:", emailErr);
      }


      res.status(201).json({
        message: "User registered successfully. Confirmation email sent!",
        user
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  update: async (req, res) => {
    try {
      const { _id, name, email, password, phone, address, role } = req.body;
      // update user
      const user = await UserModel.update({
        _id,
        name,
        email,
        password,
        phone,
        address,
        role
      });

      res.status(201).json({
        message: "User updated successfully",
        user
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {

    try {

      const { page, size } = req.query

      const users = await UserModel.findAll({
        page, size
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const user = await UserModel.deleteById(req.params.id);
      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }
      return res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // 1️⃣ Check if user exists
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "User not exist!" });
      }

      // 2️⃣ Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      // const isMatch = password === user.password
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password!" });
      }

      // 3️⃣ Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },


  getFilters: async (req, res) => {
    try {
      const { col, row } = req.query; // ✅ FIX

      if (!col || !row) {
        return res.status(400).json({ error: 'col and row are required' });
      }

      const users = await UserModel.findFilterRecords({ col, row });

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  sendEmail: async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
     
      const data = await sendRemindersEmail({
        email: user?.email,
        name: user?.name,
        subject: "Payment Reminder",
        remainingAmount: amount
      });

       res.status(200).json({
        message: "Email send successfully!",
        data
      });
    } catch (emailErr) {
      console.error("Email failed to send:", emailErr);
    }
  }
};

module.exports = UserController;
