const getListData = {
  "data": {
    "total_items": "3",
    "data_list": [
      {
        "id": "1",
        "contract_code": "BA-DEV-001",
        "contract_group_name": null,
        "party_a_company": "相信音樂國際股份有限公司",
        "party_b_company": "福茂2",
        "party_b_object_author": null,
        "party_b_object_company": {
          "id": "1",
          "name": "相信音樂國際股份有限公司"
        },
        "contract_start_date": "2020-10-20",
        "contract_end_date": "2020-11-20",
        "contract_expiry_date": "2021-11-20",
        "contract_termination_date": "2020-11-26",
        "is_permanent": "0",
        "renewal_period": "1.0",
        "has_file": "0",
        "subcontracts": []
      },
      {
        "id": "3",
        "contract_code": "BA-DEV-002",
        "contract_group_name": "BA-DEV-003",
        "party_a_company": "福茂2",
        "party_b_company": "Chloe",
        "party_b_object_author": {
          "id": "122",
          "name": "123"
        },
        "party_b_object_company": null,
        "contract_start_date": "2020-10-30",
        "contract_end_date": "2020-11-30",
        "contract_expiry_date": "2020-11-30",
        "contract_termination_date": "2021-12-10",
        "is_permanent": "1",
        "renewal_period": "1.0",
        "has_file": "1",
        "subcontracts": [
          {
            "id": "1",
            "subcontract_code": "BA-DEV-002-01",
            "party_b_object_author": {
              "id": "7",
              "name": "團體名3test"
            }
          },
          {
            "id": "2",
            "subcontract_code": "BA-DEV-002-02",
            "party_b_object_author": {
              "id": "6",
              "name": "團體名2"
            }
          }
        ]
      },
      {
        "id": "28",
        "contract_code": "CP-STAGE-01",
        "contract_group_name": "BA-DEV-003",
        "party_a_company": "company_test_jie",
        "party_b_company": "Chloe",
        "party_b_object_author": {
          "id": "122",
          "author_code": "bacs00133",
          "type": "2",
          "name": "123",
          "is_delete": "1"
        },
        "party_b_object_company": null,
        "contract_start_date": "2020-07-30",
        "contract_end_date": "2020-11-30",
        "contract_expiry_date": "2021-11-30",
        "contract_termination_date": "2021-12-10",
        "is_permanent": "0",
        "renewal_period": "1.0",
        "has_file": "0",
        "subcontracts": []
      },
      {
        "id": "4",
        "contract_code": "BA-DEV-003",
        "contract_group_name": "BA-DEV-003",
        "party_a_company": "福茂2",
        "party_b_company": "Chloe",
        "party_b_object_author": {
          "id": "10",
          "name": "個人本名1"
        },
        "party_b_object_company": null,
        "contract_start_date": "2020-10-15",
        "contract_end_date": "2020-11-15",
        "contract_expiry_date": "2020-11-15",
        "contract_termination_date": "2021-12-10",
        "is_permanent": "0",
        "renewal_period": "1.0",
        "has_file": "0",
        "subcontracts": []
      }
    ]
  }
};
const contractGroupList = {
  'data': [
    {
      'id': '5',
      'contract_code': '123123123',
    },
    {
      'id': '25',
      'contract_code': '5B78FE58',
    },
    {
      'id': '33',
      'contract_code': '5B78FE58',
    },
    {
      'id': '34',
      'contract_code': '5B78FE58',
    },
    {
      'id': '35',
      'contract_code': '5B78FE58',
    },
    {
      'id': '47',
      'contract_code': '5B78FE58',
    },
    {
      'contract_group_name': '5B78FE583',
    },
    {
      'contract_group_name': '5B78FE585',
    },
    {
      'contract_group_name': '10015',
    },
    {
      'contract_group_name': '1234qwer',
    },
  ],
  'execution_time': '0.0926',
  'memory_usage': '3.23MB',
  'status_code': '00000000',
  'params': [],
};

const timeout = 1000;

function getList(req, res) {
  setTimeout(() => {
    return res.json(getListData);
  }, timeout);
}

