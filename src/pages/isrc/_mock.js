const getListData = {
  "data": {
    "total_items": 2,
    "data_list": [
      {
        "id": "547",                    // ISRC ID
        "isrc": "TWA450583635",         // ISRC
        "data_type": "1",               // 資料型式(1:Vocal, 2:Video)
        "song_name": "志明與春嬌",       // 歌曲名稱
        "song_id": "25",                // 歌曲ID
        "song_code": "bsc010004",       // 歌曲編號
        "singer": "五月天",              // 演唱人
        "isrc_type": null,              // 出版型態
        "release_date": "2005-05-27",   // 出版日期
        "version": null,                // 版別
        "length": null,                 // 歌曲長度(秒數)
        "split_num": "1",               // 分拆筆數
        "tape": [                       // 母帶歸屬
          "相信",
          "相信音樂"
        ]
      },
      {
        "id": "545",
        "isrc": "TWA450583633",
        "data_type": "1",
        "song_name": "憨人",
        "song_id": "45",
        "song_code": "bsc010026",
        "singer": "五月天",
        "isrc_type": null,
        "release_date": "2005-05-27",
        "version": null,
        "length": null,
        "split_num": "0",
        "tape": []
      }
    ]
  }
};

const getInfoData = {
  "data": {
    "id": "8",
    "isrc": "TWA450689710",  // ISRC
    "song_id": "29",  // 歌曲名稱 > song_id
    "song_name": "真面目",  // 歌曲名稱 > 歌曲名稱
    "song_code": "bsc012434",  // 歌曲名稱 > 歌曲 code
    "version": "eeewww",  // 錄音版別
    "belong_isrc": "",  // 模擬 ISRC
    "belong_isrc_show": "0",  // 報表以此 ISRC 表示
    "isrc_type_id": "1",  // 出版型態 > id (isrc_type.id)
    "isrc_type": "演唱會",  // 出版型態 > 型態 (isrc_type.type)
    "singer": "五月天feat.周杰倫",  // 演唱人；演唱人 id，getInfo 沒有，但新增要下，但編輯不用下 (author_id)
    "tape": [  // 母帶歸屬
      {
        "id": "25",
        "isrc_id": "1032",
        "company_id": "3",
        "company_nickname_id": "2",
        "company_code": "bcc0003",
        "company_nickname": "相信音樂"
      },
      {
        "id": "26",
        "isrc_id": "1032",
        "company_id": "4",
        "company_nickname_id": "3",
        "company_code": "bcc0004",
        "company_nickname": "汎亞"
      }
    ],
    "data_type": "1",  // 資料型式
    "arranger": "強辯樂團",  // 編曲
    "producer": "五月天怪獸+強辯",  // 製作
    "director": "aaa",  // 導演
    "length": "100",  // 秒數
    "release_date": "2020-12-31",  // 發行日期
    "belong_album_id": "176",  // 計算歸屬專輯 > id
    "album_name": 'test',  // 計算歸屬專輯 > 名稱
    "album_release_country": '台灣',  // 計算歸屬專輯 > 發行國家
    "album_code": 'bd123456',  // 計算歸屬專輯 > 專輯 code
    "is_settle": "1",  // 新媒體結算 > 錄音
    "release_area_type": "3",  // 可上架地區 > 類型 (1：無特定地區(只選國家)；2：只有特定地區(無國家)；3：地區包含特定國家；4：地區排除特定國家)
    "release_area_id": "2",  // 可上架地區 > 範圍 id
    "release_area_name": "全世界",  // 可上架地區 > 範圍名稱
    "release_country": [  // 可上架地區 > 特定地區
      {
        "id": "1",
        "country_id": "1"
      },
      {
        "id": "2",
        "country_id": "229"
      }
    ],
    "notes": "aaazzzzsss",  // 備註
    "created_by": "system",
    "created_at": "2020-08-28 15:34:04",
    "updated_by": null,
    "updated_at": "2020-08-28 15:34:04",
  },
  "execution_time": "0.2829",
  "memory_usage": "3.2MB",
  "status_code": "00000000",
  "params": {
    "id": "8"
  }
};

function getList(req, res) {
  return res.json(getListData);
}

function getInfo(req, res) {
  return res.json(getInfoData);
}

function updateDataForAdd(req, res) {
  setTimeout(() => {
    return res.json({
      data: {
        id: '123',
      }
    });
  }, 1000);
}

function updateData(req, res) {
  return res.json({});
}

function checkIsrcExists(req, res) {
  setTimeout(() => {
    return res.json({ data: 'OK' });
  }, 2000);
}

