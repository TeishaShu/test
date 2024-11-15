import { rearg } from "lodash";

const getCompanyAutoData = {
  "data": [
    {
      "id": "1",
      "company_id": "1",
      "nickname": "zxcv",
      "company_code": "c0000001",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "2",
      "company_id": "1",
      "nickname": "dfsfdsfdsf",
      "company_code": "c0000001",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "3",
      "company_id": "1",
      "nickname": "ccfdsfdsf",
      "company_code": "c0000001",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "4",
      "company_id": "1",
      "nickname": "test",
      "company_code": "c0000001",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "5",
      "company_id": "1",
      "nickname": "test2",
      "company_code": "c0000001",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "166",
      "company_id": "5",
      "nickname": "Chloe",
      "company_code": "c0000003",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "167",
      "company_id": "5",
      "nickname": "ccc",
      "company_code": "c0000003",
      "tax_id_number": null,
      "is_internal": "0"
    },
    {
      "id": "168",
      "company_id": "10",
      "nickname": "Chloe",
      "company_code": "c0000006",
      "tax_id_number": "1234567890",
      "is_internal": "1"
    },
    {
      "id": "169",
      "company_id": "10",
      "nickname": "ccc",
      "company_code": "c0000006",
      "tax_id_number": "1234567890",
      "is_internal": "1"
    },
    {
      "id": "172",
      "company_id": "18",
      "nickname": "Chloe",
      "company_code": "c0000016",
      "tax_id_number": "123456780",
      "is_internal": "1"
    },
    {
      "id": "173",
      "company_id": "18",
      "nickname": "ccc",
      "company_code": "c0000016",
      "tax_id_number": "123456780",
      "is_internal": "1"
    },
    {
      "id": "174",
      "company_id": "28",
      "nickname": "Chloe",
      "company_code": "c0000019",
      "tax_id_number": "1234567800",
      "is_internal": "1"
    },
    {
      "id": "175",
      "company_id": "28",
      "nickname": "ccc",
      "company_code": "c0000019",
      "tax_id_number": "1234567800",
      "is_internal": "1"
    },
    {
      "id": "176",
      "company_id": "31",
      "nickname": "Chloe",
      "company_code": "c0000029",
      "tax_id_number": "1234567",
      "is_internal": "1"
    },
    {
      "id": "177",
      "company_id": "31",
      "nickname": "ccc",
      "company_code": "c0000029",
      "tax_id_number": "1234567",
      "is_internal": "1"
    },
    {
      "id": "178",
      "company_id": "32",
      "nickname": "Chloe",
      "company_code": "c0000032",
      "tax_id_number": "123456789",
      "is_internal": "1"
    },
    {
      "id": "179",
      "company_id": "32",
      "nickname": "ccc",
      "company_code": "c0000032",
      "tax_id_number": "123456789",
      "is_internal": "1"
    },
    {
      "id": "180",
      "company_id": "42",
      "nickname": "ccc",
      "company_code": "c0000033",
      "tax_id_number": "65465465",
      "is_internal": "1"
    },
    {
      "id": "181",
      "company_id": "43",
      "nickname": "ccc",
      "company_code": "c0000043",
      "tax_id_number": "65465",
      "is_internal": "1"
    },
    {
      "id": "182",
      "company_id": "43",
      "nickname": "asd",
      "company_code": "c0000043",
      "tax_id_number": "65465",
      "is_internal": "1"
    },
    {
      "id": "183",
      "company_id": "43",
      "nickname": "chloe",
      "company_code": "c0000043",
      "tax_id_number": "65465",
      "is_internal": "1"
    },
    {
      "id": "186",
      "company_id": "45",
      "nickname": "Chloelee",
      "company_code": "c0000044",
      "tax_id_number": "56+",
      "is_internal": "1"
    },
    {
      "id": "187",
      "company_id": "45",
      "nickname": "Henry",
      "company_code": "c0000044",
      "tax_id_number": "56+",
      "is_internal": "1"
    },
    {
      "id": "248",
      "company_id": "47",
      "nickname": "Chloelee",
      "company_code": "c0000047",
      "tax_id_number": "888",
      "is_internal": "1"
    },
    {
      "id": "249",
      "company_id": "47",
      "nickname": "Henry",
      "company_code": "c0000047",
      "tax_id_number": "888",
      "is_internal": "1"
    },
    {
      "id": "250",
      "company_id": "48",
      "nickname": "Chloelee",
      "company_code": "c0000000",
      "tax_id_number": "5665564",
      "is_internal": "1"
    },
    {
      "id": "251",
      "company_id": "48",
      "nickname": "Henry",
      "company_code": "c0000000",
      "tax_id_number": "5665564",
      "is_internal": "1"
    }
  ],
  "execution_time": "0.1241",
  "memory_usage": "3.07MB",
  "status_code": "00000000",
  "params": []
};

