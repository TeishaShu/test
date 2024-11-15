function getListAll(req, res) {
  let returnVal = {
    "data": {
      "total_items": 1,
      "data_list": [
        {
          "id": "1",
          "name": "相信音樂",
          "platform_id": "2"
        },
        {
          "id": "2",
          "name": "相知音樂",
          "platform_id": "2"
        }
      ]
    }
  };

  setTimeout(() => {
    return res.json(returnVal);
  }, 1000);
}

export default {
  'get  /enterprise/list_all': getListAll,
};