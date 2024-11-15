let account = 'admin1';  // 'admin1' or 'test123'

function login(req, res) {
  account = req.body.account;

  if (account == 'admin1' || account == 'test123') {
    setTimeout(() => {
      res.cookie('ci_session', 'testui');
      return res.status(204).json();
    }, 1000);
  } else {
    setTimeout(() => {
      res.cookie('ci_session', '');
      return res.status(401).json({ message: '帳號或密碼錯誤' });
    }, 1000);
  }
}

function forgotPassword(req, res) {
  setTimeout(() => {
    return res.status(204).json();
    // return res.status(401).json();
  }, 1000);
}

function changePassword(req, res) {
  return res.status(200).json({});
}

function getUserData(req, res) {
  const userData = {
    "data": {
      "id": "2",
      "account": "test123",
      "platform_id": "2",
      "type": "3",
      "role_id": "1",
      "user_name": "pennychen",
      "email": "pennychen@omusic.com.tw",
      "phone": "0912345678",
      "valid_status": "1",
      "is_frozen": "0",
      "eid": "1",
      "enterprise_name": "相信音樂"
    }
  };

  if (account == 'admin1') {
    userData.data.platform_id = '1';
    userData.data.type = '2';
  } else {
    userData.data.platform_id = '2';
    userData.data.type = '3';
  }

  setTimeout(() => {
    return res.json(userData);
    // return res.status(401).json({});
  });
}

function getDisplayUserById(req, res) {
  let returnVal = {
    "data": {
      "account": "test123",
      "user_name": "pennychen"
    }
  };

  return res.json(returnVal);
}

function editPersonalAccount(req, res) {
  return res.json({});
}

export default {
  'post   /auth/user/login': login,
  'post   /auth/user/forgot_password': forgotPassword,
  'patch  /auth/user/change_password': changePassword,
  'get    /auth/User/get_user_data': getUserData,
  'get    /auth/User/get_display_name_by_id': getDisplayUserById,
  'patch  /auth/user/edit_peronsal_account': editPersonalAccount,
}