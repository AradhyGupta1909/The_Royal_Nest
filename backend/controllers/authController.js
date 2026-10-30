 const User = require("../models/User");
    const jwt = require("jsonwebtoken");
    const generateToken = (id)=>{
        return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    };

    exports.register = async (req, res) =>{
        try{
            const {name, email, password, role, adminKey} = req.body;
            const existing = await User.findOne({email});
            if(existing){
                return res.status(400).json({message:"Email already registered"});
            }
            const userRole = (role === admin && adminKey === process.env.ADMIN_SERCRET)? "admin" : "user";
            const user = await User.create({
                name, email, password, role: userRole, isVerified: true
            });
            const token = generateToken(user._id);
            res.status(201).json({
                token, 
                user: { 
             _id: user._id, 
              name: user.name, 
             email: user.email, 
             role: user.role, 
              avatar: user.avatar 
            } 
            });
        }
        catch(error){
            res.status(500).json({message:error.message});
        }
    };

    exports.login = async (req, res) =>{
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email}).select("+password");
            if(!user || !user.password){
                return res.status(401).json({message: "Invalid credentials"});
            }
            const isMatch = await user.comparePassword(password);
            if(!isMatch){
                return res.status(401).json({message: "Invalid credentials"});  
            }
            const token = generateToken(user._id);
            res.json({
                token, 
                user: { 
                    _id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    avatar: user.avatar 
                }
            });
        }
        catch(err){
            res.status(500).json({message: err.message});
        }
    }

    exports.getMe = async (req, res) => {
  res.json({ 
    user: { 
      _id: req.user._id, 
      name: req.user.name, 
      email: req.user.email, 
      role: req.user.role, 
      avatar: req.user.avatar 
    } 
  });
};

exports.googleSuccess = (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(
    `${process.env.CLIENT_URL}/auth/google/callback?token=${token}&role=${req.user.role}`
  );
};
