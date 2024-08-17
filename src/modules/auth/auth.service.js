const httpStatus = require('http-status');
const tokenService = require('./token.service');
const Token = require('./token.model');
const User = require('../user/user.model');
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { adminRoles } = require('../../config/roles');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const signup = async (userBody, res) => {
	const user = await User.create(userBody);
	return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  let user = await User.findOne({ email, active: true });
  if (!user || !(await user.isPasswordMatch(password))) {
    // throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    return {user:null,msg:'Incorrect email or password'} 
  }
  return {user};
};



/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

const register = async (userBody) => {
  try{
    const user = await User.create({...userBody});
    if(user){
      return {data:user,status:true,code:200};
    }else{
      return {data:{},status:false,code:400}
    }

  }catch(e){
    return {data:e.message,status:false,code:400}
  }
};

const updateProfile = async (userBody,userId) => {
  
  try{

    const user = await User.findOneAndUpdate({_id:new mongoose.Types.ObjectId(userId),active:true},{...userBody},{new:true});
    if(user){
      return {data:user,status:true,code:200};
    }else{
      return {data:"User not found.",status:false,code:400}
    }

  }catch(e){
    return {data:e.message,status:false,code:400}
  }
};

 

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

//Check email if is already taken
const checkEmail = async (email) => {
  return await User.findOne({ email: email });
};

const resetPassword = async  ( id,newPassword,previousPassword ) => {
    const user = await User.findOne({_id: new mongoose.Types.ObjectId(id),active:true});
    if(!user){
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
if(!(await user.isPasswordMatch(previousPassword))){
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect previous password');
}else{
  await User.findOneAndUpdate({_id:new mongoose.Types.ObjectId(id)},{password: newPassword});
  return {data:'Password updated successfully', status:true,code:200}
}
};
/**
 * getCurrentUser
 * @param {string} token
 * @returns {Promise}
 */
const getCurrentUser = async (id) => {
  try {
 
    const userData = await User.findOne({ _id: new mongoose.Types.ObjectId(id), active: true });
    return { userData, status: true, statusCode: 200 };
  } catch (error) {
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'getCurrentUser failed');
    return { userData: null, profileData: null, isError: 'getCurrentUser failed', status: false, statusCode: 500 }
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  getCurrentUser,
  checkEmail,
  signup,
  register,
  updateProfile,
  resetPassword
};