const companyDetailData = {
  data: {
    id: '12',
    created_by: '2',                            // 建立者
    created_at: '2002-10-22 12:30:00',          // 建立時間
    updated_by: '1',                            // 更新者
    updated_at: '0000-00-00 00:00:00',          // 最後修改
    type: ['1', '2'],                           // 公司類別：版權公司(1)、唱片公司(2)、新媒體公司(3)、製作公司(4)
    is_internal: '0',                           // 國外公司(0)、國內公司(1)
    company_code: 'abc123',                     // 編號 (UI 判斷：若 tax_id_number　為空值則顯示此)
    tax_id_number: '統編12345678',　　           // 編號 (統一編號)
    name: '麻吉娛樂經紀股份有限公司',             // 公司名稱
    name_zh: '麻吉娛樂經紀股份有限公司 (zh)',     // 公司名稱(中)
    name_en: '麻吉娛樂經紀股份有限公司 (en)',     // 公司名稱(英)
    admin: 'admin',                             // 負責人
    is_agent: '1',                              // 代理
    nickname: [                                 // 公司別名
      { id: '1', nickname: 'aa' },
      { id: '2', nickname: '麻吉娛樂經紀股份有限公司bbb' },
      { id: '3', nickname: 'test3' }
    ],
    payment_rate: '10',                         // 0, 5, 10, 20, -10, -20
    address_zh: 'address_zh',                   // 公司地址(中)
    address_en: 'address_en',                   // 公司地址(英)
    zip: 'zip',                                 // 郵遞區號
    tel: 'tel',                                 // 電話
    fax: 'fax',                                 // 傳真
    web: 'web',                                 // 網站
    email: 'email@gmail.com',                   // Email
    contact: [                                  // 聯絡人，最多 5 個
      {
        id: 'id1',                              // id                     
        name: 'name1',                          // 姓名
        job_title: 'job_title1',                // 職稱
        tel: 'tel1',                            // 電話
        ext: 'ext1',                            // 分機
        mobile: 'mobile1',                      // 手機
        email: 'email@gmail.com',               // Email
      },
      {
        id: 'id2',
        name: 'name2',
        job_title: 'job_title2',
        tel: 'tel2',
        ext: 'ext2',
        mobile: 'mobile2',
        email: 'email2@gmail.com',
      }
    ],
    notes: 'notes\ntest\ntesttest',              // 備註
  }
};

function getListData(count, page_current) {
  const list = [];
  const nickname = [
    [
      { id: '1', nickname: 'name' },
      { id: '2', nickname: 'nickname-2' },
      { id: '3', nickname: 'nickname-3' },
    ],
    [
      { id: '4', nickname: 'nickname-4' },
      { id: '5', nickname: 'name' },
      { id: '6', nickname: 'nickname-6' },
    ],
    [
      { id: '7', nickname: 'nickname-7' },
      { id: '8', nickname: 'nickname-8' },
      { id: '9', nickname: 'name' },
    ],
    [
      { id: '10', nickname: 'name' },
      { id: '11', nickname: 'nickname-11' },
      { id: '12', nickname: 'nickname-12' },
    ],
    [
      { id: '13', nickname: 'nickname-13' },
      { id: '14', nickname: 'name' },
      { id: '15', nickname: 'nickname-15' },
    ],
  ];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: (page_current == '1') ? `id-${i}` : `id-2-${i}`,
      company_code: (i % 2 === 0) ? ((page_current == '1') ? `company_code-1-${i}` : `company_code-2-${i}`) : '',
      tax_id_number: (i % 2 === 0) ? '' : ((page_current == '1') ? `tax_id_number-${i}` : `tax_id_number-2-${i}`),
      is_internal: (i % 2 === 0) ? '0' : '1',
      name: 'name',
      nickname: nickname[i % 5],
    });
  }

  return list;
}

function getNameAutoComplete(req, res) {
  let returnVal = {
    "data": [
      {
        "id": "1",
        "eid": "1",
        "company_code": "c0000001",
        "name": "相信音樂國際股份有限公司",
        "tax_id_number": null
      },
      {
        "id": "3",
        "eid": "1",
        "company_code": "c0000003",
        "name": "Chloe",
        "tax_id_number": null
      },
      {
        "id": "4",
        "eid": "1",
        "company_code": "c0000004",
        "name": "L’OZ PRODUCTION\r\n",
        "tax_id_number": "1234567890"
      },
      {
        "id": "6",
        "eid": "1",
        "company_code": "c0000006",
        "name": " L’OZ PRODUCTION",
        "tax_id_number": "123456780"
      },
      {
        "id": "7",
        "eid": "1",
        "company_code": "c0000007",
        "name": "Chloe",
        "tax_id_number": "1234567800"
      },
    ]
  };

  return res.json(returnVal);
}

function getCompanyAuto(req, res) {
  return res.json(getCompanyAutoData);
}

function getList(req, res) {
  const params = req.query;
  const count = params.count * 1 || 20;
  const result = getListData(count, params.page_current);

  let addGetResult = {
    data: {
      total_items: 40,
      data_list: result,
    }
  };

  return res.json(addGetResult);
}

