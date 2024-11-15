const getListData = {
  'data': {
    'total_items': 2,
    'data_list': [
      {
        'id': '1',
        'tax_id_number': '28464395',
        'name': '相信音樂國際股份有限公司',
        'name_zh': '相信音樂國際股份有限公司',
        'name_en': 'B`IN Music International Limited',
        'admin': null,
        'zip_code': null,
        'address_zh': null,
        'phone': null,
        'fax': null,
        'email': null,
        'website': null,
        'created_by': 'SYSTEM',
        'created_at': '2020-10-08 16:23:28',
        'updated_by': null,
        'updated_at': '0000-00-00 00:00:00',
      },
      {
        'id': '2',
        'tax_id_number': '24765244',
        'name': '相知音樂國際股份有限公司',
        'name_zh': '相知音樂國際股份有限公司',
        'name_en': 'BETWEEN CO.LTD',
        'admin': null,
        'zip_code': null,
        'address_zh': null,
        'phone': null,
        'fax': null,
        'email': null,
        'website': null,
        'created_by': 'SYSTEM',
        'created_at': '2020-10-08 16:23:28',
        'updated_by': null,
        'updated_at': '0000-00-00 00:00:00',
      },
    ],
  },
};

const getInfoData = {
  'data': {
    'id': '1',
    'tax_id_number': '28464395',
    'name': '相信音樂國際股份有限公司',
    'name_zh': '相信音樂國際股份有限公司',
    'name_en': 'B`IN Music International Limited',
    'admin': '相信人',
    'zip_code': '105',
    'address_zh': '臺北市松山區光復南路33巷12號2樓、6樓、7樓',
    'phone': '02-27689328',
    'fax': '02-27689328',
    'email': 'test@bin-music.com.tw',
    'website': 'https://www.bin-music.com.tw/',
    'created_by': 'SYSTEM',
    'created_at': '2020-10-10 10:10:10',
    'updated_by': null,
    'updated_at': '2020-11-11 11:11:11',
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

function addEnterprise(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '1',
    });
  }, timeout);
}

function editEnterprise(req, res) {
  if (req.body.id) {
    setTimeout(() => {
      return res.json({
        'data': '更新企業資料成功',
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
}

function deleteEnterprise(req, res) {
  setTimeout(() => {
    return res.json({
      'data': '刪除企業資料成功',
      'execution_time': '0.1066',
      'memory_usage': '3.25MB',
      'status_code': '00000000',
      'params': {
        'id': 1,
      },
    });
  }, timeout);
}

export default {
  'POST     /enterprise/list': getList,
  'GET      /enterprise/view': getInfo,
  'PUT      /enterprise/add': addEnterprise,
  'PATCH    /enterprise/edit': editEnterprise,
  'POST     /enterprise/delete': deleteEnterprise,
};