function getInfo(req, res) {
  let returnObj = {
    "data": {
      "basic_info": {
        "id": "35",
        "contract_code": "BA-DEV-002",  // 合約編號
        "party_b_company": {  // 簽約單位
          "id": "28",
          "company_code": "c0000028",
          "name": "aaaaa"
        },
        "party_b_object_author": {  // 簽約對象 - 藝人 (id, name, author_code)
          "id": "22",
          "author_code": "bacs00022",
          "type": "2",
          "name": "Chloe",
          // "is_delete": "1"
        },
        "party_b_object_company": null,  // 簽約對象 - 公司 (id, company_code, name)
        "contract_start_date": "2020-11-03",  // 合約開始日
        "contract_end_date": "2020-11-28",  // 合約到期日
        "contract_expiry_date": "2020-11-30",  // 合約有效日
        "renewal_period": "1.0",  // 續約年限
        "next_contract": {  // 接續合約
          "id": "21",
          "contract_code": "test888",
          "is_delete": "1"
        },
        "party_a_company": {  // 我方簽約單位
          "id": "9",
          "company_code": "c0000009",
          "name": "Chloe"
        },
        "contract_group_name": "21",  // 合約群組 (adv 稱為 '關聯合約')
        "contract_signing_date": "2020-11-02",  // 簽約日期
        "contract_termination_date": "2020-11-26",  // 合約提前終止 (終止測試用)
        "rights_end_date": "2020-11-30",  // 代理/發行到期日
        "rights_termination_date": "2020-11-28",  // 承上，是否提前終止代理到期日？
        "is_permanent": "0",  // 永久
        "is_buyout": "0",  // 買斷
        "published_album_quantity": "1111",  // 專輯發行數量
        "authorized_area_type": "3",  // 授權地區
        "authorized_area": {  // 授權地區
          "id": "10",
          "area_name": "亞洲"
        },
        "currency_id": "11",  // 幣別
        "notes": "test",  // 備註
        "eid": "1",
        "created_by": "pennychen(test123)",
        "created_at": "2020-11-26 09:50:09",
        "updated_by": null,
        "updated_at": "0000-00-00 00:00:00"
      },
      "contract_author_types": [  // 型態
        {
          "id": "38",
          "type": "1"
        },
        {
          "id": "39",
          "type": "2"
        }
      ],
      "contract_group": [
        {
          "id": "32",
          "contract_code": "BA-DEV-25_02"
        },
        {
          "id": "33",
          "contract_code": "BA-DEV-25_03"
        },
        {
          "id": "35",
          "contract_code": "21"
        }
      ],
      "authorized_countries": [  // 授權地區
        {
          "id": "336",
          "country": {
            "id": "174",
            "country_name_zh": "巴拿馬"
          }
        },
        {
          "id": "337",
          "country": {
            "id": "171",
            "country_name_zh": "紐西蘭"
          }
        }
      ],
      "media_owners": [  // 母帶權利人、視聽著作權人、語文著作權人
        {
          "id": "117",
          "type": "1",
          "company_nickname": {
            "id": "168",
            "nickname": "Chloe",
            "company_code": "c0000010"
          }
        },
        {
          "id": "118",
          "type": "1",
          "company_nickname": {
            "id": "490",
            "nickname": "Universal Ms Publ Ltd. Taiwan",
            "company_code": "c0000072"
          }
        },
        {
          "id": "119",
          "type": "2",
          "company_nickname": {
            "id": "277",
            "nickname": "company_4_nickname_1",
            "company_code": "c0000004"
          }
        },
        {
          "id": "120",
          "type": "2",
          "company_nickname": {
            "id": "280",
            "nickname": "company_6_nickname_1",
            "company_code": "c0000006"
          }
        },
        {
          "id": "121",
          "type": "3",
          "company_nickname": {
            "id": "279",
            "nickname": "company_5_nickname_2",
            "company_code": "c0000001"
          }
        },
        {
          "id": "122",
          "type": "3",
          "company_nickname": {
            "id": "481",
            "nickname": "CQCQ",
            "company_code": "c0000069"
          }
        }
      ],
      "split_information": [  // 拆分
        {
          "id": "67",  // db: contract_author_split.id
          "contract_author_split_item_id": "1",  // 拆分項目 id
          "split_value_type": "1",  // 數值符號 (1:無符號, 2:%, 3:#, 4:Q, 5:*, 6:^)
          "split_value": "11",  // 拆分數值
          "is_specified_country": "1",  // 0 是其他地區，1 是正常地區
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "68",
          "contract_author_split_item_id": "1",
          "split_value_type": "1",
          "split_value": "12",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "69",
          "contract_author_split_item_id": "1",
          "split_value_type": "1",
          "split_value": "13",
          "is_specified_country": "1",
          "country": {
            "id": "4",
            "country_name_zh": "安圭拉"
          }
        },
        {
          "id": "70",
          "contract_author_split_item_id": "1",
          "split_value_type": "1",
          "split_value": "14",
          "is_specified_country": "1",
          "country": {
            "id": "8",
            "country_name_zh": "阿聯"
          }
        },
        {
          "id": "71",
          "contract_author_split_item_id": "2",
          "split_value_type": "1",
          "split_value": "21",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "72",
          "contract_author_split_item_id": "2",
          "split_value_type": "1",
          "split_value": "22",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "73",
          "contract_author_split_item_id": "2",
          "split_value_type": "1",
          "split_value": "23",
          "is_specified_country": "1",
          "country": {
            "id": "37",
            "country_name_zh": "布韋島"
          }
        },
        {
          "id": "74",
          "contract_author_split_item_id": "2",
          "split_value_type": "2",
          "split_value": "24",
          "is_specified_country": "1",
          "country": {
            "id": "40",
            "country_name_zh": "加拿大"
          }
        },
        {
          "id": "75",
          "contract_author_split_item_id": "2",
          "split_value_type": "1",
          "split_value": "25",
          "is_specified_country": "1",
          "country": {
            "id": "5",
            "country_name_zh": "奧蘭"
          }
        },
        {
          "id": "76",
          "contract_author_split_item_id": "3",
          "split_value_type": "1",
          "split_value": "31",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "77",
          "contract_author_split_item_id": "3",
          "split_value_type": "1",
          "split_value": "32",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "78",
          "contract_author_split_item_id": "3",
          "split_value_type": "1",
          "split_value": "33",
          "is_specified_country": "1",
          "country": {
            "id": "42",
            "country_name_zh": "瑞士"
          }
        },
        {
          "id": "79",
          "contract_author_split_item_id": "3",
          "split_value_type": "1",
          "split_value": "34",
          "is_specified_country": "1",
          "country": {
            "id": "25",
            "country_name_zh": "巴林"
          }
        },
        {
          "id": "80",
          "contract_author_split_item_id": "4",
          "split_value_type": "1",
          "split_value": "41",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "81",
          "contract_author_split_item_id": "4",
          "split_value_type": "1",
          "split_value": "42",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "82",
          "contract_author_split_item_id": "4",
          "split_value_type": "1",
          "split_value": "43",
          "is_specified_country": "1",
          "country": {
            "id": "6",
            "country_name_zh": "阿爾巴尼亞"
          }
        },
        {
          "id": "83",
          "contract_author_split_item_id": "4",
          "split_value_type": "3",
          "split_value": "44",
          "is_specified_country": "1",
          "country": {
            "id": "44",
            "country_name_zh": "中國"
          }
        },
        {
          "id": "84",
          "contract_author_split_item_id": "5",
          "split_value_type": "1",
          "split_value": "51",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "85",
          "contract_author_split_item_id": "5",
          "split_value_type": "1",
          "split_value": "52",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "86",
          "contract_author_split_item_id": "5",
          "split_value_type": "1",
          "split_value": "53",
          "is_specified_country": "1",
          "country": {
            "id": "29",
            "country_name_zh": "白俄羅斯"
          }
        },
        {
          "id": "87",
          "contract_author_split_item_id": "5",
          "split_value_type": "1",
          "split_value": "54",
          "is_specified_country": "1",
          "country": {
            "id": "8",
            "country_name_zh": "阿聯"
          }
        },
        {
          "id": "88",
          "contract_author_split_item_id": "6",
          "split_value_type": "1",
          "split_value": "61",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "89",
          "contract_author_split_item_id": "6",
          "split_value_type": "1",
          "split_value": "62",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "90",
          "contract_author_split_item_id": "6",
          "split_value_type": "1",
          "split_value": "63",
          "is_specified_country": "1",
          "country": {
            "id": "10",
            "country_name_zh": "亞美尼亞"
          }
        },
        {
          "id": "91",
          "contract_author_split_item_id": "6",
          "split_value_type": "1",
          "split_value": "64",
          "is_specified_country": "1",
          "country": {
            "id": "1",
            "country_name_zh": "阿魯巴"
          }
        },
        {
          "id": "92",
          "contract_author_split_item_id": "7",
          "split_value_type": "1",
          "split_value": "71",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "93",
          "contract_author_split_item_id": "7",
          "split_value_type": "5",
          "split_value": "72",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "94",
          "contract_author_split_item_id": "7",
          "split_value_type": "4",
          "split_value": "73",
          "is_specified_country": "1",
          "country": {
            "id": "1",
            "country_name_zh": "阿魯巴"
          }
        },
        {
          "id": "95",
          "contract_author_split_item_id": "7",
          "split_value_type": "1",
          "split_value": "74",
          "is_specified_country": "1",
          "country": {
            "id": "12",
            "country_name_zh": "南極洲"
          }
        },
        {
          "id": "96",
          "contract_author_split_item_id": "8",
          "split_value_type": "1",
          "split_value": "81",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "97",
          "contract_author_split_item_id": "8",
          "split_value_type": "1",
          "split_value": "82",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "98",
          "contract_author_split_item_id": "8",
          "split_value_type": "1",
          "split_value": "83",
          "is_specified_country": "1",
          "country": {
            "id": "6",
            "country_name_zh": "阿爾巴尼亞"
          }
        },
        {
          "id": "99",
          "contract_author_split_item_id": "8",
          "split_value_type": "1",
          "split_value": "84",
          "is_specified_country": "1",
          "country": {
            "id": "7",
            "country_name_zh": "安道爾"
          }
        },
        {
          "id": "100",
          "contract_author_split_item_id": "9",
          "split_value_type": "1",
          "split_value": "91",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "101",
          "contract_author_split_item_id": "9",
          "split_value_type": "1",
          "split_value": "92",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "102",
          "contract_author_split_item_id": "9",
          "split_value_type": "1",
          "split_value": "93",
          "is_specified_country": "1",
          "country": {
            "id": "30",
            "country_name_zh": "貝里斯"
          }
        },
        {
          "id": "103",
          "contract_author_split_item_id": "9",
          "split_value_type": "1",
          "split_value": "94",
          "is_specified_country": "1",
          "country": {
            "id": "8",
            "country_name_zh": "阿聯"
          }
        },
        {
          "id": "104",
          "contract_author_split_item_id": "10",
          "split_value_type": "1",
          "split_value": "101",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "105",
          "contract_author_split_item_id": "10",
          "split_value_type": "1",
          "split_value": "102",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "106",
          "contract_author_split_item_id": "10",
          "split_value_type": "1",
          "split_value": "103",
          "is_specified_country": "1",
          "country": {
            "id": "2",
            "country_name_zh": "阿富汗"
          }
        },
        {
          "id": "107",
          "contract_author_split_item_id": "10",
          "split_value_type": "6",
          "split_value": "104",
          "is_specified_country": "1",
          "country": {
            "id": "7",
            "country_name_zh": "安道爾"
          }
        },
        {
          "id": "108",
          "contract_author_split_item_id": "11",
          "split_value_type": "1",
          "split_value": "111",
          "is_specified_country": "1",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          }
        },
        {
          "id": "109",
          "contract_author_split_item_id": "11",
          "split_value_type": "1",
          "split_value": "112",
          "is_specified_country": "0",
          "country": null
        },
        {
          "id": "110",
          "contract_author_split_item_id": "11",
          "split_value_type": "1",
          "split_value": "113",
          "is_specified_country": "1",
          "country": {
            "id": "35",
            "country_name_zh": "汶萊"
          }
        },
        {
          "id": "111",
          "contract_author_split_item_id": "11",
          "split_value_type": "1",
          "split_value": "114",
          "is_specified_country": "1",
          "country": {
            "id": "43",
            "country_name_zh": "智利"
          }
        },
        {
          "id": "112",
          "contract_author_split_item_id": "12",
          "split_value_type": "1",
          "split_value": "121",
          "is_specified_country": "0",
          "country": null
        }
      ],
      "files": [  // 檔案
        {
          "id": "45",
          "orig_name": "相信音樂平台週會_20200826",
          "ext": "pdf"
        },
        {
          "id": "46",
          "orig_name": "相信音樂平台週會_20201120",
          "ext": "pdf"
        }
      ]
    }
  };


  return res.status(200).json(returnObj);
}

