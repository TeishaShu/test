const getListData = {
  'data': {
    'total_items': 1,
    'data_list': [
      {
        'id': '1',
        'account': 'bill',
        'role': '3',
        'permission_role': '2',
        'user_name': 'edit name 2',
        'email': 'billyen@omusic.com.tw',
        'phone': '093564789',
        'is_frozen': '0',
        'eid': '1',
        'enterprise_name': '相信音樂',
      },
      {
        'id': '2',
        'account': 'bill2',
        'role': '4',
        'permission_role': '2',
        'user_name': 'edit name 2',
        'email': 'billyen@omusic.com.tw',
        'phone': '093564789',
        'is_frozen': '1',
        'eid': '1',
        'enterprise_name': '相信音樂',
      },
    ],
  },
  'execution_time': '0.1545',
  'memory_usage': '3.26MB',
  'status_code': '00000000',
  'params': {
    'keyword': 'll',
    'type': 'email',
    'precise': 0,
    'page_current': 1,
    'page_size': 20,
  },
};

const freezeActionData = {
  'data': '凍結 帳號成功',
  'execution_time': '0.1178',
  'memory_usage': '3.26MB',
  'status_code': '00000000',
  'params': {
    'id': 1,
    'is_frozen': 1,
  },
};

const getInfoData = {
  'data': {
    'id': '1',
    'account': 'bill',
    'permission_role': '2',
    'user_name': 'edit name 2',
    'email': 'billyen@omusic.com.tw',
    'phone': '064789',
    'valid_status': '1',
    'is_frozen': '0',
    'eid': '1',
    'enterprise_name': '相信音樂國際股份有限公司',
    'created_at': '2020/10/09', // TODO 需請bill補此欄位 加入時間
  },
  'execution_time': '0.0982',
  'memory_usage': '3.25MB',
  'status_code': '00000000',
  'params': {
    'id': '1',
  },
};

const timeout = 1000;

function getList(req, res) {
  setTimeout(() => {
    return res.json(getListData);
  }, timeout);
}

function freezeAction(req, res) {
  setTimeout(() => {
    return res.json(freezeActionData);
  }, timeout);
}

function getInfo(req, res) {
  setTimeout(() => {
    return res.json(getInfoData);
  }, timeout);
}

function editEnterprise(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '更新成功',
      'execution_time': '0.1078',
      'memory_usage': '3.26MB',
      'status_code': '00000000',
      'params': {
        'id': 1,
        'email': 'billyen@omusic.com.tw',
        'user_name': 'edit name 2',
        'phone': '064789',
        'permission_role': 2,
      },
    });
  }, timeout);
}

function deleteEnterprise(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '刪除企業帳號成功。',
      'execution_time': '0.1066',
      'memory_usage': '3.25MB',
      'status_code': '00000000',
      'params': {
        'id': 1,
      },
    });
  }, timeout);
}

function checkAccount(req, res) {
  setTimeout(() => {
    return res.json({
      "data": false,
      "execution_time": "0.4008",
      "memory_usage": "3.28MB",
      "status_code": "00000000",
      "params": {
        "account": "bill"
      }
    });
  }, timeout);
}

function checkEmail(req, res) {
  setTimeout(() => {
    return res.json({
      "data": false,
    });
  }, timeout);
}

function addEnterpriseAccount(req, res) {
  setTimeout(() => {
    return res.json({
      "data": "27",
    });
  }, timeout);
}


export default {
  'post     /auth/user/list_enterprise_account': getList,
  'post     /auth/user/freeze_enterprise_account_by_id': freezeAction,
  'get      /auth/user/view_enterprise_account': getInfo,
  'patch    /auth/user/edit_enterprise_account_by_id': editEnterprise,
  'post     /auth/user/delete_enterprise_account_by_id': deleteEnterprise,
  'get      /auth/user/check_account_repeat': checkAccount,
  'post     /auth/user/check_email_repeat': checkEmail,
  'put      /auth/user/add_enterprise_account': addEnterpriseAccount,
};
