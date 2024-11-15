function getSettlePhaseInfo(req, res) {
  const returnObj = {
    "data": {
      "id": "1",
      "type": "1",
      "phase_start": "2019-01-01",
      "phase_end": "2019-06-30",
      "phase": "2019/01/01-2019/06/30",
      "is_next": "0"
    },
    "execution_time": "0.0467",
    "memory_usage": "3.14MB",
    "status_code": "00000000",
    "params": {
      "type": "1",
      "phase_type": "current"
    }
  };

  const returnObjNext = {
    "data": {
      "id": "2",
      "type": "1",
      "phase_start": "2019-07-01",
      "phase_end": "2019-12-31",
      "phase": "2019/07/01-2019/12/31",
      "is_next": "1"
    },
    "execution_time": "0.1280",
    "memory_usage": "3.14MB",
    "status_code": "00000000",
    "params": {
      "type": "1",
      "phase_type": "next"
    }
  };

  setTimeout(() => {
    returnObj.data.type = req.query.type;
    returnObjNext.data.type = req.query.type;

    if (req.query.phase_type == 'current') {
      return res.json(returnObj);
    } else {
      return res.json(returnObjNext);
    }
  }, 500);
}

function getSettlePhaseList(req, res) {
  const returnObj = {
    "data": [
      {
        "id": "107",
        "type": "1",
        "phase_start": "2020-01-01",
        "phase_end": "2020-06-30",
        "phase": "2020/01/01-2020/06/30",
        "phase_code": "20201H",
        "is_next": "0"
      },
      {
        "id": "102",
        "type": "1",
        "phase_start": "2019-07-01",
        "phase_end": "2019-12-31",
        "phase": "2019/07/01-2019/12/31",
        "phase_code": "20192H",
        "is_next": "0"
      },
      {
        "id": "97",
        "type": "1",
        "phase_start": "2019-01-01",
        "phase_end": "2019-06-30",
        "phase": "2019/01/01-2019/06/30",
        "phase_code": "20191H",
        "is_next": "0"
      },
      {
        "id": "92",
        "type": "1",
        "phase_start": "2018-07-01",
        "phase_end": "2018-12-31",
        "phase": "2018/07/01-2018/12/31",
        "phase_code": "20182H",
        "is_next": "0"
      },
      {
        "id": "87",
        "type": "1",
        "phase_start": "2018-01-01",
        "phase_end": "2018-06-30",
        "phase": "2018/01/01-2018/06/30",
        "phase_code": "20181H",
        "is_next": "0"
      },
      {
        "id": "82",
        "type": "1",
        "phase_start": "2017-07-01",
        "phase_end": "2017-12-31",
        "phase": "2017/07/01-2017/12/31",
        "phase_code": "20172H",
        "is_next": "0"
      },
      {
        "id": "77",
        "type": "1",
        "phase_start": "2017-01-01",
        "phase_end": "2017-06-30",
        "phase": "2017/01/01-2017/06/30",
        "phase_code": "20171H",
        "is_next": "0"
      },
      {
        "id": "72",
        "type": "1",
        "phase_start": "2016-07-01",
        "phase_end": "2016-12-31",
        "phase": "2016/07/01-2016/12/31",
        "phase_code": "20162H",
        "is_next": "0"
      },
      {
        "id": "67",
        "type": "1",
        "phase_start": "2016-01-01",
        "phase_end": "2016-06-30",
        "phase": "2016/01/01-2016/06/30",
        "phase_code": "20161H",
        "is_next": "0"
      },
      {
        "id": "62",
        "type": "1",
        "phase_start": "2015-07-01",
        "phase_end": "2015-12-31",
        "phase": "2015/07/01-2015/12/31",
        "phase_code": "20152H",
        "is_next": "0"
      },
      {
        "id": "57",
        "type": "1",
        "phase_start": "2015-01-01",
        "phase_end": "2015-06-30",
        "phase": "2015/01/01-2015/06/30",
        "phase_code": "20151H",
        "is_next": "0"
      },
      {
        "id": "52",
        "type": "1",
        "phase_start": "2014-07-01",
        "phase_end": "2014-12-31",
        "phase": "2014/07/01-2014/12/31",
        "phase_code": "20142H",
        "is_next": "0"
      },
      {
        "id": "47",
        "type": "1",
        "phase_start": "2014-01-01",
        "phase_end": "2014-06-30",
        "phase": "2014/01/01-2014/06/30",
        "phase_code": "20141H",
        "is_next": "0"
      },
      {
        "id": "42",
        "type": "1",
        "phase_start": "2013-07-01",
        "phase_end": "2013-12-31",
        "phase": "2013/07/01-2013/12/31",
        "phase_code": "20132H",
        "is_next": "0"
      },
      {
        "id": "37",
        "type": "1",
        "phase_start": "2013-01-01",
        "phase_end": "2013-06-30",
        "phase": "2013/01/01-2013/06/30",
        "phase_code": "20131H",
        "is_next": "0"
      },
      {
        "id": "32",
        "type": "1",
        "phase_start": "2012-07-01",
        "phase_end": "2012-12-31",
        "phase": "2012/07/01-2012/12/31",
        "phase_code": "20122H",
        "is_next": "0"
      },
      {
        "id": "27",
        "type": "1",
        "phase_start": "2012-01-01",
        "phase_end": "2012-06-30",
        "phase": "2012/01/01-2012/06/30",
        "phase_code": "20121H",
        "is_next": "0"
      },
      {
        "id": "22",
        "type": "1",
        "phase_start": "2011-07-01",
        "phase_end": "2011-12-31",
        "phase": "2011/07/01-2011/12/31",
        "phase_code": "20112H",
        "is_next": "0"
      },
      {
        "id": "17",
        "type": "1",
        "phase_start": "2011-01-01",
        "phase_end": "2011-06-30",
        "phase": "2011/01/01-2011/06/30",
        "phase_code": "20111H",
        "is_next": "0"
      },
      {
        "id": "12",
        "type": "1",
        "phase_start": "2010-07-01",
        "phase_end": "2010-12-31",
        "phase": "2010/07/01-2010/12/31",
        "phase_code": "20102H",
        "is_next": "0"
      },
      {
        "id": "7",
        "type": "1",
        "phase_start": "2010-01-01",
        "phase_end": "2010-06-30",
        "phase": "2010/01/01-2010/06/30",
        "phase_code": "20101H",
        "is_next": "0"
      },
      {
        "id": "4",
        "type": "1",
        "phase_start": "2009-07-01",
        "phase_end": "2009-12-31",
        "phase": "2009/07/01-2009/12/31",
        "phase_code": "20092H",
        "is_next": "0"
      },
      {
        "id": "1",
        "type": "1",
        "phase_start": "2009-01-01",
        "phase_end": "2009-06-30",
        "phase": "2009/01/01-2009/06/30",
        "phase_code": "20091H",
        "is_next": "0"
      },
      {
        "id": "119",
        "type": "1",
        "phase_start": "2008-07-01",
        "phase_end": "2008-12-31",
        "phase": "2008/07/01-2008/12/31",
        "phase_code": "20082H",
        "is_next": "0"
      },
      {
        "id": "118",
        "type": "1",
        "phase_start": "2008-01-01",
        "phase_end": "2008-06-30",
        "phase": "2008/01/01-2008/06/30",
        "phase_code": "20081H",
        "is_next": "0"
      },
      {
        "id": "117",
        "type": "1",
        "phase_start": "2007-07-01",
        "phase_end": "2007-12-31",
        "phase": "2007/07/01-2007/12/31",
        "phase_code": "20072H",
        "is_next": "0"
      },
      {
        "id": "116",
        "type": "1",
        "phase_start": "2007-01-01",
        "phase_end": "2007-06-30",
        "phase": "2007/01/01-2007/06/30",
        "phase_code": "20071H",
        "is_next": "0"
      },
      {
        "id": "115",
        "type": "1",
        "phase_start": "2006-07-01",
        "phase_end": "2006-12-31",
        "phase": "2006/07/01-2006/12/31",
        "phase_code": "20062H",
        "is_next": "0"
      }
    ]
  };

  returnObj.data = returnObj.data.map((elem) => ({ ...elem, type: req.query.type }))

  return res.json(returnObj);
}

function getList(req, res) {
  const returnObj = {
    "data": {
      "os": [
        {
          "file_id": "1304",
          "ext": "xlsx",
          "orig_name": "calc_reco_os_20190930",
          "file_name": "1304xlsx",
          "file_list_id": "41",
          "settle_phase_id": "105",
          "settle_type": "reco",
          "area": "os",
          "is_imported": "0",
          "row": null
        }
      ],
      "souv": [
        {
          "file_id": "1336",
          "ext": "xlsx",
          "orig_name": "calc_souv_20190630",
          "file_name": "1336xlsx",
          "file_list_id": "42",
          "settle_phase_id": "109",
          "settle_type": "souv",
          "area": "tw",
          "is_imported": "0",
          "row": null
        }
      ]
    }
  };

  return res.json(returnObj);
}

function uploadFile(req, res) {
  const returnObj = {
    "data": {
      "true": [
        {
          "result": true,
          "file_name": "calc_righ_os_20190630"
        }
      ],
      "false": [
        {
          "result": false,
          "file_name": "calc_righ_ext_20190630"
        },
        {
          "result": false,
          "file_name": "calc_righ_tw_20190630"
        }
      ]
    }
  };

  return res.json(returnObj);
}