function getSplitInfo(req, res) {
  let returnObj = {
    "data": [
      {
        "id": "60",
        "isrc_id": "8",
        "contract_author_id": "9",
        "subcontract_id": null,
        "author_id": "6",
        "company_id": "16",
        "numerator": "1",
        "denominator": "2",
        "isrc_ratio": "50.000",
        "company_code": "c0000016",
        "company_name": "1234554321",
        "author_code": "bacs00006",
        "author_name": "團體名2",
        "contract_code": "BA-CP-010"
      },
      {
        "id": "61",
        "isrc_id": "8",
        "contract_author_id": "9",
        "subcontract_id": null,
        "author_id": "6",
        "company_id": "16",
        "numerator": "1",
        "denominator": "2",
        "isrc_ratio": "50.000",
        "company_code": "c0000016",
        "company_name": "1234554321",
        "author_code": "bacs00006",
        "author_name": "團體名2",
        "contract_code": "BA-CP-010"
      },
      {
        "id": "63",
        "isrc_id": "8",
        "contract_author_id": "9",
        "subcontract_id": null,
        "author_id": "6",
        "company_id": "2",
        "numerator": "1",
        "denominator": "2",
        "isrc_ratio": "50.000",
        "company_code": "c0000002",
        "company_name": "company_test_jie",
        "author_code": "bacs00006",
        "author_name": "團體名2",
        "contract_code": "BA-CP-010"
      }
    ]
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 2000);
}

function getSongMedia(req, res) {
  let returnObj = {
    "data": {
      "total_items": 1,
      "data_list": [
        {
          "id": "6006",
          "song_code": "bsc012432",
          "media_song_code": "1018320009",
          "media_song_name": "一半",
          "company_media_id": "16",
          "isrc": "TWA000000006",
          "code_short": "fm",
          "company_name": "friDay music"
        }
      ]
    },
    "execution_time": "0.0412",
    "memory_usage": "3.33MB",
    "status_code": "00000000",
    "params": {
      "isrc": "TWA000000006"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getAutocomplete(req, res) {
  let returnObj = {
    "data": [
      {
        "isrc_id": "1",
        "isrc": "T10000000001",
        "singer": "阿信",
        "song_id": "1",
        "song_code": "bsc050000",
        "song_name": "溫柔"
      },
      {
        "isrc_id": "2",
        "isrc": "TWA450479303",
        "singer": "五月天",
        "song_id": "1",
        "song_code": "bsc050000",
        "song_name": "溫柔"
      }
    ]
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getIsrcByAuthor(req, res) {
  let returnObj = {
    "data": {
      "total_items": 2,
      "data_list": [
        {
          "id": "5",
          "isrc": "TWK231900071",
          "data_type": "1",
          "song_name": "主謀",
          "song_id": "4",
          "song_code": "bsc050003",
          "singer": "鼓鼓 GBOYSWAG",
          "isrc_type": "演唱",
          "release_date": null,
          "version": "中國版",
          "length": "03'36\"",
          "belong_isrc": null,
          "split_num": "1",
          "tape": [
            "相信音樂國際股份有限公司"
          ]
        },
        {
          "id": "3",
          "isrc": "TWK231911704",
          "data_type": "2",
          "song_name": "超展開\t",
          "song_id": "3",
          "song_code": "bsc050002",
          "singer": "鼓鼓 GBOYSWAG",
          "isrc_type": "演唱",
          "release_date": "2019-11-18",
          "version": null,
          "length": "06'29\"",
          "belong_isrc": null,
          "split_num": "1",
          "tape": [
            "相信音樂國際股份有限公司"
          ]
        }
      ]
    },
    "execution_time": "0.1442",
    "memory_usage": "3.33MB",
    "status_code": "00000000",
    "params": {
      "author_id": "306",
      "page_current": "1",
      "page_size": "20"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

export default {
  'post   /isrc': getList,
  'get    /isrc/detail': getInfo,
  'put    /isrc': updateDataForAdd,
  'patch  /isrc': updateData,
  'get    /isrc/check_isrc_exists': checkIsrcExists,
  'get    /isrc/detail_split': getSplitInfo,
  'post   /isrc/delete_isrc': updateData,
  'post   /isrc/edit_split': updateData,
  'post   /isrc/reset_split': updateData,
  'get    /isrc/detail_song_media': getSongMedia,
  'get    /isrc': getAutocomplete,
  'post   /isrc/isrc_by_author': getIsrcByAuthor,
}