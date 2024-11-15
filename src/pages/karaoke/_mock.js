function getList(req, res) {
  const returnObj = {
    "data": {
      "total_item": 1,
      "list": [
        {
          "id": "2",
          "contract_code": "KS-237",
          "wave": "專",  // 波
          "name": "三人行/愷樂 Butterfly+鼓鼓+羅志祥",  // 產品名稱
          "user_company_id": "6",  // 使用者 - id
          "user_company_name": "Avex Taiwan Inc.",  // 使用者 - name
          "release_company_id": "7",  // 發行商 - id
          "release_company_name": "大潮音樂經紀有限公司",  // 發行商 - name
          "release_date": "2020-09-09",  // 發行日期
          "start_date": "2020-09-09",  // 專屬期限 - start
          "end_date": "2020-10-09",  // 專屬期限 - end
          "receivable_phase": "2018Q1",  // 收款期別
          "price": "200000",  // 售價
          "right_phase_id": "5",  // 詞曲計算期別
          "right_phase_start_date": "2019-01-01",
          "right_phase_end_date": "2019-06-30",
          "auth_fee": "120000",
          "syn_fee": "60000",
          "mech_adv": "30000",
          "flat_fee": "30000",
          "record_phase_id": "2",  // 錄音計算期別
          "record_phase_start_date": "2019-10-01",
          "record_phase_end_date": "2020-03-31",
          "singer_pay": "4142",
        }
      ]
    },
    "execution_time": "0.1346",
    "memory_usage": "3.34MB",
    "status_code": "00000000",
    "params": {
      "type": "name",
      "keyword": "b",
      "precise": "0",
      "release_date_start": "2020-09-08",
      "release_date_end": "2020-09-10",
      "start_date": "2020-09-08",
      "end_date": "2020-10-10"
    }
  };

  return res.json(returnObj);
}

function getInfo(req, res) {
  let returnObj = {
    "data": {
      "id": "2",
      "parent_id": "0",
      "type": "1",  // 類型
      "right_phase_id": "3",  // 詞曲計算期別
      "right_phase_start_date": "2019-01-01",
      "right_phase_end_date": "2019-06-30",
      "record_phase_id": "2",  // 錄音計算期別
      "record_phase_start_date": "2019-04-01",
      "record_phase_end_date": "2019-09-30",
      "contract_code": "KS-237",
      "name": "三人行/愷樂 Butterfly+鼓鼓+羅志祥",  // 產品名稱
      "receivable_phase": "2018Q1",  // 收款期別
      "user_company_id": "6",  // 使用者 - id
      "user_company_code": "c0000006",
      "user_company_name": "Avex Taiwan Inc.",  // 使用者 - name
      "release_company_id": "7",  // 發行商 - id
      "release_company_code": "c0000007",
      "release_company_name": "大潮音樂經紀有限公司",  // 發行商 - name
      "holder_company_id": "8",
      "holder_company_code": "c0000008",
      "holder_company_name": "EMI MS. PUB. (S.E.ASIA) Ltd., Taiwan Branch",
      "sold_date": "2020-09-08",
      "release_date": "2020-09-09",  // 發行日期
      "start_date": "2020-09-30",  // 專屬期限 - start
      "end_date": "2020-10-09",  // 專屬期限 - end
      "income_source": "1",
      "authorized_area_type": "3",
      "authorized_area_id": "28",
      "area_name": "台灣",
      "wave": "專",  // 波
      "distribution_format": "1",
      "album_id": "5",
      "album_code": "KGE0259DT",
      "album_name_zh": "十萬人出頭天 LIVE",
      "song_id": "1",
      "song_code": "bsc000006",
      "song_name": "Talking of mayday",
      "auth_fee": "120000",
      "syn_fee": "60000",
      "mech_adv": "30000",
      "flat_fee": "30000",
      "exclude_op": "1",
      "isrc_id": "9",
      "isrc": "TWK230801411",
      "isrc_singer": "廣告原唱",
      "isrc_version": null,
      "price": "200000",  // 售價
      "cost": "10000",
      "fee": "10",
      "tax_rate": "5",
      "singer_pay": "4142",
      "notes": "雖然是第二波，但是是非專屬授權",
      "eid": "1",
      "created_by": "10",
      "created_at": "2021-01-06 16:14:56",
      "updated_by": null,
      "updated_at": "0000-00-00 00:00:00",
      "authorized_country": [
        {
          "id": "89",
          "country_id": "1"
        },
        {
          "id": "90",
          "country_id": "2"
        },
        {
          "id": "91",
          "country_id": "3"
        }
      ],
      "song_rights": [
        {
          "song_right_id": "4301",
          "author_pen_name": "劉大偉",
          "song_right_type": "詞",
          "song_right_ratio": "50.000%",
          "default_settle_company": "1"
        },
        {
          "song_right_id": "4302",
          "author_pen_name": "Peter\"Boxsta\"Martin",
          "song_right_type": "曲",
          "song_right_ratio": "50.000%",
          "default_settle_company": "1"
        }
      ],
      "isrc_tape": [
        {
          "id": "2515",
          "company_nickname": "相信音樂國際股份有限公司"
        }
      ]
    }
  };

  return res.json(returnObj);
}

function getSongRights(req, res) {
  const returnObj = {
    "data": [
      {
        "song_right_id": "7068",
        "author_pen_name": "test",
        "song_right_type": "詞",
        "song_right_ratio": "50",
        "default_settle_company": null  // 是否為我方，我方為 '1'
      },
      {
        "song_right_id": "7069",
        "author_pen_name": "test",
        "song_right_type": "詞",
        "song_right_ratio": "50",
        "default_settle_company": "1"  // 是否為我方，我方為 '1'
      }
    ],
    "execution_time": "0.0922",
    "memory_usage": "3.55MB",
    "status_code": "00000000",
    "params": {
      "sold_date": "2021-01-15",
      "song_code": "bsc050008",
      "type": 1
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 2000);
}

function updateData(req, res) {
  return res.json({ data: '1' });
}

function getAvailableContractCode(req, res) {
  return res.json({
    data: {
      new_contract_code: 'test'
    }
  });
}

function importFile(req, res) {
  setTimeout(() => {
    return res.status(500).json({
      // "message": "{\"KS-TP-083\":\"\\u5408\\u7d04\\u7de8\\u865f: KS-TP-083 (\\u6b64\\u7de8\\u865f\\u5df2\\u5b58\\u5728)\",\"KS-TP-084\":\"\\u5408\\u7d04\\u7de8\\u865f: KS-TP-084 (\\u6b64\\u7de8\\u865f\\u5df2\\u5b58\\u5728)\"}"
      "message": "Call to undefined method Mod_authorized_country::get_by_country_codes()"
    });
  }, 3000);
}

export default {
  'post   /contract_karaoke/list': getList,
  'get    /contract_karaoke/view': getInfo,
  'post   /contract_karaoke/get_song_rights': getSongRights,
  'put    /contract_karaoke': updateData,
  'post   /contract_karaoke/delete': updateData,
  'patch  /contract_karaoke': updateData,
  'get    /contract_karaoke/available_contract_code': getAvailableContractCode,
  'patch  /contract_karaoke/settle_phase': updateData,
  'post   /contract_karaoke/import': importFile,
}