const Quiz_QuestionsModel = require("../models/quiz_questions");


const Quiz_QuestionsController = {

    create: async (req, res) => {
        try {
            const { question, answers } = req.body;
            const quest = await Quiz_QuestionsModel.create({
                question, answers
            });



            res.status(201).json({
                message: "Question added successfully!",
                quest
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    update: async (req, res) => {
        try {
            
            const { _id, question, answers } = req.body;
            const quest = await Quiz_QuestionsModel.update({
                _id, question, answers
            });

            res.status(201).json({
                message: "Question updated successfully",
                quest
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const quiz = await Quiz_QuestionsModel.findAll();
            res.status(200).json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const question = await Quiz_QuestionsModel.findById(req.params.id);
            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }
            res.json(question);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const question = await Quiz_QuestionsModel.deleteById(req.params.id);
            if (!question) {
                return res.status(400).json({ message: "Question not found!" });
            }
            return res.status(200).json({ message: "Question deleted successfully!" });
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
            const user = await Quiz_QuestionsModel.findByEmail(email);
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

};

module.exports = Quiz_QuestionsController;
