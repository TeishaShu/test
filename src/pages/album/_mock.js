const getListData = {
  "data": {
    "total_item": 2,
    "data_list": [
      {
        "id": "1",
        "album_code": "BD0001",  // 專輯編號
        "is_debut": "1",  // 首發專輯 > 0, 1
        "album_name_zh": "我不要離開地球表面Jump!The World 2007極限大碟",  // 專輯名稱
        "version": null,
        "author": "五月天",  // 演唱人
        "type": "EP",  // 型態
        "publish_country": "台灣",  // 發行地區
        "company_nickname": "公司別名1",  // 發行公司
        "publish_date": "2020-08-19",  // 發行日期
        "is_righ_setting": "1",  // 詞曲結算
        "is_re_setting": "0"  // 錄音結算
      },
      {
        "id": "3",
        "album_code": "BD0003",
        "is_debut": "0",
        "album_name_zh": "test_album_insert",
        "version": null,
        "author": "五月天",
        "type": "專輯",
        "publish_country": "台灣",
        "company_nickname": "company_5_nickname_1",
        "publish_date": "2020-07-20",
        "is_righ_setting": "0",
        "is_re_setting": "1"
      }
    ]
  },
  "execution_time": "0.0603",
  "memory_usage": "3.32MB",
  "status_code": "00000000",
  "params": {
    "page_current": "0"
  }
};

function getList(req, res) {
  // request example
  /*
  {
    "keyword": "",  // 關鍵字查詢
    "precise": 0,  // 精準查詢 > 0(否), 1(是)
    "search_range": null,  // 範圍 > null(全部), bin(相信), ext(外部專輯)
    "album_type_id": "0",  // 專輯型態 > null(不限), 1(專輯), 2(EP), 3(精選), 4(合輯), 5(原聲帶), 6(LIVE), 7(數位), 8(電影), 9(影片)
    "publish_country": null,  // 國家 > from db: authorized_country.id
    "page_size": "20",  // 一頁需要筆數
    "page_current": "1",  // 第幾頁
    "order": "updated_at",  // 排序選項 > updated_at, publish_date
    "sort": "ASC"  // 排序方式 > asc, desc
  }
  */

  setTimeout(() => {
    return res.json(getListData);
  }, 1000);
}

function getAutoComplete(req, res) {
  let returnObj = {
    "data": [
      {
        "id": "24",
        "album_code": "RXCD069",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "44",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "12",
        "country_code": "CHN",
        "country_code_short": "CN",
        "country_name_en": "China",
        "release_country": "中國",
        "release_date": "2008-10-23"
      },
      {
        "id": "220",
        "album_code": "KGE0258DT",
        "album_name_zh": "後 青春期的詩 MV影音全集",
        "album_name_en": null,
        "type_id": "1",
        "version": "精裝版",
        "author": "五月天",
        "release_country_id": "44",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "13",
        "country_code": "CHN",
        "country_code_short": "CN",
        "country_name_en": "China",
        "release_country": "中國",
        "release_date": "2009-06-27"
      },
      {
        "id": "221",
        "album_code": "KGE0258D",
        "album_name_zh": "後 青春期的詩 MV影音全集",
        "album_name_en": null,
        "type_id": "1",
        "version": "平裝版",
        "author": "五月天",
        "release_country_id": "44",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "13",
        "country_code": "CHN",
        "country_code_short": "CN",
        "country_name_en": "China",
        "release_country": "中國",
        "release_date": "2009-06-27"
      },
      {
        "id": "433",
        "album_code": "BL0002",
        "album_name_zh": "後 青春期的詩(Poetry Of The Day After)",
        "album_name_en": "Poetry Of The Day After",
        "type_id": "1",
        "version": "LP黑膠",
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "12",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2017-12-05"
      },
      {
        "id": "479",
        "album_code": "BDVD0005-4PC",
        "album_name_zh": "「十萬人 出頭天 Live」＆「 後 青春期的詩 MV」",
        "album_name_en": null,
        "type_id": "6",
        "version": null,
        "author": "五月天",
        "release_country_id": "195",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "31",
        "country_code": "SGP",
        "country_code_short": "SG",
        "country_name_en": "Singapore",
        "release_country": "新加坡",
        "release_date": "2009-03-20"
      },
      {
        "id": "480",
        "album_code": "BDVD0005-4P",
        "album_name_zh": "「十萬人 出頭天 Live」＆「 後 青春期的詩 MV」",
        "album_name_en": null,
        "type_id": "6",
        "version": null,
        "author": "五月天",
        "release_country_id": "195",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "31",
        "country_code": "SGP",
        "country_code_short": "SG",
        "country_name_en": "Singapore",
        "release_country": "新加坡",
        "release_date": "2009-03-20"
      },
      {
        "id": "481",
        "album_code": "BDVD0005-4N",
        "album_name_zh": "「十萬人 出頭天 Live」＆「 後 青春期的詩 MV」",
        "album_name_en": null,
        "type_id": "6",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "31",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2009-03-20"
      },
      {
        "id": "482",
        "album_code": "BDVD0005-4",
        "album_name_zh": "「十萬人 出頭天 Live」＆「 後 青春期的詩 MV」",
        "album_name_en": null,
        "type_id": "6",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "31",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2009-03-20"
      },
      {
        "id": "483",
        "album_code": "BDVD0004",
        "album_name_zh": "後 青春期的詩 MV影音全集",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "13",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2009-03-20"
      },
      {
        "id": "647",
        "album_code": "BD0016S",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "195",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "12",
        "country_code": "SGP",
        "country_code_short": "SG",
        "country_name_en": "Singapore",
        "release_country": "新加坡",
        "release_date": "2008-10-28"
      },
      {
        "id": "648",
        "album_code": "BD0016B-N",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "195",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "16",
        "country_code": "SGP",
        "country_code_short": "SG",
        "country_name_en": "Singapore",
        "release_country": "新加坡",
        "release_date": "2008-10-29"
      },
      {
        "id": "649",
        "album_code": "BD0016B-C",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "195",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "16",
        "country_code": "SGP",
        "country_code_short": "SG",
        "country_name_en": "Singapore",
        "release_country": "新加坡",
        "release_date": "2008-12-23"
      },
      {
        "id": "650",
        "album_code": "BD0016B",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "16",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2008-10-23"
      },
      {
        "id": "651",
        "album_code": "BD0016A",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": "校園版",
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "12",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2008-10-23"
      },
      {
        "id": "652",
        "album_code": "BD0016",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "12",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2008-10-23"
      },
      {
        "id": "819",
        "album_code": "88765448719",
        "album_name_zh": "後 青春期的詩 MV影音全集",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "13",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2009-03-20"
      },
      {
        "id": "820",
        "album_code": "88765448702",
        "album_name_zh": "後 青春期的詩",
        "album_name_en": null,
        "type_id": "1",
        "version": null,
        "author": "五月天",
        "release_country_id": "229",
        "release_company_id": "1",
        "release_company": "相信音樂國際股份有限公司",
        "release_nickname_id": "823",
        "relrease_nickname": "北京紅點星文化傳媒有限公司",
        "song_count": "12",
        "country_code": "TWN",
        "country_code_short": "TW",
        "country_name_en": "Taiwan",
        "release_country": "台灣",
        "release_date": "2008-10-23"
      }
    ]
  };

  return res.json(returnObj);
}

