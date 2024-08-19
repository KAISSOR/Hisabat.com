const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Income = require('../../models/income')
const Company = require('../../models/companies')
const authCompany = require("../../middleware/authCompany")

router.post("/add-income" , authCompany , async (req, res) => {
    try {
        const JWT = process.env.JWTPRIVATEKEY ;
        const title = req.body.title
        const amount = req.body.amount
        const category = req.body.category
        const description = req.body.description
        const Token = req.header('auth-company');
        const CoCodee = jwt.verify(Token, JWT);
        const CoCode = CoCodee.code
        const company = await Company.findOne({CoCode});  
        console.log(Token)
        console.log(CoCodee)
        console.log(company)

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

        const newIncome = new Income({
            title: title,
            amount: amount,
            type: "income",
            category: category,
            description: description,
            CoCode: CoCode,
          });

          await newIncome.save();
          res.status(200).json(newIncome);

    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Server Error'})
    }
});

router.get("/get-income" , authCompany , async (req, res) => {
    try {
        const JWT = process.env.JWTPRIVATEKEY ;
        const Token = req.header('auth-company');
        const CoCodee = jwt.verify(Token, JWT);
        const CoCode = CoCodee.code
        const incomes = await Income.find({CoCode})

        res.status(200).json(incomes)

    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Server Error'})
    }
});

router.delete("/delete-income/:id" , authCompany , async (req, res) => {
    try {
        const { id } = req.params; 
        const deletedIncome = await Income.findByIdAndDelete(id); 

        if (!deletedIncome) {
            return res.status(404).json({ message: "Income not found" });
        };

        res.status(200).json({ message: "Income deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
});

router.delete("/delete-all-incomes", authCompany, async (req, res) => {
    try {
        const JWT = process.env.JWTPRIVATEKEY ;
        const Token = req.header('auth-company');
        const CoCodee = jwt.verify(Token, JWT);
        const CoCode = CoCodee.code;
    
        await Income.deleteMany({ CoCode });
    
        res.status(200).json({ message: 'All incomes deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
  
module.exports = router;
