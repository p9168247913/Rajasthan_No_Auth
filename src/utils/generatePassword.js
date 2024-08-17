/* eslint-disable no-plusplus */
function generatePassword(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#';
  const charactersLength = characters.length;

  const hasLetterAndNumber = (str) => /\d/.test(str) && /[a-zA-Z]/.test(str);

  do {
    result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  } while (!hasLetterAndNumber(result));

  return result;
}

module.exports.generatePassword = generatePassword;