function getMediaList(req, res) {
  const returnObj = {
    "data": {
      "count": 1,
      "data": [
        {
          "file_id": "420",
          "file_name": "nmb_righ_fm_tw_19Q3.xlsx",
          "report_total": "95411.00",
          "settle_total": "94223.78",
          "company_media_id": "16",
          "company_media": "friDay music",
          "file_list_id": "9",
          "settle_phase_id": "5",
          "settle_phase": "2020H1",
          "settle_type": "righ",
          "data_phase": "2019Q3",
          "country": "TW",
          "is_imported": "0",
          "is_calcu": "0",
          "match_status": "0",
          "check_status": "0",
          "is_tax_included": "1",
          "tax_rate": "5.400",
          "currency_id": "1",
          "currency_code": "TWD"
        },
        {
          "file_id": "422",
          "file_name": "nmb_righ_fm_tw_19Q2.xlsx",
          "report_total": "95411.00",
          "settle_total": "94223.78",
          "company_media_id": "16",
          "company_media": "Line",
          "file_list_id": "10",
          "settle_phase_id": "5",
          "settle_phase": "2020H1",
          "settle_type": "righ",
          "data_phase": "2019Q3",
          "country": "TW",
          "is_imported": "1",
          "is_calcu": "0",
          "match_status": "1",
          "check_status": "0",
          "is_tax_included": "1",
          "tax_rate": "5.400",
          "currency_id": "1",
          "currency_code": "TWD"
        }
      ]
    },
    "execution_time": "0.0634",
    "memory_usage": "3.76MB",
    "status_code": "00000000",
    "params": {
      "settle_phase_id": "5",
      "settle_type": "righ",
      "page_current": "0",
      "page_size": "20",
      "data_phase_start": "",
      "data_phase_end": "",
      "company_media_id": "16"
    }
  };

  return res.json(returnObj);
}

function getMediaOptions(req, res) {
  let returnObj = {};

  if (req.query.is_apple != '1') {
    returnObj = {
      "data": {
        "settle_phase": [
          {
            "id": "1",
            "type": "3",
            "phase_start": "2020-01-01",
            "phase_end": "2020-06-30",
            "phase": "2020/01/01-2020/06/30",
            "is_next": "0"
          },
          {
            "id": "11",
            "type": "3",
            "phase_start": "2019-12-01",
            "phase_end": "2019-12-31",
            "phase": "2019/12/01-2019/12/31",
            "is_next": "0"
          },
          {
            "id": "12",
            "type": "3",
            "phase_start": "2019-11-01",
            "phase_end": "2019-11-30",
            "phase": "2019/11/01-2019/11/30",
            "is_next": "0"
          },
          {
            "id": "13",
            "type": "3",
            "phase_start": "2019-10-01",
            "phase_end": "2019-10-31",
            "phase": "2019/10/01-2019/10/31",
            "is_next": "0"
          },
          {
            "id": "14",
            "type": "3",
            "phase_start": "2019-09-01",
            "phase_end": "2019-09-30",
            "phase": "2019/09/01-2019/09/30",
            "is_next": "0"
          }
        ],
        "country": [
          {
            "country": "TW"
          }
        ],
        "company": [
          {
            "id": "16",
            "company_name": "friDay music",
            "code_short": "fm",
            "code_long": "friDay music"
          }
        ]
      },
      "execution_time": "0.1333",
      "memory_usage": "3.75MB",
      "status_code": "00000000",
      "params": {
        "settle_type": "righ",
        "settle_phase_id": "5"
      }
    };
  } else {
    returnObj = {
      "data": {
        "settle_phase": [
          {
            "id": "2",
            "type": "4",
            "phase_start": "2020-04-01",
            "phase_end": "2020-12-31",
            "phase": "2020/04/01-2020/12/31",
            "phase_code": "2020Q2-2020Q4",
            "is_next": "1"
          },
          {
            "id": "1",
            "type": "4",
            "phase_start": "2019-10-01",
            "phase_end": "2020-03-31",
            "phase": "2019/10/01-2020/03/31",
            "phase_code": "2019Q4-2020Q1",
            "is_next": "0"
          },
          {
            "id": "106",
            "type": "4",
            "phase_start": "2019-04-01",
            "phase_end": "2019-09-30",
            "phase": "2019/04/01-2019/09/30",
            "phase_code": "2019Q2-2019Q3",
            "is_next": "0"
          },
          {
            "id": "101",
            "type": "4",
            "phase_start": "2018-10-01",
            "phase_end": "2019-03-31",
            "phase": "2018/10/01-2019/03/31",
            "phase_code": "2018Q4-2019Q1",
            "is_next": "0"
          },
          {
            "id": "96",
            "type": "4",
            "phase_start": "2018-04-01",
            "phase_end": "2018-09-30",
            "phase": "2018/04/01-2018/09/30",
            "phase_code": "2018Q2-2018Q3",
            "is_next": "0"
          },
          {
            "id": "91",
            "type": "4",
            "phase_start": "2017-10-01",
            "phase_end": "2018-03-31",
            "phase": "2017/10/01-2018/03/31",
            "phase_code": "2017Q4-2018Q1",
            "is_next": "0"
          },
          {
            "id": "86",
            "type": "4",
            "phase_start": "2017-04-01",
            "phase_end": "2017-09-30",
            "phase": "2017/04/01-2017/09/30",
            "phase_code": "2017Q2-2017Q3",
            "is_next": "0"
          },
          {
            "id": "81",
            "type": "4",
            "phase_start": "2016-10-01",
            "phase_end": "2017-03-31",
            "phase": "2016/10/01-2017/03/31",
            "phase_code": "2016Q4-2017Q1",
            "is_next": "0"
          },
          {
            "id": "76",
            "type": "4",
            "phase_start": "2016-04-01",
            "phase_end": "2016-09-30",
            "phase": "2016/04/01-2016/09/30",
            "phase_code": "2016Q2-2016Q3",
            "is_next": "0"
          },
          {
            "id": "71",
            "type": "4",
            "phase_start": "2015-10-01",
            "phase_end": "2016-03-31",
            "phase": "2015/10/01-2016/03/31",
            "phase_code": "2015Q4-2016Q1",
            "is_next": "0"
          },
          {
            "id": "66",
            "type": "4",
            "phase_start": "2015-04-01",
            "phase_end": "2015-09-30",
            "phase": "2015/04/01-2015/09/30",
            "phase_code": "2015Q2-2015Q3",
            "is_next": "0"
          },
          {
            "id": "61",
            "type": "4",
            "phase_start": "2014-10-01",
            "phase_end": "2015-03-31",
            "phase": "2014/10/01-2015/03/31",
            "phase_code": "2014Q4-2015Q1",
            "is_next": "0"
          },
          {
            "id": "56",
            "type": "4",
            "phase_start": "2014-04-01",
            "phase_end": "2014-09-30",
            "phase": "2014/04/01-2014/09/30",
            "phase_code": "2014Q2-2014Q3",
            "is_next": "0"
          },
          {
            "id": "51",
            "type": "4",
            "phase_start": "2013-10-01",
            "phase_end": "2014-03-31",
            "phase": "2013/10/01-2014/03/31",
            "phase_code": "2013Q4-2014Q1",
            "is_next": "0"
          },
          {
            "id": "46",
            "type": "4",
            "phase_start": "2013-04-01",
            "phase_end": "2013-09-30",
            "phase": "2013/04/01-2013/09/30",
            "phase_code": "2013Q2-2013Q3",
            "is_next": "0"
          },
          {
            "id": "41",
            "type": "4",
            "phase_start": "2012-10-01",
            "phase_end": "2013-03-31",
            "phase": "2012/10/01-2013/03/31",
            "phase_code": "2012Q4-2013Q1",
            "is_next": "0"
          },
          {
            "id": "36",
            "type": "4",
            "phase_start": "2012-04-01",
            "phase_end": "2012-09-30",
            "phase": "2012/04/01-2012/09/30",
            "phase_code": "2012Q2-2012Q3",
            "is_next": "0"
          },
          {
            "id": "31",
            "type": "4",
            "phase_start": "2011-10-01",
            "phase_end": "2012-03-31",
            "phase": "2011/10/01-2012/03/31",
            "phase_code": "2011Q4-2012Q1",
            "is_next": "0"
          },
          {
            "id": "26",
            "type": "4",
            "phase_start": "2011-04-01",
            "phase_end": "2011-09-30",
            "phase": "2011/04/01-2011/09/30",
            "phase_code": "2011Q2-2011Q3",
            "is_next": "0"
          },
          {
            "id": "21",
            "type": "4",
            "phase_start": "2010-10-01",
            "phase_end": "2011-03-31",
            "phase": "2010/10/01-2011/03/31",
            "phase_code": "2010Q4-2011Q1",
            "is_next": "0"
          },
          {
            "id": "15",
            "type": "4",
            "phase_start": "2010-01-01",
            "phase_end": "2010-09-30",
            "phase": "2010/01/01-2010/09/30",
            "phase_code": "2010Q1-2010Q3",
            "is_next": "0"
          }
        ],
        "company": [
          {
            "id": "16",
            "company_name": "friDay music",
            "code_short": "fm",
            "code_long": "friDay music"
          },
          {
            "id": "46",
            "company_name": "騰訊",
            "code_short": "tx",
            "code_long": "Teng Xun"
          }
        ]
      }
    };
  }


  return res.json(returnObj);
}

