const valid = {
  // checkRequired
  checkRequired: (value) => {
    let returnVal = true;

    if (value == null || value == undefined || value === '') {
      returnVal = false;
    }

    return returnVal;
  },
  checkRequired_msg: '此欄位為必填',
  // check auth account
  checkAuthAccount: (value) => {
    let returnVal = true;
    let validReg = /^[a-zA-Z\d]{1,}$/;

    if (value != '' && !validReg.test(value)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkAuthAccount_msg: '帳號僅能英文字母或數字',
  // check auth password
  checkAuthPassword: (value) => {
    let returnVal = true;
    let engReg = /[a-zA-Z]/;
    let numReg = /[0-9]/;

    if (value != '' && (!engReg.test(value) || !numReg.test(value) || value.length < 6)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkAuthPassword_msg: '密碼至少 6 個字元，且至少包含一個字母與一個數字',

  // check email reg
  checkEmail: (value) => {
    let returnVal = true;
    let validReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (value && !validReg.test(value.trim())) {
      returnVal = false;
    }

    return returnVal;
  },
  checkEmail_msg: '請輸入正確的 Email 格式',
  // check not chinese
  checkNotChinese: (value) => {
    let returnVal = true;
    let validReg = /^[^\u4E00-\u9FFF]{0,}$/;

    if (value && !validReg.test(value)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkNotChinese_msg: '不可輸入中文',
  // checkDateRequired
  checkDateRequired: (value) => {
    if (value && typeof (value) == 'object') {
      return true;
    }
    return false;
  },
  checkDateRequired_msg: '此欄位為必填',
  checkPostiveNumberAndZero: (value) => {
    let returnVal = true;
    let validReg = /^[0-9.]{1,}$/;

    if (value != null && value !== '' && !validReg.test(value)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkPostiveNumberAndZero_msg: '僅能為 0 或正數',
  checkPostiveNumber: (value) => {
    let returnVal = true;
    let validReg = /^[0-9.]{1,}$/;

    if (value != null && value !== '' && (!validReg.test(value) || parseFloat(value, 10) <= 0)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkPostiveNumber_msg: '僅能為正數',
  checkPostiveInt: (value) => {
    let returnVal = true;
    let validReg = /^[0-9]{1,}$/;

    if (value != null && value !== '' && (!validReg.test(value) || parseFloat(value, 10) <= 0)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkPostiveInt_msg: '僅能為正整數',
  checkPostiveIntAndZero: (value) => {
    let returnVal = true;
    let validReg = /^[0-9]{1,}$/;

    if (value != null && value !== '' && (!validReg.test(value) || parseFloat(value, 10) < 0)) {
      returnVal = false;
    }

    return returnVal;
  },
  checkPostiveIntAndZero_msg: '僅能為 0 或正整數',
};

export default valid;