function getInfo(req, res) {
  let returnObj = {
    "data": {
      "id": "4",
      "is_external": "0",  // 外部專輯 > 0, 1
      "is_debut": "1",  // 首發專輯 > 0, 1
      "album_code": "testtest",  // 專輯編號
      "album_name_zh": "我不要離開地球表面Jump!The World 2007極限大碟",  // 專輯名稱
      "album_name_en": "AAAAA",  // 名稱 (英)
      "original_code": "BD0007",  // 原始編號 (為哪張專輯的改版)
      "original_album_id": "12",
      "upc": "test test",  // UPC/ENA
      "project_code": "BD0007",  // Project Code
      "ext_code": [  // Ext Code ?? 是否吐 id，須確定如何判斷編輯、刪除
        "DB7777-a",
        "BD7777-aaa"
      ],
      "release_date": "2020-08-19",  // 發行日期
      "author": "五月天",  // 演唱人
      "release_company_id": "82",  // 發行者 > company_id
      "release_nickname_id": "288",  // 發行者 > company nickname id
      "release_nickname": "公司別名1",  // 發行者 > company nickname
      "user_company_id": "4",  // 使用者 > company id
      "user_nickname_id": "0",
      "user_nickname": null,  // 使用者 > user nickname
      "user_company_code": "c0000004",  // 使用者 > company code
      "release_year": "25",  // 發行年限
      "release_expiry_date": "2030-10-30",  // 發行到期日
      "song_count": "7",  // 曲數
      "release_country_id": "229",  // 發行地區 > id
      "release_country": "台灣",
      "authorize_area_type": "3",  // 授權地區 > 類型 (1：無特定地區(只選國家)；2：只有特定地區(無國家)；3：地區包含特定國家；4：地區排除特定國家)
      "authorize_area_id": "3",  // 授權地區 > 範圍 id
      "authorize_area": "東南亞",  // 授權地區 > 範圍名稱
      "authorized_country_id": [  // 授權地區 > 特定地區
        {
          "id": "76",
          "fk_id": "4",
          "fk_table": "album",
          "country_id": "23",
          "created_by": "chengjie",
          "created_at": "2020-09-08 12:14:01",
          "updated_by": null,
          "updated_at": "0000-00-00 00:00:00"
        },
        {
          "id": "77",
          "fk_id": "4",
          "fk_table": "album",
          "country_id": "229",
          "created_by": "chengjie",
          "created_at": "2020-09-08 12:14:01",
          "updated_by": null,
          "updated_at": "0000-00-00 00:00:00"
        }
      ],
      "currency_id": "1",  // 幣別 > 選項
      "currency": "台幣/TWD",  // 幣別 > 選項名稱
      "version": "123",  // 版別
      "type_id": "8",  // 專輯型態
      "note": "note note",  // 備註
      "created_at": "2020-09-08 11:41",
      "created_by": "chengjie",
      "updated_at": "2020-09-08 12:14",
      "updated_by": "chengjie",
      "series": "BD0007",
      "authorized_country_id": [
        {
          "id": "456",
          "fk_id": "13",
          "fk_table": "album",
          "country_id": "4",
          "created_by": "10",
          "created_at": "2020-12-18 17:27:06",
          "updated_by": null,
          "updated_at": "0000-00-00 00:00:00",
          "country_name_zh": "安圭拉"
        }
      ],
      "record_split": [  // 適用合約
        {
          "author_id": "85",
          "author_name": "AdabudaAlibuda",
          "fraction": "1/4",
          "numerator": "1",
          "denominator": "4",
          "contract_code": "BA-DEV-002",
          "contract_author_id": "3",
          "company_id": "0",
          "company_name": null
        },
        {
          "author_id": "7",
          "author_name": "團體名3test",
          "fraction": "1/4",
          "numerator": "1",
          "denominator": "4",
          "contract_code": "BA-CP-010-1",
          "contract_author_id": "3",
          "company_id": "0",
          "company_name": null
        }
      ]
    },
    "execution_time": "0.1184",
    "memory_usage": "3.36MB",
    "status_code": "00000000",
    "params": {
      "album_code": "BD0004"
    }
  };

  return res.json(returnObj);
}