function createSubContract(req, res) {
  return res.status(200).json({ 'data': 'ok' });
}

function getContractGroupList(req, res) {
  setTimeout(() => {
    return res.json(contractGroupList);
  }, timeout);
}

function updateData(req, res) {
  return res.status(200).json({ data: { contract_author_id: '1' } });
}

function exitContractGroup(req, res) {
  return res.status(200).json({});
}

function getContractsWithoutGroup(req, res) {
  return res.json(
    {
      "data": [
        {
          "id": "1",
          "contract_code": "BA-DEV-001"
        },
        {
          "id": "2",
          "contract_code": "BA-DEV-002"
        },
        {
          "id": "3",
          "contract_code": "BA-DEV-003"
        },
      ]
    }
  );

  // return res.status(500).json({ "message": "讀取合約群駔失敗,請洽系統管理員!" });
}

function getContractGroup(req, res) {
  return res.json(
    {
      "data": [
        {
          "contract_group_name": "BA-DEV-003",
          "group_members": [
            "BA-DEV-002",
            "BA-DEV-003"
          ]
        },
        {
          "contract_group_name": "BA-DEV-004",
          "group_members": [
            "BA-DEV-004",
            "BA-DEV-005"
          ]
        }
      ]
    }
  );
}

function copyContract(req, res) {
  return res.status(200).json({ data: { contract_author_id: '2' } });
}

