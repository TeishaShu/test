const getIsrcTypeData = {
  "data": {
    "total_items": 2,
    "data_list": [
      {
        "id": "2",
        "type": "MV",
        "status": "1"
      },
      {
        "id": "3",
        "type": "VCD",
        "status": "1"
      }
    ]
  },
  "execution_time": "0.1026",
  "memory_usage": "2.99MB",
  "status_code": "00000000",
  "params": {
    "page_size": "20",
    "page_current": "1"
  }
};

function getIsrcType(req, res) {
  return res.json(getIsrcTypeData);
}

function getListAutoList(req, res) {
  let returnVal = {
    "data": [
      {
        "id": "11",
        "type": "演唱"
      },
      {
        "id": "15",
        "type": "花絮"
      }
    ]
  };

  return res.json(returnVal);
}

function updateData(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

export default {
  'get    /isrc_type': getIsrcType,
  'get    /isrc_type/list_auto': getListAutoList,
  'get    /isrc_type/toggle_status': updateData,
  'put    /isrc_type': updateData,
  'patch  /isrc_type': updateData,
  'post   /isrc_type/delete': updateData,
};