function updateData(req, res) {
  const returnObj = {
    data: {
      id: '1'
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 3000);
}

function getContent(req, res) {
  /*
  const returnObj = {
    "data": {
      "length": 630,
      "format_length": "10'30\"",
      "is_song_calc": 0,
      "is_song_right_calc": 0,
      "is_record_calc": 0,
      "is_record_right_calc": 0,
      "is_nm_song_calc": 0,
      "is_nm_record_calc": 0,
      "prepaid": 0,
      "disc": [
        {
          "disc_id": "15",
          "album_id": "1",
          "disc_seq": "1",
          "disc_type_id": "1",
          "disc_type": "CD",
          "content": [
            {
              "album_disc_content_id": "15",
              "song_seq": "2",
              "song_code": "bsc050002",
              "song_name": "超展開\t",
              "song_name_en": null,
              "isrc_id": "3",
              "isrc": "TWK231911704",
              "singer": "鼓鼓 GBOYSWAG",
              "contract_author_id": null,
              "is_debut": "0",
              "is_song_calc": "0",
              "is_song_right_calc": "1",
              "is_record_calc": "0",
              "is_record_right_calc": "0",
              "is_nm_song_calc": "0",
              "is_nm_record_calc": "0",
              "song_name_ext": null,
              "length": "389",
              "isrc_type": "演唱",
              "isrc_type_id": "1",
              "format_length": "06'29\"",
              "prepaid_count": 0,
              "righ_split": [
                {
                  "settle_album_prepaid_id": "3",
                  "is_settled": "1",
                  "album_disc_content_id": "15",
                  "isrc": "TWK231911704",
                  "isrc_id": "3",
                  "song_code": "bsc050000",
                  "author": "五月天 阿信",
                  "author_code": "bacs00113",
                  "song_rights_type_id": "1",
                  "song_rights_type": "詞",
                  "split_ratio": "100.000%",
                  "init_value": null,
                  "selected_op_company_id": null,
                  "selected_op_author_id": null,
                  "song_right_effective": "1",
                  "song_right_date_effective": "1",
                  "op_company_name": null,
                  "op_author_name": null,
                  "sp_company_name": null
                }
              ],
              "reco_split": [
                {
                  "id": "40",
                  "isrc_id": "3",
                  "contract_author_id": "5",
                  "subcontract_id": null,
                  "author_id": "306",
                  "company_id": "1",
                  "numerator": "1",
                  "denominator": "1",
                  "isrc_ratio": "100.000",
                  "company_code": "c0000001",
                  "company_name": "相信音樂國際股份有限公司",
                  "author_code": "bacs00269",
                  "author_name": "呂國緯",
                  "contract_code": "BA-LIU-2019"
                }
              ]
            },
            {
              "album_disc_content_id": "21",
              "song_seq": "5",
              "song_code": "bsc050001",
              "song_name": "test2",
              "song_name_en": null,
              "isrc_id": "7",
              "isrc": "TWK123456789",
              "singer": "Joseph Brooks",
              "contract_author_id": null,
              "is_debut": "0",
              "is_song_calc": "0",
              "is_song_right_calc": "0",
              "is_record_calc": "0",
              "is_record_right_calc": "0",
              "is_nm_song_calc": "0",
              "is_nm_record_calc": "0",
              "song_name_ext": null,
              "length": null,
              "isrc_type": "MV+卡拉ok",
              "isrc_type_id": "4",
              "format_length": "00'00\"",
              "prepaid_count": 0,
              "righ_split": [],
              "reco_split": [
                {
                  "id": "44",
                  "isrc_id": "7",
                  "contract_author_id": null,
                  "subcontract_id": null,
                  "author_id": "571",
                  "company_id": null,
                  "numerator": "1",
                  "denominator": "1",
                  "isrc_ratio": "100.000",
                  "company_code": null,
                  "company_name": null,
                  "author_code": "bacs00534",
                  "author_name": "Joseph Brooks",
                  "contract_code": null
                }
              ]
            },
            {
              "album_disc_content_id": "17",
              "song_seq": "34",
              "song_code": "bsc050000",
              "song_name": "溫柔",
              "song_name_en": null,
              "isrc_id": "2",
              "isrc": "TWA450479303",
              "singer": "五月天",
              "contract_author_id": null,
              "is_debut": "0",
              "is_song_calc": "0",
              "is_song_right_calc": "0",
              "is_record_calc": "0",
              "is_record_right_calc": "0",
              "is_nm_song_calc": "0",
              "is_nm_record_calc": "0",
              "song_name_ext": null,
              "length": "241",
              "isrc_type": "演唱",
              "isrc_type_id": "1",
              "format_length": "04'01\"",
              "prepaid_count": 2,
              "righ_split": [],
              "reco_split": []
            }
          ]
        },
        {
          "disc_id": "16",
          "album_id": "1",
          "disc_seq": "2",
          "disc_type_id": "1",
          "disc_type": "CD",
          "content": [
            {
              "album_disc_content_id": "16",
              "song_seq": "1",
              "song_code": "bsc050000",
              "song_name": "溫柔",
              "song_name_en": null,
              "isrc_id": "1",
              "isrc": "T10000000001",
              "singer": "阿信",
              "contract_author_id": null,
              "is_debut": "0",
              "is_song_calc": "0",
              "is_song_right_calc": "0",
              "is_record_calc": "0",
              "is_record_right_calc": "0",
              "is_nm_song_calc": "0",
              "is_nm_record_calc": "0",
              "song_name_ext": null,
              "length": null,
              "isrc_type": "演唱",
              "isrc_type_id": "1",
              "format_length": "00'00\"",
              "prepaid_count": 2,
              "righ_split": [],
              "reco_split": []
            }
          ]
        }
      ]
    }
  };
  */

  let returnObj = { "data": { "length": 1228, "format_length": "20'28\"", "is_song_calc": 6, "is_song_right_calc": 4, "is_record_calc": 6, "is_record_right_calc": 5, "is_nm_song_calc": 6, "is_nm_record_calc": 6, "prepaid": 10000, "disc": [{ "disc_id": "6", "album_id": "20", "disc_seq": "2", "disc_type_id": "3", "disc_type": "DVD", "content": [{ "album_disc_content_id": "18", "song_seq": "3", "song_code": "bsc000021", "song_name": "\u5c0f\u5c0f\u5b69", "song_name_en": "Little Child", "isrc_id": "1", "isrc": "TWK241408601", "singer": "\u6881\u975c\u8339", "contract_author_id": null, "is_debut": "1", "is_song_calc": "1", "is_song_right_calc": "0", "is_record_calc": "1", "is_record_right_calc": "0", "is_nm_song_calc": "1", "is_nm_record_calc": "1", "song_name_ext": null, "length": "320", "isrc_type": "\u7d44\u66f2MV", "isrc_type_id": "7", "format_length": "05'20\"", "prepaid_count": 0, "righ_split": [{ "song_right_id": "46", "is_digital": "0", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "18", "isrc": "TWK241408601", "isrc_id": "1", "song_code": "bsc000021", "author": "\u9673\u52c7\u5fd7", "author_code": "bacs00110", "song_rights_type_id": "1", "song_rights_type": "\u8a5e", "split_ratio": "50.000%", "init_value": null, "selected_op_company_id": "18", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "0", "song_right_date_effective": "0", "op_company_name": "\u91d1\u4e09\u97f3\u6a02\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8" }, { "song_right_id": "46", "is_digital": "0", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "18", "isrc": "TWK241408601", "isrc_id": "1", "song_code": "bsc000021", "author": "\u9673\u52c7\u5fd7", "author_code": "bacs00110", "song_rights_type_id": "1", "song_rights_type": "\u8a5e", "split_ratio": "50.000%", "init_value": null, "selected_op_company_id": "18", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": "\u91d1\u4e09\u97f3\u6a02\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8" }], "reco_split": [{ "id": "16", "isrc_id": "1", "contract_author_id": "8", "subcontract_id": null, "parent_author_id": null, "author_id": "270", "company_id": "1", "numerator": "1", "denominator": "2", "isrc_ratio": "50.000", "company_code": "c0000001", "company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "author_code": "bacs00111", "author_name": "\u6881\u975c\u8339", "contract_code": "AA-Mars-BD0086" }] }, { "album_disc_content_id": "11", "song_seq": "10", "song_code": "bsc000017", "song_name": "\u82b1\u9999", "song_name_en": null, "isrc_id": "9", "isrc": "TWHB22001025", "singer": "\u9b4f\u5609\u7469", "contract_author_id": null, "is_debut": "1", "is_song_calc": "1", "is_song_right_calc": "1", "is_record_calc": "1", "is_record_right_calc": "1", "is_nm_song_calc": "1", "is_nm_record_calc": "1", "song_name_ext": null, "length": "218", "isrc_type": "\u6f14\u5531\u6703", "isrc_type_id": "3", "format_length": "03'38\"", "prepaid_count": 1, "righ_split": [{ "song_right_id": "34", "is_digital": "1", "is_entity": "0", "settle_album_prepaid_id": "7", "settle_album_prepaid_right_id": "7", "is_settled": "0", "album_disc_content_id": "11", "isrc": "TWHB22001025", "isrc_id": "9", "song_code": "bsc000017", "author": "\u65b9\u594e\u68e0", "author_code": "bacs00089", "song_rights_type_id": "6", "song_rights_type": "\u81ea\u8a02", "split_ratio": "150.000%", "init_value": "10000", "selected_op_company_id": "1", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "1", "song_right_date_effective": "1", "op_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": null }, { "song_right_id": "35", "is_digital": "0", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "11", "isrc": "TWHB22001025", "isrc_id": "9", "song_code": "bsc000017", "author": "\u9673\u4fe1\u5b8f", "author_code": "bacs00083", "song_rights_type_id": "3", "song_rights_type": "\u6539\u7de8\u8a5e", "split_ratio": "50.000%", "init_value": null, "selected_op_company_id": "9", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "0", "song_right_date_effective": "0", "op_company_name": "\u8a8d\u771f\u5de5\u4f5c\u5ba4", "op_author_name": null, "sp_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8" }, { "song_right_id": "44", "is_digital": "1", "is_entity": "0", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "11", "isrc": "TWHB22001025", "isrc_id": "9", "song_code": "bsc000017", "author": "\u5442\u570b\u7def", "author_code": "bacs00101", "song_rights_type_id": "1", "song_rights_type": "\u8a5e", "split_ratio": "20.000%", "init_value": null, "selected_op_company_id": null, "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "19", "settle_company_name": "\u6efe\u77f3\u570b\u969b\u97f3\u6a02\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "0", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": null, "op_author_name": null, "sp_company_name": null }, { "song_right_id": "45", "is_digital": "1", "is_entity": "0", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "11", "isrc": "TWHB22001025", "isrc_id": "9", "song_code": "bsc000017", "author": "\u5442\u570b\u7def", "author_code": "bacs00101", "song_rights_type_id": "2", "song_rights_type": "\u66f2", "split_ratio": "25.000%", "init_value": null, "selected_op_company_id": null, "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "4", "settle_company_name": "SONY\u5531\u7247", "is_default": "0", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": null, "op_author_name": null, "sp_company_name": null }], "reco_split": [{ "id": "22", "isrc_id": "9", "contract_author_id": null, "subcontract_id": null, "parent_author_id": null, "author_id": "271", "company_id": null, "numerator": "1", "denominator": "1", "isrc_ratio": "100.000", "company_code": null, "company_name": null, "author_code": "bacs00112", "author_name": "\u9b4f\u5609\u7469", "contract_code": null }] }, { "album_disc_content_id": "12", "song_seq": "12", "song_code": "bsc000024", "song_name": "\u6211\u7684\u5fc3\u88e1\u5440", "song_name_en": null, "isrc_id": "10", "isrc": "TWK232082460", "singer": "\u9f13\u9f13 GBOYSWAG\t", "contract_author_id": "23", "is_debut": "1", "is_song_calc": "1", "is_song_right_calc": "1", "is_record_calc": "1", "is_record_right_calc": "1", "is_nm_song_calc": "1", "is_nm_record_calc": "1", "song_name_ext": null, "length": "122", "isrc_type": "\u6f14\u5531", "isrc_type_id": "1", "format_length": "02'02\"", "prepaid_count": 0, "righ_split": [{ "song_right_id": "54", "is_digital": "1", "is_entity": "0", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "12", "isrc": "TWK232082460", "isrc_id": "10", "song_code": "bsc000024", "author": "\u963f\u4fe1", "author_code": "bacs00003", "song_rights_type_id": "2", "song_rights_type": "\u66f2", "split_ratio": "30.000%", "init_value": null, "selected_op_company_id": null, "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": null, "settle_company_name": null, "is_default": "0", "song_right_effective": "0", "song_right_date_effective": "1", "op_company_name": null, "op_author_name": null, "sp_company_name": null }], "reco_split": [{ "id": "25", "isrc_id": "10", "contract_author_id": null, "subcontract_id": null, "parent_author_id": null, "author_id": "260", "company_id": null, "numerator": "1", "denominator": "1", "isrc_ratio": "100.000", "company_code": null, "company_name": null, "author_code": "bacs00101", "author_name": "\u5442\u570b\u7def", "contract_code": null }] }] }, { "disc_id": "7", "album_id": "20", "disc_seq": "3", "disc_type_id": "1", "disc_type": "CD", "content": [{ "album_disc_content_id": "14", "song_seq": "1", "song_code": "bsc000019", "song_name": "\u5982\u679c\u6211\u5011\u9084\u5728\u4e00\u8d77", "song_name_en": "What If We", "isrc_id": "8", "isrc": "TWK231711104", "singer": "\u5b87\u5b99\u4eba", "contract_author_id": null, "is_debut": "1", "is_song_calc": "1", "is_song_right_calc": "0", "is_record_calc": "1", "is_record_right_calc": "1", "is_nm_song_calc": "1", "is_nm_record_calc": "1", "song_name_ext": null, "length": "235", "isrc_type": "\u6f14\u5531", "isrc_type_id": "1", "format_length": "03'55\"", "prepaid_count": 0, "righ_split": [{ "song_right_id": "40", "is_digital": "0", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "14", "isrc": "TWK231711104", "isrc_id": "8", "song_code": "bsc000019", "author": "\u6797\u5fe0\u8aed", "author_code": "bacs00086", "song_rights_type_id": "1", "song_rights_type": "\u8a5e", "split_ratio": "50.000%", "init_value": null, "selected_op_company_id": "1", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": null }, { "song_right_id": "41", "is_digital": "1", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "14", "isrc": "TWK231711104", "isrc_id": "8", "song_code": "bsc000019", "author": "\u6797\u5fe0\u8aed", "author_code": "bacs00086", "song_rights_type_id": "2", "song_rights_type": "\u66f2", "split_ratio": "35.000%", "init_value": null, "selected_op_company_id": "1", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "4", "settle_company_name": "SONY\u5531\u7247", "is_default": "0", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": null }, { "song_right_id": "42", "is_digital": "1", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "14", "isrc": "TWK231711104", "isrc_id": "8", "song_code": "bsc000019", "author": "\u65b9\u594e\u68e0", "author_code": "bacs00089", "song_rights_type_id": "2", "song_rights_type": "\u66f2", "split_ratio": "7.500%", "init_value": null, "selected_op_company_id": "1", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": null }], "reco_split": [{ "id": "39", "isrc_id": "8", "contract_author_id": "19", "subcontract_id": "17", "parent_author_id": "249", "author_id": "245", "company_id": "15", "numerator": "1", "denominator": "3", "isrc_ratio": "33.333", "company_code": "c0000015", "company_name": "\u76f8\u77e5\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "author_code": "bacs00086", "author_name": "\u6797\u5fe0\u8aed", "contract_code": "BA-QC-030\t-01" }, { "id": "40", "isrc_id": "8", "contract_author_id": "23", "subcontract_id": null, "parent_author_id": null, "author_id": "247", "company_id": "15", "numerator": "1", "denominator": "3", "isrc_ratio": "33.333", "company_code": "c0000015", "company_name": "\u76f8\u77e5\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "author_code": "bacs00088", "author_name": "\u9673\u594e\u8a00", "contract_code": "TA-Abcddrgfgjij-2020" }, { "id": "41", "isrc_id": "8", "contract_author_id": null, "subcontract_id": null, "parent_author_id": null, "author_id": "248", "company_id": null, "numerator": "1", "denominator": "3", "isrc_ratio": "33.333", "company_code": null, "company_name": null, "author_code": "bacs00089", "author_name": "\u65b9\u594e\u68e0", "contract_code": null }] }, { "album_disc_content_id": "16", "song_seq": "3", "song_code": "bsc000024", "song_name": "\u6211\u7684\u5fc3\u88e1\u5440", "song_name_en": null, "isrc_id": "10", "isrc": "TWK232082460", "singer": "\u9f13\u9f13 GBOYSWAG\t", "contract_author_id": "23", "is_debut": "1", "is_song_calc": "1", "is_song_right_calc": "1", "is_record_calc": "1", "is_record_right_calc": "1", "is_nm_song_calc": "1", "is_nm_record_calc": "1", "song_name_ext": null, "length": "122", "isrc_type": "\u6f14\u5531", "isrc_type_id": "1", "format_length": "02'02\"", "prepaid_count": 0, "righ_split": [{ "song_right_id": "54", "is_digital": "1", "is_entity": "0", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "16", "isrc": "TWK232082460", "isrc_id": "10", "song_code": "bsc000024", "author": "\u963f\u4fe1", "author_code": "bacs00003", "song_rights_type_id": "2", "song_rights_type": "\u66f2", "split_ratio": "30.000%", "init_value": null, "selected_op_company_id": null, "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": null, "settle_company_name": null, "is_default": "0", "song_right_effective": "0", "song_right_date_effective": "1", "op_company_name": null, "op_author_name": null, "sp_company_name": null }], "reco_split": [{ "id": "25", "isrc_id": "10", "contract_author_id": null, "subcontract_id": null, "parent_author_id": null, "author_id": "260", "company_id": null, "numerator": "1", "denominator": "1", "isrc_ratio": "100.000", "company_code": null, "company_name": null, "author_code": "bacs00101", "author_name": "\u5442\u570b\u7def", "contract_code": null }] }, { "album_disc_content_id": "13", "song_seq": "7", "song_code": "bsc000022", "song_name": "\u8d85\u5c55\u958b", "song_name_en": null, "isrc_id": "5", "isrc": "TWK231911704", "singer": "\u9f13\u9f13 GBOYSWAG\t", "contract_author_id": null, "is_debut": "0", "is_song_calc": "1", "is_song_right_calc": "1", "is_record_calc": "1", "is_record_right_calc": "1", "is_nm_song_calc": "1", "is_nm_record_calc": "1", "song_name_ext": null, "length": "211", "isrc_type": "\u6f14\u5531", "isrc_type_id": "1", "format_length": "03'31\"", "prepaid_count": 0, "righ_split": [{ "song_right_id": "47", "is_digital": "1", "is_entity": "0", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "13", "isrc": "TWK231911704", "isrc_id": "5", "song_code": "bsc000022", "author": "\u5442\u570b\u7def", "author_code": "bacs00101", "song_rights_type_id": "1", "song_rights_type": "\u8a5e", "split_ratio": "50.000%", "init_value": null, "selected_op_company_id": "1", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": null }, { "song_right_id": "48", "is_digital": "1", "is_entity": "1", "settle_album_prepaid_id": null, "settle_album_prepaid_right_id": null, "is_settled": null, "album_disc_content_id": "13", "isrc": "TWK231911704", "isrc_id": "5", "song_code": "bsc000022", "author": "\u5442\u570b\u7def", "author_code": "bacs00101", "song_rights_type_id": "2", "song_rights_type": "\u66f2", "split_ratio": "60.000%", "init_value": null, "selected_op_company_id": "1", "selected_op_author_id": null, "settle_author_id": null, "settle_author_name": null, "settle_company_id": "1", "settle_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "is_default": "1", "song_right_effective": "1", "song_right_date_effective": "0", "op_company_name": "\u76f8\u4fe1\u97f3\u6a02\u570b\u969b\u80a1\u4efd\u6709\u9650\u516c\u53f8", "op_author_name": null, "sp_company_name": null }], "reco_split": [{ "id": "49", "isrc_id": "5", "contract_author_id": "25", "subcontract_id": null, "parent_author_id": null, "author_id": "242", "company_id": null, "numerator": "1", "denominator": "2", "isrc_ratio": "50.000", "company_code": null, "company_name": null, "author_code": "bacs00083", "author_name": "\u9673\u4fe1\u5b8f", "contract_code": "BA-MD-010-01" }, { "id": "50", "isrc_id": "5", "contract_author_id": "28", "subcontract_id": null, "parent_author_id": null, "author_id": "260", "company_id": null, "numerator": "1", "denominator": "2", "isrc_ratio": "50.000", "company_code": null, "company_name": null, "author_code": "bacs00101", "author_name": "\u5442\u570b\u7def", "contract_code": "BA-LIU-2019" }] }] }] } };

  setTimeout(() => {
    return res.json(returnObj);
  }, 3000);
}

function getAlbumCopyAutoComplete(req, res) {
  let returnObj = {
    "data": {
      "count": 3,
      "data": [
        {
          "album_id": "16",
          "album_code": "BD0007.TW",
          "album_name_zh": "我不當人類拉! JOJO!",
          "seq": "1",
          "disc_id": "75",
          "count": "7",
          "disc": "Disc1 (7首)"
        },
        {
          "album_id": "16",
          "album_code": "BD0007.TW",
          "album_name_zh": "我不當人類拉! JOJO!",
          "seq": "2",
          "disc_id": "72",
          "count": "9",
          "disc": "Disc2 (9首)"
        },
        {
          "album_id": "16",
          "album_code": "BD0007.TW",
          "album_name_zh": "我不當人類拉! JOJO!",
          "seq": "3",
          "disc_id": "77",
          "count": "10",
          "disc": "Disc3 (10首)"
        }
      ]
    },
    "execution_time": "0.0426",
    "memory_usage": "3.83MB",
    "status_code": "00000000",
    "params": {
      "album_id": " 16"
    }
  };

  return res.json(returnObj);
}

function getRelatedAlbum(req, res) {
  let returnObj = {
    "data": {
      "count": 6,
      "data": [
        {
          "id": "1",
          "album_code": "BD000100",
          "album_name": "test 離開地球表面",
          "release_country_id": "229",
          "release_country": "台灣",
          "song_count": "17"
        },
        {
          "id": "2",
          "album_code": "BD000101",
          "album_name": "test 離開地球表面",
          "release_country_id": "229",
          "release_country": "台灣",
          "song_count": "17"
        },
        {
          "id": "3",
          "album_code": "BD000102",
          "album_name": "test 離開地球表面",
          "release_country_id": "229",
          "release_country": "台灣",
          "song_count": "17"
        },
        {
          "id": "4",
          "album_code": "BD000103",
          "album_name": "test 離開地球表面",
          "release_country_id": "229",
          "release_country": "台灣",
          "song_count": "17"
        },
        {
          "id": "5",
          "album_code": "BD000104",
          "album_name": "離開地球表面YO",
          "release_country_id": "229",
          "release_country": "台灣",
          "song_count": "17"
        },
      ]
    }
  };

  return res.json(returnObj);
}

function getSongSplit(req, res) {
  let returnObj = {
    "data": {
      "album_righ_split_ratio": [
        {
          "album_righ_split_ratio_id": "11",
          "company_id": "1",
          "author_id": null,
          "name": "相信音樂國際股份有限公司",
          "fraction": "39333/200000",
          "numerator": "39333",
          "denominator": "200000",
          "ratio": "19.667%",
          "rights_count": "0"
        },
        {
          "album_righ_split_ratio_id": "12",
          "company_id": null,
          "author_id": "10",
          "name": "個人本名1",
          "fraction": "11/200",
          "numerator": "11",
          "denominator": "200",
          "ratio": "5.500%",
          "rights_count": "0"
        }
      ],
      "count": 2,
      "total_ratio": "25.167%",
      "righ_count": "0",
      "righ_right_count": "0"
    }
  };

  return res.json(returnObj);
}

function getRecordSplit(req, res) {
  let returnObj = {
    "data": {
      "count": 2,
      "data": [
        {
          "author_id": "85",
          "author_name": "AdabudaAlibuda",
          "fraction": "1/4",
          "numerator": "1",
          "denominator": "4",
          "contract_code": "BA-DEV-002",
          "contract_author_id": "3",
          "company_id": "0",
          "company_name": null
        },
        {
          "author_id": "7",
          "author_name": "團體名3test",
          "fraction": "1/4",
          "numerator": "1",
          "denominator": "4",
          "contract_code": "BA-CP-010-1",
          "contract_author_id": "3",
          "company_id": "0",
          "company_name": null
        }
      ]
    }
  };

  return res.json(returnObj);
}

function getBelongAlbumInfo(req, res) {
  let returnObj = {
    "data": {
      "count": 4,
      "data": [
        {
          "id": "10",
          "is_debut": "0",
          "album_code": "BD000101",
          "album_name_zh": "test 離開地球表面",
          "album_name_en": "test",
          "company_nickname": "福茂",
          "release_date": "2020-07-20",
          "author": "五月天",
          "release_country": "台灣",
          "is_nm_record_calc": "0"
        },
        {
          "id": "11",
          "is_debut": "1",
          "album_code": "BD000102",
          "album_name_zh": "test 離開地球表面",
          "album_name_en": "test",
          "company_nickname": "福茂",
          "release_date": "2020-07-20",
          "author": "五月天",
          "release_country": "台灣",
          "is_nm_record_calc": "0"
        },
        {
          "id": "14",
          "is_debut": "1",
          "album_code": "BD000104",
          "album_name_zh": "離開地球表面YO",
          "album_name_en": "test",
          "company_nickname": "福茂",
          "release_date": "2020-07-20",
          "author": "五月天",
          "release_country": "台灣",
          "is_nm_record_calc": "0"
        },
        {
          "id": "19",
          "is_debut": "1",
          "album_code": "BBD0002",
          "album_name_zh": "album預覽",
          "album_name_en": null,
          "company_nickname": "福茂",
          "release_date": "2020-07-20",
          "author": "五月天",
          "release_country": "台灣",
          "is_nm_record_calc": "1"
        }
      ]
    },
    "execution_time": "0.0689",
    "memory_usage": "3.87MB",
    "status_code": "00000000",
    "params": {
      "keyword": "TWA000000008",
      "search_type": "isrc"
    }
  };

  return res.json(returnObj);
}

export default {
  'post   /album': getList,
  'get    /album': getAutoComplete,
  'get    /album/copy': getAlbumCopyAutoComplete,
  'get    /album/data': getInfo,
  'put    /album': updateData,
  'patch  /album': updateData,
  'get    /album/content': getContent,
  'patch  /album/content': updateData,
  'put    /album/content': updateData,
  'post   /album/copyDisc': updateData,
  'patch  /album/song_setting': updateData,
  'patch  /album/prepaid': updateData,
  'get    /album/related': getRelatedAlbum,
  'get    /album/righ_split': getSongSplit,
  'post   /album/righ_split': updateData,
  'get    /album/record_split': getRecordSplit,
  'post   /album/delete': updateData,
  'post   /album/record_split': updateData,
  'patch  /album/record_split': updateData,
  'get    /album/belong_album': getBelongAlbumInfo,
  'patch  /contract_author/specified_album': updateData,
  'post   /album/disc_delete': updateData,
  'post   /album/prepaid_delete': updateData,
}