function getMediaSongMatchList(req, res) {
  const returnObj = {
    "data": {
      "total_items": 418,
      "data_list": [
        {
          "id": "1",
          "song_media_id": null,
          "media_song_code": "1250125004",
          "media_song_name": "「夏天啊別中止這份心情～You're Romantic～」(Instrumental)",
          "media_isrc": "JPJ221500748",
          "singer": "flumpool",
          "song_code": "bsc011829",
          "song_name": "ナツヨトメナイデ～ユーアーロマンティック～",
          "isrc": "JPJ221500748"
        },
        {
          "id": "2",
          "song_media_id": null,
          "media_song_code": "1255599001",
          "media_song_name": "Angel Eyes-Kang Mi-jin",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "3",
          "song_media_id": null,
          "media_song_code": "1017175001",
          "media_song_name": "Beautiful",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "4",
          "song_media_id": null,
          "media_song_code": "1222925002",
          "media_song_name": "Come to Mami (feat. MP魔幻力量)",
          "media_isrc": "TWL251402102",
          "singer": "袁詠琳",
          "song_code": "bsc011638",
          "song_name": "Come to Mami",
          "isrc": "TWL251402102"
        },
        {
          "id": "5",
          "song_media_id": null,
          "media_song_code": "1255599010",
          "media_song_name": "Concerto for Piano and Orchestra No. 3 in D major, BWV 1054 - III. Allegro",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "6",
          "song_media_id": null,
          "media_song_code": "1211119006",
          "media_song_name": "Dangerous【電影[逆轉勝]配樂】",
          "media_isrc": "TWK231408506",
          "singer": null,
          "song_code": "bsc011581",
          "song_name": "Dangerous",
          "isrc": "TWK231408506"
        },
        {
          "id": "7",
          "song_media_id": null,
          "media_song_code": "1017121030",
          "media_song_name": "Enrich Your Life 讓我照顧你",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "8",
          "song_media_id": null,
          "media_song_code": "1255599020",
          "media_song_name": "Epilogue",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "12",
          "song_media_id": null,
          "media_song_code": "1016555001",
          "media_song_name": "Happy.Birth.Day",
          "media_isrc": "TWA450600009",
          "singer": "五月天阿信",
          "song_code": "bsc010134",
          "song_name": "HAPPY BIRTHDAY",
          "isrc": "TWA450600009"
        },
        {
          "id": "11",
          "song_media_id": null,
          "media_song_code": "1566741001",
          "media_song_name": "happy.BIRTH.day",
          "media_isrc": "TWA450600009",
          "singer": "五月天阿信",
          "song_code": "bsc010134",
          "song_name": "HAPPY BIRTHDAY",
          "isrc": "TWA450600009"
        },
        {
          "id": "10",
          "song_media_id": null,
          "media_song_code": "1016787001",
          "media_song_name": "happy.BIRTH.day",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "9",
          "song_media_id": null,
          "media_song_code": "1018333012",
          "media_song_name": "Happy.Birth.Day",
          "media_isrc": "TWA450600009",
          "singer": "五月天阿信",
          "song_code": "bsc010134",
          "song_name": "HAPPY BIRTHDAY",
          "isrc": "TWA450600009"
        },
        {
          "id": "13",
          "song_media_id": null,
          "media_song_code": "1564880001",
          "media_song_name": "Heaven",
          "media_isrc": "TWI851811001",
          "singer": "PEACE靖",
          "song_code": "bsc011790",
          "song_name": "HEAVEN",
          "isrc": "TWI851811001"
        },
        {
          "id": "17",
          "song_media_id": null,
          "media_song_code": "1017121021",
          "media_song_name": "HoSee",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "16",
          "song_media_id": null,
          "media_song_code": "1017269003",
          "media_song_name": "HOSEE",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "15",
          "song_media_id": null,
          "media_song_code": "1017289009",
          "media_song_name": "Hosee",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "14",
          "song_media_id": null,
          "media_song_code": "1017273003",
          "media_song_name": "HOSEE",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "19",
          "song_media_id": null,
          "media_song_code": "1017208014",
          "media_song_name": "HoSee(Live版)",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "18",
          "song_media_id": null,
          "media_song_code": "1017233003",
          "media_song_name": "HOSEE(Live版)",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "21",
          "song_media_id": null,
          "media_song_code": "1017119026",
          "media_song_name": "I Love You 無望",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        }
      ],
      "data_phase": "2019Q3",
      "settle_phase": "2019/01/01-2019/01/31",
      "settle_type": "righ",
      "file_list_id": "10",
      "file_name": "nmb_righ_lm_tw_19Q3.xlsx",
      "company_media_id": "61",
      "company_name": "LINE MUSIC"
    },
    "execution_time": "0.0857",
    "memory_usage": "3.24MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "file_list_id": "10",
      "company_media_id": "61"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 500);
}

function updateData(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

function markAsAlbum(req, res) {
  const returnObj = {
    "data": {
      "total_items": 418,
      "data_list": [
        {
          "id": "1",
          "song_media_id": null,
          "media_song_code": "1250125004",
          "media_song_name": "「夏天啊別中止這份心情～You're Romantic～」(Instrumental)",
          "media_isrc": "JPJ221500748",
          "singer": "flumpool",
          "song_code": "bsc011829",
          "song_name": "ナツヨトメナイデ～ユーアーロマンティック～",
          "isrc": "JPJ221500748"
        },
        {
          "id": "2",
          "song_media_id": null,
          "media_song_code": "1255599001",
          "media_song_name": "Angel Eyes-Kang Mi-jin",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "3",
          "song_media_id": null,
          "media_song_code": "1017175001",
          "media_song_name": "Beautiful",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "4",
          "song_media_id": null,
          "media_song_code": "1222925002",
          "media_song_name": "Come to Mami (feat. MP魔幻力量)",
          "media_isrc": "TWL251402102",
          "singer": "袁詠琳",
          "song_code": "bsc011638",
          "song_name": "Come to Mami",
          "isrc": "TWL251402102"
        },
        {
          "id": "5",
          "song_media_id": null,
          "media_song_code": "1255599010",
          "media_song_name": "Concerto for Piano and Orchestra No. 3 in D major, BWV 1054 - III. Allegro",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "6",
          "song_media_id": null,
          "media_song_code": "1211119006",
          "media_song_name": "Dangerous【電影[逆轉勝]配樂】",
          "media_isrc": "TWK231408506",
          "singer": null,
          "song_code": "bsc011581",
          "song_name": "Dangerous",
          "isrc": "TWK231408506"
        },
        {
          "id": "7",
          "song_media_id": null,
          "media_song_code": "1017121030",
          "media_song_name": "Enrich Your Life 讓我照顧你",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "8",
          "song_media_id": null,
          "media_song_code": "1255599020",
          "media_song_name": "Epilogue",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "12",
          "song_media_id": null,
          "media_song_code": "1016555001",
          "media_song_name": "Happy.Birth.Day",
          "media_isrc": "TWA450600009",
          "singer": "五月天阿信",
          "song_code": "bsc010134",
          "song_name": "HAPPY BIRTHDAY",
          "isrc": "TWA450600009"
        },
        {
          "id": "11",
          "song_media_id": null,
          "media_song_code": "1566741001",
          "media_song_name": "happy.BIRTH.day",
          "media_isrc": "TWA450600009",
          "singer": "五月天阿信",
          "song_code": "bsc010134",
          "song_name": "HAPPY BIRTHDAY",
          "isrc": "TWA450600009"
        },
        {
          "id": "10",
          "song_media_id": null,
          "media_song_code": "1016787001",
          "media_song_name": "happy.BIRTH.day",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "9",
          "song_media_id": null,
          "media_song_code": "1018333012",
          "media_song_name": "Happy.Birth.Day",
          "media_isrc": "TWA450600009",
          "singer": "五月天阿信",
          "song_code": "bsc010134",
          "song_name": "HAPPY BIRTHDAY",
          "isrc": "TWA450600009"
        },
        {
          "id": "13",
          "song_media_id": null,
          "media_song_code": "1564880001",
          "media_song_name": "Heaven",
          "media_isrc": "TWI851811001",
          "singer": "PEACE靖",
          "song_code": "bsc011790",
          "song_name": "HEAVEN",
          "isrc": "TWI851811001"
        },
        {
          "id": "17",
          "song_media_id": null,
          "media_song_code": "1017121021",
          "media_song_name": "HoSee",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "16",
          "song_media_id": null,
          "media_song_code": "1017269003",
          "media_song_name": "HOSEE",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "15",
          "song_media_id": null,
          "media_song_code": "1017289009",
          "media_song_name": "Hosee",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "14",
          "song_media_id": null,
          "media_song_code": "1017273003",
          "media_song_name": "HOSEE",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "19",
          "song_media_id": null,
          "media_song_code": "1017208014",
          "media_song_name": "HoSee(Live版)",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "18",
          "song_media_id": null,
          "media_song_code": "1017233003",
          "media_song_name": "HOSEE(Live版)",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        },
        {
          "id": "21",
          "song_media_id": null,
          "media_song_code": "1017119026",
          "media_song_name": "I Love You 無望",
          "media_isrc": null,
          "singer": null,
          "song_code": null,
          "song_name": null,
          "isrc": null
        }
      ],
      "data_phase": "2019Q3",
      "settle_phase": "2019/01/01-2019/01/31",
      "settle_type": "righ",
      "file_list_id": "10",
      "file_name": "nmb_righ_lm_tw_19Q3.xlsx",
      "company_media_id": "61",
      "company_name": "LINE MUSIC"
    },
    "execution_time": "0.1598",
    "memory_usage": "3.24MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "file_list_id": "10",
      "company_media_id": "61"
    }
  };

  const returnObj2 = { data: '認作專輯完成' };

  return res.json(returnObj);
}