function getCompanyDetail(req, res) {
  let info = {
    "data": {
      "id": "559",
      "eid": "1",
      "is_default": "0",
      "created_by": "",
      "created_at": "0000-00-00 00:00:00",
      "updated_by": null,
      "updated_at": "0000-00-00 00:00:00",
      "company_code": "c0000559",
      "tax_id_number": "24716618",
      "name": "酷瞧新媒體股份有限公司",
      "name_zh": "酷瞧新媒體股份有限公司",
      "name_en": "COTURE NEW MEDIA CO., LTD.",
      "admin": "劉柏園",
      "is_agent": "0",
      "is_internal": "1",
      "payment_rate": "5",
      "address_zh": "臺北市內湖區湖元里瑞湖街１１１號",
      "address_en": null,
      "zip": null,
      "tel": null,
      "fax": null,
      "web": null,
      "email": null,
      "notes": null,
      "nickname": [
        {
          "id": "628",
          "nickname": "酷瞧新媒體股份有限公司"
        }
      ],
      "contact": [
        {
          "id": "368",
          "name": "小蝸",
          "job_title": null,
          "tel": null,
          "ext": null,
          "mobile": null,
          "email": null
        }
      ],
      "type": [
        "5"
      ],
      "replace_settle": [
        {
          "id": "35",
          "type": "2",
          "author_id": "11",
          "author_name": "奧美廣告",
          "author_code": "test11111",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "88.000",
          "content": [
            {
              "id": "16",
              "contract_author_code": "CC-JJ-2013",
              "contract_author_id": "46"
            },
            {
              "id": "20",
              "contract_author_code": "test-aa",
              "contract_author_id": "40"
            },
            {
              "id": "23",
              "contract_author_code": "test-bb",
              "contract_author_id": "45"
            }
          ]
        },
        {
          "id": "36",
          "type": "1",
          "author_id": "25",
          "author_name": "Jascha Richter/Ashley Mulford",
          "author_code": "test02222",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "89.000",
          "content": []
        },
        {
          "id": "37",
          "type": "2",
          "author_id": "28",
          "author_name": "五月天",
          "author_code": "bacc00011",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "89.000",
          "content": [
            {
              "id": "17",
              "contract_author_code": "AA-TR-010",
              "contract_author_id": "47"
            }
          ]
        },
        {
          "id": "40",
          "type": "2",
          "author_id": "40",
          "author_name": "test",
          "author_code": "test10000",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "30.000",
          "content": []
        }
      ]
    },
    "execution_time": "0.2337",
    "memory_usage": "3.24MB",
    "status_code": "00000000",
    "params": {
      "id": "559"
    }
  }

  return res.json(info);
}

function addCompany(req, res) {
  let obj = {
    data: {
      id: '12'
    }
  };

  setTimeout(() => {
    return res.status(200).json(obj);
  }, 1000);
}

function removeCompany(req, res) {
  setTimeout(() => {
    return res.status(200).json({});
  }, 1000);
}

function updateCompany(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

function updateReplaceSettlement(req, res) {
  let info = {
    "data": "新增成功",
    "execution_time": "0.3233",
    "memory_usage": "3.17MB",
    "status_code": "00000000",
    "params": {
      "id": "559",
      "data": [
        {
          "id": "35",
          "type": "2",
          "author_id": "11",
          "author_name": "奧美廣告",
          "author_code": "bacc00011",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "88.000",
          "content": [
            {
              "id": "16",
              "contract_author_code": "CC-JJ-2013",
              "contract_author_id": "46"
            }
          ]
        },
        {
          "id": "36",
          "type": "1",
          "author_id": "25",
          "author_name": "Jascha Richter/Ashley Mulford",
          "author_code": "bacg00005",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "89.000",
          "content": [],
          "is_delete": 1
        },
        {
          "id": "37",
          "type": "2",
          "author_id": "28",
          "author_name": "五月天",
          "author_code": "bacg00008",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "89.000",
          "content": [
            {
              "contract_author_code": "AA-TR-010",
              "contract_author_id": "47"
            }
          ]
        },
        {
          "type": "2",
          "author_id": "28",
          "author_name": "五月天",
          "author_code": "bacg00008",
          "no_commission": "0",
          "limit_album": "0",
          "percentage": "81.000",
          "content": [
            {
              "contract_author_code": "AA-TR-010",
              "contract_author_id": "47"
            }
          ]
        }
      ]
    }
  }

  return res.json(info);
}

export default {
  'get    /company/auto': getNameAutoComplete,
  'get    /company': getCompanyAuto,
  'get    /company/detail': getCompanyDetail,
  'post   /company': getList,
  'post   /company/delete': removeCompany,
  'put    /company': addCompany,
  'patch  /company': updateCompany,
  'patch  /company/replace_settlement': updateReplaceSettlement,
}