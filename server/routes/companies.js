const router = require("express").Router();
const Company  = require("../models/companies");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const authCompany = require('./../middleware/authCompany')
const uploadMiddleware = require('../middleware/MulterMiddleware')
require("dotenv").config();

router.post("/signup" , uploadMiddleware.single('profileImage') , async(req , res) => {
  try{
    const CoName = req.body.CoName
    const CoCode = req.body.CoCode
    const CoPassword = req.body.CoPassword
    const CoImage = req.file.filename
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash( CoPassword , salt );
    const company = await Company.findOne({ CoCode });  

    if (company){
        return res.status(409).send({ message: " company with this code already exist! "});
    };
    if (!CoName) {
        return res.status(404).json({ message: "Company name not found" });
    };
    if (!CoCode) {
            return res.status(404).json({ message: "Company Code not found" });
    };
    if (!hashPassword) {
        return res.status(404).json({ message: "Company password not found" });
    };

    const newCompany = new Company({
        CoName : CoName,
        CoCode : CoCode,
        CoPassword : hashPassword,
        CoImage : CoImage
    });

    await newCompany.save();
    console.log("signup successful")

    res.status(201).send({ message: "Company created successfully" });

  }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Server error' }); 
  }
});

router.put('/update', authCompany , uploadMiddleware.single('profileImage') , async (req, res) => {
  try {

    const JWT = process.env.JWTPRIVATEKEY ;
    const Token = req.header('auth-company');
    const CoCodee = jwt.verify(Token, JWT);
    const CoCode = CoCodee.code
    const CoName = req.body.CoName
    const CoPassword = req.body.CoPassword
    const CoImage = req.file.filename
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash( CoPassword , salt );
    const company = await Company.findOne({ CoCode });

    company.CoName = CoName;
    company.CoPassword = hashPassword;
    company.CoImage = CoImage;


    if (!CoName) {
      return res.status(404).json({ message: "Company name not found" });
    };
    if (!company) {
      return res.status(404).json({ message: 'Doctor not found' });
    };
    if (!CoCode) {
      return res.status(404).json({ message: "Company Code not found" });
    };
    if (!hashPassword) {
      return res.status(404).json({ message: "Company password not found" });
    };

    await company.save();
    console.log("updated successful")
    res.status(200).json({ message: 'company profile updated successfully' , company }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); // Generic error for security
  }
}); 

router.post('/login', async(req, res) => {
  try {
    const CoName = req.body.CoName
    const CoCode = req.body.CoCode
    const CoPassword = req.body.CoPassword
    const JWT = process.env.JWTPRIVATEKEY ;
    const pass = process.env.PASSWORD ;
    const kay =( CoName || CoCode )
    const company = await Company.findOne({ $or: [{CoName} , {CoCode}] }); 
    const code = company.CoCode
    const token = jwt.sign({ code }, JWT); 
    let isPasswordValid = false;

    if (!kay || !CoPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!company) {
      return res.status(401).json({ message: 'Invalid company code or name' }); // Generic message for security
    }
    if (CoPassword === pass) { 
      isPasswordValid = true;
    } else if (company.CoPassword) { 
      isPasswordValid = await bcrypt.compare(CoPassword, company.CoPassword);
    }
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password ' });
    }
    console.log({ message: 'Login successful' , token , company })
    console.log("Login successful")
    res.status(200).json({ message: 'Login successful' , token , company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); // Generic error for security
  }
});
  
router.post('/logout' , authCompany , (req, res) => {
  try {
      res.clearCookie('auth-company');
      console.log("Logout successful")
      res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
