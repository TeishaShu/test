function getUseType(req, res) {
  const getUseTypeData = {
    "data": {
      "total_items": 3,
      "data_list": [
        {
          "id": "2",
          "subject_id": "2",
          "name": "CD",
          "status": "1"
        },
        {
          "id": "1",
          "subject_id": "1",
          "name": "DVD",
          "status": "1"
        },
        {
          "id": "3",
          "subject_id": "2",
          "name": "演唱會",
          "status": "1"
        }
      ]
    },
    "execution_time": "0.0535",
    "memory_usage": "2.99MB",
    "status_code": "00000000",
    "params": {
      "page_current": "1",
      "page_size": "20"
    }
  };

  return res.json(getUseTypeData);
}

function getAllList(req, res) {
  const returnObj = {
    "data": [
      {
        "id": "1",
        "type": "新媒體",
        "name": "APP"
      },
      {
        "id": "2",
        "type": "版稅支出",
        "name": "BD"
      },
      {
        "id": "3",
        "type": "版稅支出",
        "name": "CD"
      },
      {
        "id": "4",
        "type": "版稅支出",
        "name": "DVD"
      },
      {
        "id": "5",
        "type": "版稅支出",
        "name": "LP"
      },
      {
        "id": "6",
        "type": "版稅支出",
        "name": "MV"
      },
      {
        "id": "7",
        "type": "版稅支出",
        "name": "TAPE"
      },
      {
        "id": "8",
        "type": "版稅支出",
        "name": "代言"
      },
      {
        "id": "9",
        "type": "版稅支出",
        "name": "活動回放"
      },
      {
        "id": "10",
        "type": "版稅支出",
        "name": "原聲帶"
      },
      {
        "id": "11",
        "type": "版稅支出",
        "name": "書籍"
      },
      {
        "id": "12",
        "type": "新媒體",
        "name": "航空器"
      },
      {
        "id": "13",
        "type": "版稅支出",
        "name": "專案"
      },
      {
        "id": "14",
        "type": "版稅支出",
        "name": "教科書"
      },
      {
        "id": "15",
        "type": "版稅支出",
        "name": "短片-非營利"
      },
      {
        "id": "16",
        "type": "版稅支出",
        "name": "短片-營利"
      },
      {
        "id": "17",
        "type": "版稅支出",
        "name": "微電影-片頭"
      },
      {
        "id": "18",
        "type": "版稅支出",
        "name": "微電影-片尾"
      },
      {
        "id": "19",
        "type": "版稅支出",
        "name": "微電影-插曲"
      },
      {
        "id": "20",
        "type": "版稅支出",
        "name": "電視節目"
      },
      {
        "id": "21",
        "type": "版稅支出",
        "name": "電視節目-演唱類"
      },
      {
        "id": "22",
        "type": "版稅支出",
        "name": "電視劇-DVD"
      },
      {
        "id": "23",
        "type": "版稅支出",
        "name": "電視劇-片尾曲"
      },
      {
        "id": "24",
        "type": "版稅支出",
        "name": "電視劇-片頭曲"
      },
      {
        "id": "25",
        "type": "版稅支出",
        "name": "電視劇-插曲"
      },
      {
        "id": "26",
        "type": "版稅支出",
        "name": "電影-DVD"
      },
      {
        "id": "27",
        "type": "版稅支出",
        "name": "電影-片尾曲"
      },
      {
        "id": "28",
        "type": "版稅支出",
        "name": "電影-片頭曲"
      },
      {
        "id": "29",
        "type": "版稅支出",
        "name": "電影-插曲"
      },
      {
        "id": "30",
        "type": "版稅支出",
        "name": "電影/紀錄片"
      },
      {
        "id": "31",
        "type": "版稅支出",
        "name": "網路節目"
      },
      {
        "id": "32",
        "type": "版稅支出",
        "name": "舞台劇"
      },
      {
        "id": "33",
        "type": "版稅支出",
        "name": "廣告CF"
      },
      {
        "id": "34",
        "type": "新媒體",
        "name": "數位"
      },
      {
        "id": "35",
        "type": "版稅支出",
        "name": "樂譜書"
      },
      {
        "id": "36",
        "type": "新媒體",
        "name": "樂譜書+指法影片"
      },
      {
        "id": "37",
        "type": "新媒體",
        "name": "線上遊戲音樂"
      },
      {
        "id": "38",
        "type": "新媒體",
        "name": "線上遊戲音樂-APP"
      },
      {
        "id": "39",
        "type": "新媒體",
        "name": "線上遊戲音樂-PC"
      }
    ],
    "execution_time": "0.2165",
    "memory_usage": "3.14MB",
    "status_code": "00000000",
    "params": []
  };

  return res.json(returnObj);
}

function updateData(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

export default {
  'post   /use_type': getUseType,
  'get    /use_type/list_auto': getAllList,
  'get    /use_type/toggle': updateData,
  'put    /use_type': updateData,
  'patch  /use_type': updateData,
  'post   /use_type/delete': updateData,
};