function getCheckReport(req, res) {
  const returnObj = {
    "data": [
      {
        "id": "1",
        "settle_type": "righ",
        "data_phase": "2019Q4",
        "tax_rate": null,
        "report_origin": "111480.112",
        "report_tw": "111480.112",
        "import_origin": "111480.112",
        "import_tw": "111480.112",
        "income_origin": "111480.112",
        "income_tw": "111480.112",
        "calculate_tw": "111477.983",
        "settle_tw": "49670.480",
        "not_our_song_tw": "2.130",
        "not_our_rights_tw": "30796.220",
        "not_split_tw": null,
        "part_not_split_tw": null,
        "part_split_tw": null,
        "complete_split_tw": null,
        "not_settle_tw": "26559.850",
        "difference": "61809.632",
        "country": "US",
        "currency_id": "1",
        "type": "3",
        "settle_phase_start": "2019-01-01",
        "settle_phase_end": "2019-01-31",
        "settle_phase": "2019/01/01-2019/01/31",
        "file_name": "nmb_righ_fm_tw_19Q4.xlsx",
        "company_name": "friDay music",
        "code_short": "fm",
        "currency_code": "TWD",
        "currency_name": "台幣",
        "exchange_rate": null,
        "import_song_num": "685",
        "calculate_song_num": "271",
        "file_list_id": "1"
      }
    ],
    "execution_time": "0.0618",
    "memory_usage": "3.58MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "file_list_id": "1",
      "company_media_id": "16"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 2000);
}

function getSheetList(req, res) {
  const returnObj = {
    "data": [
      {
        "sheet_name": "(3)Bin相信音樂",
        "sheet_total": "222960.22",
        "balance_total": "114716.40"
      },
      {
        "sheet_name": "(2)Bin相信音樂",
        "sheet_total": "22960.22",
        "balance_total": "14716.40"
      },
    ],
    "execution_time": "0.0687",
    "memory_usage": "3.56MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "file_list_id": "1",
      "company_media_id": "16"
    }
  };

  return res.json(returnObj);
}

function getSongList(req, res) {
  let returnObj = {
    "data": {
      "total_items": 1786,
      "total_price": 1564.78,
      "data_list": [
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",  // 平台編號
          "clientname": "",  // 平台歌名
          "singer": "",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "【萧帮】第七章 嘉义邹族传统祭典展开 萧帮加入一起Party all night",
          "singer": "萧秉治（廷廷）",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0009",
          "downloadtimes_amount": "3"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "【萧帮】第九章 想住宜兰豪华露营车 要先服务大牌明星贵客",
          "singer": "萧秉治（廷廷）",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0026",
          "downloadtimes_amount": "8"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "【萧帮】第二章 花莲 金针花海开满山 一起品尝六十旦山忘忧料理",
          "singer": "萧秉治（廷廷）",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0014",
          "downloadtimes_amount": "4"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "【萧帮】第八章 台南生态民宿出考题 钓鱼坐竹筏晒盐田挑战体力",
          "singer": "萧秉治（廷廷）",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0129",
          "downloadtimes_amount": "41"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "1+1+1",
          "singer": "品冠",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "101",
          "singer": "梁静茹",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "1234",
          "singer": "强辩乐团",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "17号（但梦只会更远）",
          "singer": "品冠",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "2012",
          "singer": "五月天",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "24小时疯狂",
          "singer": "陈乃荣",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "36℃",
          "singer": "flumpool",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "50个或许",
          "singer": "家家",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "A Falling Star",
          "singer": "Jeff Li",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "Across the Times",
          "singer": "flumpool",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "Across the Timess",
          "singer": "flumpool",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "Again",
          "singer": "品冠",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "AM 6:00",
          "singer": "八三夭乐团",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "And I Love You So",
          "singer": "品冠",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        },
        {
          "code_short": "tx",
          "data_phase": "19Q2",
          "settle_type": "reco",
          "clientcode": "",
          "clientname": "Angel Eyes",
          "singer": "강미진",
          "is_ours": "0",
          "is_album": "0",
          "song_code": null,
          "income_amount_untax": "0.0000",
          "downloadtimes_amount": "0"
        }
      ]
    }
  };

  if (req.body.search_type == 'not_settle') {
    returnObj = {
      "data": {
        "total_items": 9,
        "total_price": 14.14,
        "data_list": [
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "31",
            "song_code": "bsc010009",
            "song_name": "愛情的模樣",
            "song_type_id": "4",
            "isrc_id": "1781",
            "isrc": "TWK231912126",
            "singer": "五月天 feat. 田馥甄",
            "isrc_type_id": "8",
            "song_type": "演唱會",
            "isrc_settle_split_total": "50.000",
            "is_split": "1",
            "is_settle": "0",
            "is_ours": "1",
            "income_amount_untax": "0.1125",
            "isrc_split_ratio": "0.500",
            "settle_amount": "0.0563",
            "difference_amount": "0.0563"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "181",
            "song_code": "bsc010174",
            "song_name": "101",
            "song_type_id": null,
            "isrc_id": "1533",
            "isrc": "TWK240700903",
            "singer": "梁靜茹",
            "isrc_type_id": "4",
            "song_type": "MV+卡拉ok",
            "isrc_settle_split_total": null,
            "is_split": "0",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.0955",
            "isrc_split_ratio": null,
            "settle_amount": null,
            "difference_amount": "0.0955"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "184",
            "song_code": "bsc010177",
            "song_name": "C'est La Vie",
            "song_type_id": null,
            "isrc_id": "1534",
            "isrc": "TWK240700902",
            "singer": "梁靜茹",
            "isrc_type_id": "4",
            "song_type": "MV+卡拉ok",
            "isrc_settle_split_total": null,
            "is_split": "0",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.3381",
            "isrc_split_ratio": null,
            "settle_amount": null,
            "difference_amount": "0.3381"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "185",
            "song_code": "bsc010178",
            "song_name": "Darling",
            "song_type_id": null,
            "isrc_id": "3510",
            "isrc": "TWA460689105",
            "singer": "品冠",
            "isrc_type_id": "4",
            "song_type": "MV+卡拉ok",
            "isrc_settle_split_total": null,
            "is_split": "0",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.0275",
            "isrc_split_ratio": null,
            "settle_amount": null,
            "difference_amount": "0.0275"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "222",
            "song_code": "bsc010217",
            "song_name": "Just When I Needed You Most",
            "song_type_id": null,
            "isrc_id": "1539",
            "isrc": "TWK240700801",
            "singer": "品冠",
            "isrc_type_id": "2",
            "song_type": "MV",
            "isrc_settle_split_total": null,
            "is_split": "0",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.0187",
            "isrc_split_ratio": null,
            "settle_amount": null,
            "difference_amount": "0.0187"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "251",
            "song_code": "bsc010246",
            "song_name": "私奔到月球",
            "song_type_id": null,
            "isrc_id": "1779",
            "isrc": "TWK231912128",
            "singer": "五月天 feat. 陳綺貞",
            "isrc_type_id": "3",
            "song_type": "演唱會",
            "isrc_settle_split_total": "50.000",
            "is_split": "1",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.1125",
            "isrc_split_ratio": "0.500",
            "settle_amount": "0.0563",
            "difference_amount": "0.0563"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "322",
            "song_code": "bsc010321",
            "song_name": "離開地球表面",
            "song_type_id": null,
            "isrc_id": "1778",
            "isrc": "TWK231912129",
            "singer": "五月天 feat. 李榮浩",
            "isrc_type_id": "3",
            "song_type": "演唱會",
            "isrc_settle_split_total": "50.000",
            "is_split": "1",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.1125",
            "isrc_split_ratio": "0.500",
            "settle_amount": "0.0563",
            "difference_amount": "0.0563"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "446",
            "song_code": "bsc010477",
            "song_name": "比想像更想你",
            "song_type_id": null,
            "isrc_id": "1365",
            "isrc": "TWK240901921",
            "singer": "品冠",
            "isrc_type_id": "4",
            "song_type": "MV+卡拉ok",
            "isrc_settle_split_total": null,
            "is_split": "0",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.0439",
            "isrc_split_ratio": null,
            "settle_amount": null,
            "difference_amount": "0.0439"
          },
          {
            "code_short": "tx",
            "data_phase": "19Q2",
            "settle_type": "reco",
            "song_id": "506",
            "song_code": "bsc010539",
            "song_name": "K歌情人",
            "song_type_id": null,
            "isrc_id": "1536",
            "isrc": "TWK240700813",
            "singer": "品冠+梁靜茹",
            "isrc_type_id": "4",
            "song_type": "MV+卡拉ok",
            "isrc_settle_split_total": null,
            "is_split": "0",
            "is_settle": "1",
            "is_ours": "1",
            "income_amount_untax": "0.6311",
            "isrc_split_ratio": null,
            "settle_amount": null,
            "difference_amount": "0.6311"
          },
        ]
      }
    };
  }

  return res.json(returnObj);
}

