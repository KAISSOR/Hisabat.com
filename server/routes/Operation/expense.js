const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../../models/expense')
const Company = require('../../models/companies')
const authCompany = require("../../middleware/authCompany")

router.post("/add-expense" , authCompany , async (req, res) => {
    try {
        const title = req.body.title
        const amount = req.body.amount
        const category = req.body.category
        const description = req.body.description
        const JWT = process.env.JWTPRIVATEKEY ;
        const Token = req.header('auth-company');
        const CoCodee = jwt.verify(Token, JWT);
        const CoCode = CoCodee.code
        const company = await Company.findOne({CoCode});  

        if (!title) {
            return res.status(404).json({ message: "title not found" });
        };
        if (!amount) {
            return res.status(404).json({ message: "amount not found" });
        };
        if (!category) {
            return res.status(404).json({ message: "category not found" });
        };
        if (!description) {
            return res.status(404).json({ message: "description not found" });
        };
        if (!Token) {
            return res.status(404).json({ message: "Token not found" });
        };
        if (!CoCode) {
            return res.status(404).json({ message: "CoCode not found" });
        };
        if (!company) {
            return res.status(404).json({ message: "company not found" });
        };

        const newExpense = new Expense({
            title: title,
            amount: amount,
            type: "expense",
            category: category,
            description: description,
            CoCode: CoCode,
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Server Error'})
    }
});

router.get("/get-expense" , authCompany , async (req, res) => {
    try {
        const JWT = process.env.JWTPRIVATEKEY ;
        const Token = req.header('auth-company');
        const CoCodee = jwt.verify(Token, JWT);
        const CoCode = CoCodee.code
        const expenses = await Expense.find({CoCode})

        res.status(200).json(expenses)

    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Server Error'})
    }
});

router.delete("/delete-expense/:id", authCompany, async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedExpense = await Expense.findByIdAndDelete(id); 

        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        };

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
});

router.delete("/delete-all-expenses", authCompany, async (req, res) => {
    try {
        const JWT = process.env.JWTPRIVATEKEY ;
        const Token = req.header('auth-company');
        const CoCodee = jwt.verify(Token, JWT);
        const CoCode = CoCodee.code;
    
        const result = await Expense.deleteMany({ CoCode });
    
        res.status(200).json({ message: "All expenses deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
  

module.exports = router;