function contractsAutoComplete(req, res) {
  return res.json({
    "data": [
      {
        "id": "1",
        "contract_code": "21"
      },
      {
        "id": "3",
        "contract_code": "BA-DEV-002"
      },
      {
        "id": "4",
        "contract_code": "BA-DEV-003"
      },
      {
        "id": "31",
        "contract_code": "BA-DEV-25_01"
      },
      {
        "id": "32",
        "contract_code": "BA-DEV-25_02"
      },
      {
        "id": "33",
        "contract_code": "BA-DEV-25_03"
      },
      {
        "id": "34",
        "contract_code": "BA-DEV-25_04"
      }
    ]
  });
}

function getContracstBelongToAuthor(req, res) {
  let returnObj = {
    "data": [
      {
        "contract_author": {
          "id": "2",
          "contract_code": "CP-BA-DEV-001",
          "is_delete": "0"
        },
        "party_b_company": null,
        "subcontract_parent_author_id": "28",
        "subcontract_id": "1"
      },
      {
        "contract_author": {
          "id": "5",
          "contract_code": "BA-LIU-2019",
          "is_delete": "0"
        },
        "party_b_company": {
          "id": "1",
          "company_code": "c0000001",
          "name": "相信音樂國際股份有限公司",
          "is_delete": "0"
        }
      }
    ]
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getSpecifiedAlbum(req, res) {
  let returnObj = {
    "data": {
      "total_items": "1",
      "data_list": [
        {
          "id": "1",
          "album_id": "11",
          "album_code": "BD000103",
          "album_name_zh": "test 離開地球表面",
          "release_date": "2020-07-20",
          "release_country_id": "229",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          },
          "type_id": "1"
        },
        {
          "id": "2",
          "album_id": "12",
          "album_code": "BD000102",
          "album_name_zh": "test 離開地球表面2",
          "release_date": "2020-07-21",
          "release_country_id": "229",
          "country": {
            "id": "229",
            "country_name_zh": "台灣"
          },
          "type_id": "1"
        }
      ]
    },
    "execution_time": "0.0868",
    "memory_usage": "3.81MB",
    "status_code": "00000000",
    "params": {
      "contract_author_id": "28",
      "page_current": "1"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getSpecifiedSong(req, res) {
  let returnObj = {
    "data": {
      "total_items": "2",
      "data_list": [
        {
          "id": "5",
          "song_code": "bsc012430",
          "song_name": "我還是不懂",
          "isrc_id": "4",
          "isrc": "123456789012",
          "singer": "五月天feat.周杰倫",
          "isrc_type_id": "1"
        },
        {
          "id": "6",
          "song_code": "bsc012431",
          "song_name": "安和",
          "isrc_id": "9",
          "isrc": "123456789022",
          "singer": "五月天feat.周杰倫",
          "isrc_type_id": "1"
        }
      ]
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getPrepaid(req, res) {
  let returnObj = {
    "data": {
      "total_items": 2,
      "data_list": [
        {
          "id": "2",
          "contract_id": "130",
          "payable_date": "2020-09-02",  // 應支付日期
          "payment_date": "2020-09-01",  // 實際支付日期
          "debited_start_date": "2020-11-10",  // 可扣抵區間 (開始)
          "debited_end_date": "2020-11-15",  // 可扣抵區間 (結束)
          "before_tax": "1000",  // 台幣金額 (未稅)
          "balance": "900",
          "album_coverage": "2",  // 適用專輯 (0:無, 1:全部, 2:指定)
          "song_coverage": "1",  // 適用單曲/ISRC (0:無, 1:全部, 2:指定)
          "specified_albums": [  // 適用專輯
            {
              "id": "31",
              "album_id": "3",
              "album_name_zh": "test_album_insert",
              "album_code": "BD0003"
            },
            {
              "id": "33",
              "album_id": "4",
              "album_name_zh": "test",
              "album_code": "BD0004"
            }
          ],
          "specified_songs": []  // 適用單曲/ISRC
        },
        {
          "id": "3",
          "contract_id": "130",
          "payable_date": "2020-09-02",
          "payment_date": "2020-09-01",
          "debited_start_date": "2020-11-10",
          "debited_end_date": "2020-11-15",
          "before_tax": "800",
          "balance": null,
          "album_coverage": "0",
          "song_coverage": "2",
          "specified_albums": [],
          "specified_songs": [
            {
              "id": "7",
              "isrc_id": "4",
              "song_name": "我還是不懂",
              "singer": "五月天feat.周杰倫",
              "isrc": "TWA450689705"
            }
          ]
        }
      ]
    },
    "execution_time": "0.2015",
    "memory_usage": "4.28MB",
    "status_code": "00000000",
    "params": {
      "contract_author_id": "130",
      "page_current": "1"
    }
  }

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

export default {
  'get    /contract_author/contract_group_list': getContractGroupList,
  'post   /contract_author/overview': getList,
  'get    /contract_author': getInfo,
  'post   /contract_author/sub_contract/create': createSubContract,
  'patch  /contract_author/contractRenewal': updateData,
  'post   /contract_author/delete_subcontract': updateData,
  'put    /contract_author/subcontract': updateData,
  'put    /contract_author': updateData,
  'patch  /contract_author': updateData,
  'post   /contract_author/delete': updateData,
  'put    /contract_author/copy_contract': copyContract,
  'get    /contract_author/contracts': contractsAutoComplete,
  'get    /contract_author/contracts_belong_to_author': getContracstBelongToAuthor,
  // contract group
  'post   /contract_author/exit_contract_group': exitContractGroup,
  'get    /contract_author/contracts_without_group': getContractsWithoutGroup,
  'get    /contract_author/contract_groups': getContractGroup,
  // specified album
  'get   /contract_author/specified_album': getSpecifiedAlbum,
  // specified song
  'get   /contract_author/specified_song': getSpecifiedSong,
  'patch /contract_author/specified_song': updateData,
  // prepaid
  'get   /contract_author/prepaid': getPrepaid,
  'put   /contract_author/prepaid': updateData,
  'patch /contract_author/prepaid': updateData,
  'post  /contract_author/delete_prepaid': updateData,
};