function getPrepaidList(req, res) {
  const returnObj = {
    "data": {
      "tw": [
        {
          "id": "520",
          "album_name": "愛到不要命",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-04-02",
          "author": "丁噹",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "519",
          "album_name": "愛到不要命",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-04-02",
          "author": "丁噹",
          "version": "限定版",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "502",
          "album_name": "查無此人",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-04-27",
          "author": "群星",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "501",
          "album_name": "查無此人",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-04-27",
          "author": "群星",
          "version": "限定版",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "500",
          "album_name": "五月天 / 人生無限公司 LiFE LiVE 3CD",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-05",
          "author": "五月天",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "499",
          "album_name": "五月天 / 人生無限公司 LiFE LiVE 3CD",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-05",
          "author": "五月天",
          "version": "預購限定版",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "498",
          "album_name": "出發電影原聲專輯",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-13",
          "author": "乱彈阿翔 Luantan Ascent",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "449",
          "album_name": "現在就讓我飛",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-07",
          "author": "黃奕儒Ezu,宇宙人Cosmos People",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "448",
          "album_name": "倒轉",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-01-17",
          "author": "黃奕儒Ezu Feat. (八三夭阿璞 & SpeXial 林子閎)",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "447",
          "album_name": "私奔到月球",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-02-12",
          "author": "黃奕儒Ezu,家家JiaJia",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "446",
          "album_name": "十字路口",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-21",
          "author": "黃奕儒Ezu",
          "version": "live",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "445",
          "album_name": "Ms.Flight",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-04-24",
          "author": "黃奕儒Ezu",
          "version": "live",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "444",
          "album_name": "我怎能留下你",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-08",
          "author": "黃奕儒Ezu",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "443",
          "album_name": "純真",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-16",
          "author": "黃奕儒Ezu",
          "version": "致敬MaydayBlue20th",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "442",
          "album_name": "不再孤單",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-17",
          "author": "黃奕儒Ezu",
          "version": "live",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "418",
          "album_name": "I Miss You",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-29",
          "author": "蕭秉治 Xiao Bing Chih",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "417",
          "album_name": "樂人+Live 白安“我們的時代1990s”新歌首唱會",
          "release_country_id": "44",
          "release_country": "中國",
          "release_date": "2019-04-03",
          "author": "白安",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "416",
          "album_name": "凡人",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-29",
          "author": "蕭秉治 (ティンティン)",
          "version": "日文版",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "415",
          "album_name": "五月天 人生無限公司 LiFE LiVE 好友加班篇",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-15",
          "author": "五月天",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "414",
          "album_name": "五月天 人生無限公司 LiFE LiVE 完整收錄篇",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-23",
          "author": "五月天",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "413",
          "album_name": "HELP",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-05",
          "author": "flumpool",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "372",
          "album_name": "一半人生",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-01-15",
          "author": "阿信",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "371",
          "album_name": "一桌菜",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-01-31",
          "author": "宇宙人",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "370",
          "album_name": "K.O.",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-15",
          "author": "鼓鼓 呂思緯Feat.蕭秉治",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "369",
          "album_name": "陪我玩",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-14",
          "author": "宇宙人",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "368",
          "album_name": "不要命",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-20",
          "author": "丁噹 feat. J.Sheon",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "367",
          "album_name": "每個瞬間",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-06",
          "author": "乱彈阿翔 Luantan Ascent",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "366",
          "album_name": "隱形的紀念",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-04-27",
          "author": "阿信",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "365",
          "album_name": "純真 #MaydayBlue20th",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-06",
          "author": "五月天",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "364",
          "album_name": "何妨 feat.茄子蛋",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-17",
          "author": "家家 Jia Jia、茄子蛋 EggPlantEgg",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "363",
          "album_name": "就讓我像個孩子一樣",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-19",
          "author": "白安",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "362",
          "album_name": "紅色的狂想",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-26",
          "author": "白安",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "361",
          "album_name": "吾愛無愛",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-02",
          "author": "白安",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "360",
          "album_name": "所愛之初",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-09",
          "author": "白安",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "359",
          "album_name": "不安於世",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-16",
          "author": "白安",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1100",
          "album_name": "聆聽花開的聲音",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-01-18",
          "author": "群星",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1037",
          "album_name": "Apprentice",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-29",
          "author": "HiJack",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1016",
          "album_name": "漸近線",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-22",
          "author": "青虫 aoi",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        }
      ],
      "ext": [
        {
          "id": "954",
          "album_name": "崇拜",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-01-29",
          "author": "李佳歡",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "912",
          "album_name": "魏嘉瑩12/28台中Legacy演唱會",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-22",
          "author": "魏嘉瑩",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "895",
          "album_name": "囉哩叭唆",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-18",
          "author": "陳嘉樺 (Ella Chen)",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1145",
          "album_name": "查無此人",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-14",
          "author": "群星",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1078",
          "album_name": "Lost & Found",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-01-04",
          "author": "楊永聰",
          "version": "首批限量精裝版",
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1075",
          "album_name": "路過人間",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-05-03",
          "author": "郁可唯",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1066",
          "album_name": "趨光",
          "release_country_id": "44",
          "release_country": "中國",
          "release_date": "2019-06-28",
          "author": "陳楚生",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1064",
          "album_name": "別讓我走遠 (電視劇我們與惡的距離主題曲)",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-24",
          "author": "林宥嘉",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "69",
          "album_name": "「一事無成的偉大」新歌加精選CD2",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-03-27",
          "author": "八三夭",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        },
        {
          "id": "1001",
          "album_name": "豚愛特攻隊",
          "release_country_id": "229",
          "release_country": "台灣",
          "release_date": "2019-06-19",
          "author": "イルカポリス海豚刑警",
          "version": null,
          "count_import_album_data": "0",
          "count_prepaid": "0"
        }
      ]
    },
    "execution_time": "0.1066",
    "memory_usage": "3.19MB",
    "status_code": "00000000",
    "params": {
      "eid": "1",
      "agent_eid": "1",
      "settle_phase_id": "1"
    }
  };

  return res.json(returnObj);
}

