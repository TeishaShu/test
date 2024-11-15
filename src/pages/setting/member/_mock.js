const getListData = {
  'data': {
    'total_items': 2,
    'data_list': [{
      'id': '1',
      'account': 'bill',
      'role_id': '1',
      'role_name': '\u4f01\u696d\u4e3b\u5e33\u865f',
      'user_name': 'check er nam',
      'email': 'billyen@ic.com.tw',
      'is_frozen': '0',
      'is_agent': '1',
      'eid': '1',
      'enterprise_name': '\u76f8\u4fe1\u97f3\u6a02',
    }, {
      'id': '21',
      'account': 'testadd',
      'role_id': '1',
      'role_name': '\u4f01\u696d\u4e3b\u5e33\u865f',
      'user_name': 'user_',
      'email': 'billyen@omusic.com.t',
      'is_frozen': '0',
      'is_agent': '0',
      'eid': '1',
      'enterprise_name': '\u76f8\u4fe1\u97f3\u6a02',
    }],
  },
};

const getInfoData = {
  'data': {
    'id': '1',
    'account': 'bill',
    'role_id': '1',
    'user_name': 'check er nam',
    'email': 'billyen@ic.com.tw',
    'phone': '78',
    'valid_status': '1',
    'is_frozen': '0',
    'is_agent': '1',
    'eid': '1',
    'created_at': '2020-12-12 12:12:12',
  },
  'execution_time': '0.0826',
  'memory_usage': '3.31MB',
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

function getInfo(req, res) {
  setTimeout(() => {
    return res.json(getInfoData);
  }, timeout);
}

function freezeMember(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '凍結 帳號成功',
      'execution_time': '0.3051',
      'memory_usage': '3.26MB',
      'status_code': '00000000',
      'params': {
        'id': 1,
        'is_frozen': 1,
      },
    });
  }, timeout);
}

function deleteMember(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '刪除帳號成功。',
      'execution_time': '0.2275',
      'memory_usage': '3.25MB',
      'status_code': '00000000',
      'params': {
        'id': 1,
      },
    });
  }, timeout);
}

function updateMember(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '更新成功',
      'execution_time': '0.1384',
      'memory_usage': '3.26MB',
      'status_code': '00000000',
      'params': {
        'id': 1,
        'email': 'billyen@omusic.com.tw',
        'user_name': 'edit name 2',
        'phone': '093564789',
        'permission_role': 2,
      },
    });
  }, timeout);
}

function setAgent(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '設定代理人成功!',
      'execution_time': '0.0696',
      'memory_usage': '3.31MB',
      'status_code': '00000000',
      'params': {
        'agent_id': 1,
      },
    });
  }, timeout);
}

function addMember(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '1',
      'execution_time': '0.3581',
      'memory_usage': '3.85MB',
      'status_code': '00000000',
      'params': {
        'account': 'testadd',
        'password': 'testadd1',
        'user_name': 'user_',
        'phone': '09342318',
        'email': 'billyen@omusic.com.tw',
        'role_id': 1,
      },
    });
  }, timeout);
}

function getRole(req, res) {
  setTimeout(() => {
    return res.json({
      'data': [
        {
          'id': '1',
          'name': '企業主帳號',
          'description': '企業主帳號',
        },
        {
          'id': '2',
          'name': '訪客',
          'description': '訪客',
        },
        {
          'id': '3',
          'name': '版權人員',
          'description': '版權人員',
        },
        {
          'id': '4',
          'name': '管理員',
          'description': '管理員',
        },
        {
          'id': '5',
          'name': '(自定義)',
          'description': '(自定義)',
        },
      ],
      'execution_time': '0.6466',
      'memory_usage': '3.13MB',
      'status_code': '00000000',
      'params': [],
    });
  }, timeout);
}

export default {
  'post   /auth/user/list_enterprise_member': getList,
  'get    /auth/user/view_enterprise_member': getInfo,
  'patch  /auth/user/freeze_entperprise_member_by_id': freezeMember,
  'post   /auth/user/delete_enterprise_member_by_id': deleteMember,
  'patch  /auth/user/edit_enterprise_member': updateMember,
  'patch  /auth/user/set_agent': setAgent,
  'put    /auth/user/add_enterprise_member': addMember,
  'get   /auth/role/list_all': getRole,
};
