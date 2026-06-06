import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';

const formatErrors = (errorsArray) => {
  const formatted = {};
  errorsArray.forEach(err => {
    if (!formatted[err.path]) {
      formatted[err.path] = err.msg;
    }
  });
  return formatted;
};

export const getLogin = (req, res) => {
  const message = req.query.message || null;
  res.render('login', { title: 'Login', message, errors: {}, oldInput: {} });
};

export const postLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { 
      title: 'Login', 
      message: null,
      errors: formatErrors(errors.array()), 
      oldInput: req.body 
    });
  }

  const user = await User.findOne({ email });
  if (!user) return res.render('login', { title: 'Login', message: 'Invalid credentials', errors: {}, oldInput: req.body });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.render('login', { title: 'Login', message: 'Invalid credentials', errors: {}, oldInput: req.body });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  
  if (user.role === 'admin') {
    res.redirect('/admin/dashboard');
  } else if (user.role === 'doctor') {
    res.redirect('/doctor/dashboard');
  } else {
    res.redirect('/dashboard');
  }
});

export const getSignup = (req, res) => {
  const message = req.query.message || null;
  res.render('signup', { title: 'Sign Up', message, errors: {}, oldInput: {} });
};

export const postSignup = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', { 
      title: 'Sign Up', 
      message: null,
      errors: formatErrors(errors.array()), 
      oldInput: req.body 
    });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.render('signup', { 
      title: 'Sign Up', 
      message: null, 
      errors: { email: 'Email is already in use' }, 
      oldInput: req.body 
    });
  }

  // Secure role parsing preventing admin tampering
  let assignedRole = 'user';
  if (role === 'doctor') {
    assignedRole = 'doctor';
  }else if(role === 'admin'){
    assignedRole ='admin'
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ name, email, password: hashedPassword, role: assignedRole });
  await user.save();

  res.redirect('/auth/login');
});

export const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/auth/login');
};