function getAlbumPreview(req, res) {
  const returnObj = {
    "data": {
      "all_number": {
        "origin_row": "173"
      },
      "sell_data": {
        "valid_row": "0",
        "valid_sum": 0,
        "data": [
          {
            "id": "2025",
            "album_code": "BBD0002",
            "album_name_zh": "album預覽",
            "release_date": "2020-07-20",
            "before_tax": "750.00",
            "after_tax": "714.29",
            "amount": "66",
            "data_phase": "2019H1",
            "hold_value": "0",
            "multiplication": "47142.857143",
            "last_hold_value": "0",
            "settle_number": "13",
            "prepaid_number": "15"
          },
          {
            "id": "2026",
            "album_code": "BBD0003",
            "album_name_zh": "album預覽",
            "release_date": "2020-07-20",
            "before_tax": "750.00",
            "after_tax": "714.29",
            "amount": "66",
            "data_phase": "2019H1",
            "hold_value": "0",
            "multiplication": "47142.857143",
            "last_hold_value": "1",
            "settle_number": "13",
            "prepaid_number": "0"
          },
        ]
      },
      "not_sell_data": {
        "count": 0,
        "data": [
          {
            "id": "2024",
            "album_code": "BBD0002",
            "album_name_zh": "album預覽",
            "release_date": "2020-07-20",
            "before_tax": "750.00",
            "after_tax": "714.29",
            "amount": "66",
            "data_phase": "2019H1",
            "hold_value": "0",
            "multiplication": "47142.857143",
            "last_hold_value": "0",
            "settle_number": "13",
            "prepaid_number": "0"
          },
          {
            "id": "2030",
            "album_code": "BD0001",
            "album_name_zh": "我不要離開地球表面Jump!The World 2007極限大碟",
            "release_date": "2020-08-19",
            "before_tax": "380.00",
            "after_tax": "361.90",
            "amount": "51",
            "data_phase": "2019H1",
            "hold_value": "0",
            "multiplication": "18457.142857",
            "last_hold_value": "0",
            "settle_number": "10",
            "prepaid_number": "0"
          }
        ],
      },

    },
    "execution_time": "0.7342",
    "memory_usage": "3.15MB",
    "status_code": "00000000",
    "params": {
      "type": "righ",
      "area": "tw",
      "page_current": "1",
      "page_size": "20",
      "agent_eid": "1",
      "settle_phase_id": "1"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getAppleList(req, res) {
  const returnObj = {
    "data": {
      "all_file_list_id": [
        "255",
        "115",
        "117",
        "208",
        "253"
      ],
      "data": [
        {
          "income": null,
          "company_media_id": "4",
          "company_media": "Apple",
          "file_list_id": "255",
          "settle_phase_id": "111",
          "settle_phase": "2019Q4-2020Q1",
          "settle_type": "reco",
          "data_phase": "201904",
          "data_phase_start": "2019-04-01",
          "data_phase_end": "2019-04-30",
          "eachservice": "Apple music",
          "country": "WW",
          "is_imported": "1",
          "is_calcu": "0",
          "match_status": "0",
          "check_status": "0",
          "is_tax_included": null,
          "tax_rate": null,
          "currency_id": "4",
          "currency_code": "USD",
          "settle_total": "123",
          "detail": [
            [
              {
                "country": "CH",
                "is_imported": "1",
                "settle_file_id": "256",
                "file_id": "2734",
                "file_name": "S1_86960475_0419_CH.txt",
                "income": null
              },
              {
                "country": "AE",
                "is_imported": "0",
                "settle_file_id": "257",
                "file_id": "2736",
                "file_name": "S1_86960475_0419_AE.txt",
                "income": null
              },
              {
                "country": "AU",
                "is_imported": "0",
                "settle_file_id": "258",
                "file_id": "2738",
                "file_name": "S1_86960475_0419_AU.txt",
                "income": null
              },
              {
                "country": "BR",
                "is_imported": "0",
                "settle_file_id": "259",
                "file_id": "2740",
                "file_name": "S1_86960475_0419_BR.txt",
                "income": null
              },
              {
                "country": "CA",
                "is_imported": "0",
                "settle_file_id": "260",
                "file_id": "2742",
                "file_name": "S1_86960475_0419_CA.txt",
                "income": null
              }
            ]
          ]
        },
        {
          "income": null,
          "company_media_id": "4",
          "company_media": "Apple",
          "file_list_id": "115",
          "settle_phase_id": "111",
          "settle_phase": "2019Q4-2020Q1",
          "settle_type": "reco",
          "data_phase": "2021H1",
          "data_phase_start": "2021-04-01",
          "data_phase_end": "2021-09-30",
          "eachservice": "iCloud",
          "country": "WW",
          "is_imported": "1",
          "is_calcu": "0",
          "match_status": "0",
          "check_status": "0",
          "is_tax_included": "0",
          "tax_rate": null,
          "currency_id": "4",
          "currency_code": "USD"
        },
        {
          "income": null,
          "company_media_id": "4",
          "company_media": "Apple",
          "file_list_id": "117",
          "settle_phase_id": "111",
          "settle_phase": "2019Q4-2020Q1",
          "settle_type": "reco",
          "data_phase": "2021H1",
          "data_phase_start": "2021-04-01",
          "data_phase_end": "2021-09-30",
          "eachservice": "Apple music",
          "country": "WW",
          "is_imported": "1",
          "is_calcu": "0",
          "match_status": "0",
          "check_status": "0",
          "is_tax_included": "0",
          "tax_rate": null,
          "currency_id": "4",
          "currency_code": "USD"
        },
        {
          "income": null,
          "company_media_id": "4",
          "company_media": "Apple",
          "file_list_id": "208",
          "settle_phase_id": "111",
          "settle_phase": "2019Q4-2020Q1",
          "settle_type": "reco",
          "data_phase": "2021H1",
          "data_phase_start": "2021-04-01",
          "data_phase_end": "2021-09-30",
          "eachservice": "iTunes",
          "country": "WW",
          "is_imported": "1",
          "is_calcu": "0",
          "match_status": "0",
          "check_status": "0",
          "is_tax_included": "0",
          "tax_rate": null,
          "currency_id": "4",
          "currency_code": "USD"
        },
        {
          "income": null,
          "company_media_id": "4",
          "company_media": "Apple",
          "file_list_id": "253",
          "settle_phase_id": "111",
          "settle_phase": "2019Q4-2020Q1",
          "settle_type": "reco",
          "data_phase": "2021H1",
          "data_phase_start": "2021-04-01",
          "data_phase_end": "2021-09-30",
          "eachservice": "iTunes",
          "country": "WW",
          "is_imported": "1",
          "is_calcu": "0",
          "match_status": "0",
          "check_status": "0",
          "is_tax_included": "0",
          "tax_rate": null,
          "currency_id": "4",
          "currency_code": "USD"
        }
      ]
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getCalcList(req, res) {
  const returnObj = {
    "data": {
      "tw": {
        "seq": "1",
        "name": "tw",
        "time": "2021-01-28 17:17:39",
        "row": "3529",
        "valid_count": "1"
      },
      "ext": {
        "seq": "2",
        "name": "ext",
        "time": "-",
        "row": "0",
        "valid_count": "0"
      },
      "os": {
        "seq": "3",
        "name": "os",
        "time": "-",
        "row": "0",
        "valid_count": "0"
      },
      "exception": {
        "seq": "4",
        "name": "exception",
        "time": "-",
        "row": "0",
        "valid_count": "0"
      },
      "mist": {
        "name": "mist",
        "seq": "5",
        "time": "-",
        "row": "0",
        "valid_count": "0"
      },
      "new_media": true
    },
    "execution_time": "0.1063",
    "memory_usage": "3.52MB",
    "status_code": "00000000",
    "params": {
      "settle_type": "righ",
      "settle_phase_id": "19"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function checkFileList(req, res) {
  const returnObj = {
    "data": {
      "true": [
        {
          "result": false,
          "file_name": "nmb_righ_ab_my_19Q3.xlsx.xlsx"
        }
      ],
      "false": [
        {
          "result": false,
          "file_name": "nmb_righ_kk_my_19Q3.xlsx.xlsx"
        }
      ]
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getReportList(req, res) {
  const returnObj = {
    "data": {
      "op_company": [
        {
          "pay_company_id": "8",
          "pay_company": "EMI MS. PUB. (S.E.ASIA) Ltd., Taiwan Branch",
          "file_name": "EMI MS. PUB. (S.E.ASIA) Ltd., Taiwan Branch",
          "pay_author_id": null,
          "pay_author": null
        },
        {
          "pay_company_id": "14",
          "pay_company": "Rock Music Publishing Co., Ltd.",
          "file_name": "Rock Music Publishing Co., Ltd.",
          "pay_author_id": null,
          "pay_author": null
        }
      ],
      "op_author": [
        {
          "pay_author_id": "464",
          "pay_company": "AMUSE(アミューズ)股份有限公司",
          "pay_author": "flumpool",
          "file_name": "AMUSE(アミューズ)股份有限公司 (flumpool)"
        },
        {
          "pay_author_id": "511",
          "pay_company": "AMUSE(アミューズ)股份有限公司",
          "pay_author": "尼川元気 (Amakawa, Genki)",
          "file_name": "AMUSE(アミューズ)股份有限公司 (尼川元気 (Amakawa, Genki))"
        },
        {
          "pay_author_id": "467",
          "pay_company": "AMUSE(アミューズ)股份有限公司",
          "pay_author": "山村隆太 (Yamamura, Ryuta)",
          "file_name": "AMUSE(アミューズ)股份有限公司 (山村隆太 (Yamamura, Ryuta))"
        },
        {
          "pay_author_id": "335",
          "pay_company": "奧美廣告股份有限公司",
          "pay_author": "許力心",
          "file_name": "奧美廣告股份有限公司 (許力心)"
        },
        {
          "pay_author_id": "331",
          "pay_company": "奧美廣告股份有限公司",
          "pay_author": "龔大中",
          "file_name": "奧美廣告股份有限公司 (龔大中)"
        },
        {
          "pay_author_id": "470",
          "pay_company": "小巨人音樂國際有限公司",
          "pay_author": "許勤毅",
          "file_name": "小巨人音樂國際有限公司 (許勤毅)"
        },
        {
          "pay_author_id": "619",
          "pay_company": "志和音樂工作室",
          "pay_author": "林強",
          "file_name": "志和音樂工作室 (林強)"
        },
        {
          "pay_author_id": "191",
          "pay_company": "神奇鼓娛樂有限公司",
          "pay_author": "劉浩明",
          "file_name": "神奇鼓娛樂有限公司 (劉浩明)"
        },
        {
          "pay_author_id": "193",
          "pay_company": "繆絲音樂有限公司",
          "pay_author": "蔡昇晏",
          "file_name": "繆絲音樂有限公司 (蔡昇晏)"
        },
        {
          "pay_author_id": "181",
          "pay_company": "蒙斯特音樂工作室",
          "pay_author": "溫尚翊",
          "file_name": "蒙斯特音樂工作室 (溫尚翊)"
        },
        {
          "pay_author_id": "157",
          "pay_company": "認真工作室",
          "pay_author": "陳信宏",
          "file_name": "認真工作室 (陳信宏)"
        },
        {
          "pay_author_id": "456",
          "pay_company": "赤腳不辣有限公司",
          "pay_author": "陳泰翔",
          "file_name": "赤腳不辣有限公司 (陳泰翔)"
        },
        {
          "pay_author_id": "158",
          "pay_company": "金三音樂有限公司",
          "pay_author": "陳勇志",
          "file_name": "金三音樂有限公司 (陳勇志)"
        },
        {
          "pay_author_id": "359",
          "pay_company": "銀翼文創有限公司",
          "pay_author": "陳建騏",
          "file_name": "銀翼文創有限公司 (陳建騏)"
        },
        {
          "pay_author_id": "100",
          "pay_company": "雀悅音樂有限公司",
          "pay_author": "李劍青",
          "file_name": "雀悅音樂有限公司 (李劍青)"
        },
        {
          "pay_author_id": "85",
          "pay_company": "頭石問路有限公司",
          "pay_author": "石錦航",
          "file_name": "頭石問路有限公司 (石錦航)"
        },
        {
          "pay_author_id": "153",
          "pay_company": "馬菲影視有限公司",
          "pay_author": "陳乃榮",
          "file_name": "馬菲影視有限公司 (陳乃榮)"
        },
        {
          "pay_author_id": "599",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "鄭穎",
          "file_name": "相信音樂國際股份有限公司 - 鄭穎"
        },
        {
          "pay_author_id": "319",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "陳奎言",
          "file_name": "相信音樂國際股份有限公司 - 陳奎言"
        },
        {
          "pay_author_id": "156",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "陳東漢",
          "file_name": "相信音樂國際股份有限公司 - 陳東漢"
        },
        {
          "pay_author_id": "681",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "陳澍恆",
          "file_name": "相信音樂國際股份有限公司 - 陳澍恆"
        },
        {
          "pay_author_id": "272",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "陳韋翎",
          "file_name": "相信音樂國際股份有限公司 - 陳韋翎"
        },
        {
          "pay_author_id": "676",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "高孟淵",
          "file_name": "相信音樂國際股份有限公司 - 高孟淵"
        },
        {
          "pay_author_id": "608",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "黃勤心",
          "file_name": "相信音樂國際股份有限公司 - 黃勤心"
        },
        {
          "pay_author_id": "171",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "黃壯為",
          "file_name": "相信音樂國際股份有限公司 - 黃壯為"
        },
        {
          "pay_author_id": "208",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "龔達虎",
          "file_name": "相信音樂國際股份有限公司 - 龔達虎"
        }
      ],
      "op_author_tw": [
        {
          "pay_author_id": "464",
          "pay_company": "AMUSE(アミューズ)股份有限公司",
          "pay_author": "flumpool",
          "file_name": "AMUSE(アミューズ)股份有限公司 (flumpool)"
        },
        {
          "pay_author_id": "511",
          "pay_company": "AMUSE(アミューズ)股份有限公司",
          "pay_author": "尼川元気 (Amakawa, Genki)",
          "file_name": "AMUSE(アミューズ)股份有限公司 (尼川元気 (Amakawa, Genki))"
        },
        {
          "pay_author_id": "714",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "嚴彬",
          "file_name": "相信音樂國際股份有限公司 - 嚴彬"
        },
        {
          "pay_author_id": "137",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "張勝凱",
          "file_name": "相信音樂國際股份有限公司 - 張勝凱"
        },
        {
          "pay_author_id": "355",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "張國璽",
          "file_name": "相信音樂國際股份有限公司 - 張國璽"
        },
        {
          "pay_author_id": "607",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "張宜蓁",
          "file_name": "相信音樂國際股份有限公司 - 張宜蓁"
        },
        {
          "pay_author_id": "112",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "張楠",
          "file_name": "相信音樂國際股份有限公司 - 張楠"
        },
      ],
      "op_author_os": [
        {
          "pay_author_id": "443",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "方奎棠",
          "file_name": "相信音樂國際股份有限公司 - 方奎棠"
        },
        {
          "pay_author_id": "303",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": "李柏誼",
          "file_name": "相信音樂國際股份有限公司 - 李柏誼"
        },
      ]
    },
    "execution_time": "0.1271",
    "memory_usage": "3.37MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "settle_type": "righ",
      "settle_phase_start": "2020-01-01",
      "settle_phase_end": "2020-06-30"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getReportOpts(req, res) {
  let returnObj = {
    "data": {
      "company_list": [
        "AMUSE(アミューズ)股份有限公司",
        "Dansonn Music Publishing",
        "EMI MS. PUB. (S.E.ASIA) Ltd., Taiwan Branch",
        "L’OZ PRODUCTION",
        "人人有功練音樂工作室",
        "可米國際影視事業股份有限公司",
        "奇跡音樂有限公司",
        "小巨人音樂國際有限公司",
        "志和音樂工作室",
        "更漂亮音樂工作室",
        "爵隊創作有限公司",
        "相信音樂國際股份有限公司",
        "神奇鼓娛樂有限公司",
        "繆絲音樂有限公司",
        "英兒工作室有限公司",
        "蒙斯特音樂工作室",
        "認真工作室",
        "赤腳不辣有限公司",
        "金三音樂有限公司",
        "雀悅音樂有限公司",
        "頭石問路有限公司",
        "馬菲影視有限公司"
      ],
      "author_list": [
        "Bin Music Author",
        "Daniel Denholm",
        "Daniel Gong",
        "HSIAO KENNY EDWARD",
        "Pierrick Tanguy",
        "Po Posayanukul",
        "Slot Machine",
        "Timothy Glenn Carr",
        "何穎怡",
        "劉浩明",
        "劉若英",
        "吳向飛",
        "吳嫻",
        "呂國緯",
        "周恆毅",
        "嚴嘉宏",
        "嚴彬",
        "尼川元気 (Amakawa, Genki)",
        "山村隆太 (Yamamura, Ryuta)",
        "張勝凱",
        "張宜蓁",
        "張閔翔",
        "方奎棠",
        "李劍青",
        "李柏誼",
        "李維菁",
        "林宏宗",
        "林強",
        "林彥達",
        "林忠諭",
        "林蔚珊",
        "溫尚翊",
        "潘俊佳",
        "潘燕山",
        "潘雲安",
        "熊仔",
        "王少軒",
        "王希文",
        "王昱辰",
        "白安嚴",
        "百田留衣 (Momota, Rui)",
        "盧怡辰",
        "石錦航",
        "紀家盈",
        "聞震",
        "胡蘭蘭",
        "蔡昇晏",
        "蕭治豪",
        "薛仕凌",
        "許勤毅",
        "謝宇威",
        "趙艷敏",
        "路沚瀛",
        "邹楠",
        "鄭穎",
        "阪井一生 (Sakai, Kazuki)",
        "陳乃榮",
        "陳信宏",
        "陳勇志",
        "陳品赫",
        "陳奎言",
        "陳德脩",
        "陳泰翔",
        "陳澍恆",
        "陳韋翎",
        "高孟淵",
        "魏嘉瑩",
        "黃勤心",
        "黃壯為",
        "黃彥霖",
        "龔達虎",
        "유영준",
        "최철호",
        "회장님"
      ]
    },
    "execution_time": "0.6554",
    "memory_usage": "3.54MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "settle_type": "righ",
      "settle_phase_start": "2020-01-01",
      "settle_phase_end": "2020-06-30",
      "search_type": "tw"
    }
  };

  setTimeout(() => {
    return res.json(returnObj);
  }, 1000);
}

function getSettleSouvenirList(req, res) {
  const returnObj = {
    "data": {
      "summary": {
        "total_items": "3",
        "total_price": "2150",
        "royalty_total": 374.612,
        "should_paid_total": 318.42
      },
      "data_list": [
        {
          "settle_souvenir_sales_data_id": "23",
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "souvenir_launch_day": "2018-01-01",
          "author_name": null,
          "price": "650",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "溫尚翊",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "劉浩明",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "蔡昇晏",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "陳信宏",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "劉浩明",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "石錦航",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "陳信宏",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "陳信宏",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "蔡昇晏",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "石錦航",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "蔡昇晏",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "劉浩明",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "石錦航",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "溫尚翊",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "劉浩明",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "陳信宏",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "陳信宏",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "25",
          "souvenir_code": "BN0077M",
          "souvenir_name": "五月天/DNA無限放大金剛T",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "溫尚翊",
          "price": "1000",
          "quantity": "10",
          "data_phase": "2019H1"
        },
        {
          "settle_souvenir_sales_data_id": "24",
          "souvenir_code": "BN0014L",
          "souvenir_name": "搖滾鐵人 黑T--L",
          "souvenir_type": "明星商品",
          "souvenir_launch_day": null,
          "author_name": "蔡昇晏",
          "price": "500",
          "quantity": "10",
          "data_phase": "2019H1"
        }
      ]
    },
    "execution_time": "0.0535",
    "memory_usage": "3.99MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "file_list_id": "45",
      "sort": "desc",
      "page_current": "1"
    }
  };

  return res.json(returnObj);
}

function getCalculationPreview(req, res) {
  const returnObj = {
    "data": {
      "total_items": 2,
      "data": [
        {
          "song_name_system": "現在就讓我飛",
          "song_code": "bsc001013",
          "song_name": "現在就讓我飛",
          "author_id": "777",
          "product_code": "滾石移動(19/Q3)",
          "product_name": "NewMedia",
          "eachservice": null,
          "release_date": null,
          "product_type": "Digital",
          "author_name": "黃奕儒",
          "song_right": "詞",
          "split_ratio": "25%",
          "user": "滾石移動",
          "commission_type": "Digital",
          "auth_area": "TW",
          "data_phase": "19Q3",
          "settle_value": "71",
          "before_tax": 54.095,
          "tax_rate": null,
          "currency": "TWD",
          "exchange_rate": null,
          "song_calc": "1",
          "song_all": "1",
          "royalty": 13.524,
          "commission": "75%",
          "should_paid": 10.143,
          "contract_code": "EE-EZU-2018",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": null,
          "op_company_id": "147",
          "op_company_name": "奇跡音樂有限公司",
          "op_author_id": null,
          "op_author_name": null,
          "file_name": "奇跡音樂有限公司-黃奕儒",
          "phase": "20201H",
          "settle_type": "3",
          "temp_settle_type": "1",
          "total_song_ratio": "1/1"
        },
        {
          "song_name_system": "現在就讓我飛",
          "song_code": "bsc001013",
          "song_name": "現在就讓我飛",
          "author_id": "777",
          "product_code": "滾石移動(19/Q3)",
          "product_name": "NewMedia",
          "eachservice": null,
          "release_date": null,
          "product_type": "Digital",
          "author_name": "黃奕儒",
          "song_right": "曲",
          "split_ratio": "25%",
          "user": "滾石移動",
          "commission_type": "Digital",
          "auth_area": "TW",
          "data_phase": "19Q3",
          "settle_value": "71",
          "before_tax": 54.095,
          "tax_rate": null,
          "currency": "TWD",
          "exchange_rate": null,
          "song_calc": "1",
          "song_all": "1",
          "royalty": 13.524,
          "commission": "75%",
          "should_paid": 10.143,
          "contract_code": "EE-EZU-2018",
          "pay_company": "相信音樂國際股份有限公司",
          "pay_author": null,
          "op_company_id": "147",
          "op_company_name": "奇跡音樂有限公司",
          "op_author_id": null,
          "op_author_name": null,
          "file_name": "奇跡音樂有限公司-黃奕儒",
          "phase": "20201H",
          "settle_type": "3",
          "temp_settle_type": "1",
          "total_song_ratio": "1/1"
        }
      ]
    },
    "execution_time": "0.0854",
    "memory_usage": "3.54MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "settle_type": "righ",
      "search_type": "new_media",
      "settle_phase_start": "2020-01-01",
      "settle_phase_end": "2020-06-30",
      "pay_author": "黃奕儒"
    }
  };

  return res.json(returnObj);
}

function getTempReport(req, res) {
  const returnObj = {
    "data": {
      "summary": {
        "total_items": "0",
        "total_payment": null,
        "total_before_tax": null,
        "diff": 0
      },
      "data_list": [
        {
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "before_tax": "619.048",
          "quantity": "10",
          "author_stage_name": null,
          "share": "25.000%",
          "ratio": "1/2",
          "payment": "154.762",
          "contract_author_code": "BA-MD-010",
          "data_phase": "2019H1",
          "note": "石錦航(頭石問路有限公司)"
        },
        {
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "before_tax": "619.048",
          "quantity": "10",
          "author_stage_name": null,
          "share": "25.000%",
          "ratio": "1/2",
          "payment": "154.762",
          "contract_author_code": "BA-MD-010",
          "data_phase": "2019H1",
          "note": "陳信宏(認真工作室)"
        },
        {
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "before_tax": "619.048",
          "quantity": "10",
          "author_stage_name": null,
          "share": "25.000%",
          "ratio": "1/2",
          "payment": "154.762",
          "contract_author_code": "BA-MD-010",
          "data_phase": "2019H1",
          "note": "溫尚翊(蒙斯特音樂工作室)"
        },
        {
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "before_tax": "619.048",
          "quantity": "10",
          "author_stage_name": null,
          "share": "25.000%",
          "ratio": "1/2",
          "payment": "154.762",
          "contract_author_code": "BA-MD-010",
          "data_phase": "2019H1",
          "note": "劉浩明(神奇鼓娛樂有限公司)"
        },
        {
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "before_tax": "619.048",
          "quantity": "10",
          "author_stage_name": null,
          "share": "25.000%",
          "ratio": "1/2",
          "payment": "154.762",
          "contract_author_code": "BA-MD-010",
          "data_phase": "2019H1",
          "note": "蔡昇晏(繆絲音樂有限公司)"
        },
        {
          "souvenir_code": "AKP0722",
          "souvenir_name": "因為留不住",
          "souvenir_type": "書籍",
          "before_tax": "619.048",
          "quantity": "10",
          "author_stage_name": null,
          "share": "8.000%",
          "ratio": "1/2",
          "payment": "247.619",
          "contract_author_code": "BA-QC-020",
          "data_phase": "2019H1",
          "note": "宇宙人(奇跡音樂有限公司)"
        },
        {
          "souvenir_code": "BN0077M",
          "souvenir_name": "宇宙人/宇宙踢",
          "souvenir_type": "明星商品",
          "before_tax": "952.381",
          "quantity": "10",
          "author_stage_name": null,
          "share": "8.000%",
          "ratio": "1/1",
          "payment": "761.905",
          "contract_author_code": "BA-QC-020",
          "data_phase": "2019H1",
          "note": "宇宙人(奇跡音樂有限公司)"
        }
      ]
    },
    "execution_time": "0.0742",
    "memory_usage": "3.98MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "settle_phase_start": "2020-01-01",
      "settle_phase_end": "2020-06-30",
      "souvenir_code": "",
      "page_current": "1"
    }
  };

  return res.json(returnObj);
}

function getAuthorOpt(req, res) {
  const returnObj = {
    "data": [
      {
        "author_id": "85",
        "author_name": "石錦航"
      },
      {
        "author_id": "157",
        "author_name": "陳信宏"
      },
      {
        "author_id": "181",
        "author_name": "溫尚翊"
      },
      {
        "author_id": "191",
        "author_name": "劉浩明"
      },
      {
        "author_id": "193",
        "author_name": "蔡昇晏"
      },
      {
        "author_id": "35",
        "author_name": "宇宙人"
      }
    ],
    "execution_time": "0.0849",
    "memory_usage": "3.97MB",
    "status_code": "00000000",
    "params": {
      "agent_eid": "1",
      "settle_phase_start": "2019-04-01",
      "settle_phase_end": "2019-09-30"
    }
  };

  return res.json(returnObj);
}

function getAlbumPrepaid(req, res) {
  const testData = [{
    "album_code": "te00000",
    "album_name": "test_album_name_0000000",
    "release_date": "2019-01-16",
    "isrc": "test1900206",
    "song_name": "test_沒什麼不能愛",
    "song_code": "test_bsc012183",
    "author_name": "test_方奎棠",
    "song_right": "test_曲(25.000%)",
    "contract_song_code": "test_BE-PP-005",
    "value": "test_17500",
    "balance": "test_700.000000000",
    "is_paid": "1",
    "is_no_commission": "0",
    "is_limited": "1"
  }, {
    "album_code": "te11111",
    "album_name": "test_album_name_11",
    "release_date": "2019-12-16",
    "isrc": "test111111",
    "song_name": "test_沒1111",
    "song_code": "test_bs111",
    "author_name": "test_方奎棠111",
    "song_right": "tes111t_曲(25.000%)",
    "contract_song_code": "test111_BE-PP-005",
    "value": "test_1111",
    "balance": "test_7111.000000000",
    "is_paid": "1",
    "is_no_commission": "1",
    "is_limited": "0"
  }];

  const returnObj = {
    "data": {
      "row_num": 100,
      "data": [
        {
          "album_code": "1526813",
          "album_name": "謎之音",
          "release_date": "2019-08-16",
          "isrc": "TWJ011900206",
          "song_name": "沒什麼不能愛",
          "song_code": "bsc012183",
          "author_name": "方奎棠",
          "song_right": "曲(25.000%)",
          "contract_song_code": "BE-PP-005",
          "value": "17500",
          "balance": "700.000000000",
          "is_paid": "0",
          "is_no_commission": "0",
          "is_limited": "0"
        },
        ...testData, ...testData, ...testData, ...testData, ...testData
      ]
    },
    "execution_time": "0.0635",
    "memory_usage": "3.64MB",
    "status_code": "00000000",
    "params": {
      "settle_phase_id": "112",
      "agent_eid": "1",
      "page_current": "1",
      "page_limit": "50",
      "author_id": "",
      "order": "ASC",
      "search_range": "all"
    }
  }
  return res.json(returnObj);
}

export default {
  // settle_phase
  'get    /settle_phase': getSettlePhaseInfo,
  'get    /settle_phase/phase_list': getSettlePhaseList,
  // settle_album_import
  'post   /settle_album_import': getList,
  'post   /settle_album_import/check_settle_album_file_list_repeat': uploadFile,
  'post   /settle_album_import/upload': uploadFile,
  'post   /settle_album_import/settle_album_file_list_delete': updateData,
  'post   /settle_album_import/import': updateData,
  // settle_check_album_prepaid
  'get    /settle_check_album_prepaid': getPrepaidList,
  // settle_media_import
  'post   /settle_media_import': getMediaList,
  'post   /settle_media_import/apple': getAppleList,
  'get    /settle_media_import': getMediaOptions,
  'post   /settle_media_import/import': updateData,
  'post   /settle_media_import/fileAppleImport': updateData,
  'post   /settle_media_import/setting': updateData,
  'post   /settle_media_import/settle_media_file_list_delete': updateData,
  'post   /settle_media_import/check_settle_media_file_list_repeat': checkFileList,
  // settle_media_song_match
  'post   /settle_media_song_match': getMediaSongMatchList,
  'put    /settle_media_song_match': updateData,
  'post   /settle_media_song_match/mark_as_album': markAsAlbum,
  // settle_media_calculate_check
  'post   /settle_media_calculate_check/calculate': updateData,
  'post   /settle_media_calculate_check/delete_sale_data': updateData,
  'post   /settle_media_calculate_check/check_report': getCheckReport,
  'post   /settle_media_calculate_check/sheet_list': getSheetList,
  'post   /settle_media_calculate_check/song_list': getSongList,
  'post   /settle_media_calculate_check/changeCheckStatus': updateData,
  'post   /settle_media_calculate_check/calculate_all': updateData,
  'post   /settle_media_calculate_check/download_check_report': updateData,
  // settle_album_origin_data_preview
  'get    /settle_album_origin_data_preview': getAlbumPreview,
  'put    /settle_album_origin_data_preview/add_new_record': updateData,
  'patch  /settle_album_origin_data_preview': updateData,
  // settle_calc
  'post   /settle_calc': updateData,
  'get    /settle_calc': getCalcList,
  // settle_report
  'post   /settle_report/report_list': getReportList,
  'get    /settle_report/report_list': getReportOpts,
  'post   /settle_report/calculation_preview': getCalculationPreview,
  'post   /settle_report/clean_all': updateData,
  // settle_souvenir
  'put    /settle_souvenir/import_sales_data': updateData,
  'get    /settle_souvenir/sales_data': getSettleSouvenirList,
  'get    /settle_souvenir/settle_temp_report': getTempReport,
  'get    /settle_souvenir/settle_author': getAuthorOpt,
  'post   /settle_souvenir/delete_imported_sales_data': updateData,
  'post    /settle_souvenir/calculation': updateData,
  // misc
  'get    /contract_misc/settle_statistics': updateData,
  // settle_righ/get_album_prepaid
  'post  /settle_righ/get_album_prepaid': getAlbumPrepaid,
};