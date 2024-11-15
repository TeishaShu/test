const getListData = {
  'data': [
    {
      'id': '1696',
      'currency': '3',
      'month': '2020_08',
      'exchange_rate': '3.903',
    },
    {
      'id': '1697',
      'currency': '4',
      'month': '2020_08',
      'exchange_rate': '29.835',
    },
    {
      'id': '1698',
      'currency': '5',
      'month': '2020_08',
      'exchange_rate': '20.955',
    },
    {
      'id': '1699',
      'currency': '6',
      'month': '2020_08',
      'exchange_rate': '0.2772',
    },
    {
      'id': '1700',
      'currency': '7',
      'month': '2020_08',
      'exchange_rate': '6.5805',
    },
    {
      'id': '1701',
      'currency': '8',
      'month': '2020_08',
      'exchange_rate': '0.02456',
    },
    {
      'id': '1702',
      'currency': '9',
      'month': '2020_08',
      'exchange_rate': '0.00203',
    },
    {
      'id': '1703',
      'currency': '10',
      'month': '2020_08',
      'exchange_rate': '19.24',
    },
    {
      'id': '1704',
      'currency': '11',
      'month': '2020_08',
      'exchange_rate': '32.59',
    },
    {
      'id': '1705',
      'currency': '12',
      'month': '2020_08',
      'exchange_rate': '37.08',
    },
    {
      'id': '1706',
      'currency': '13',
      'month': '2020_08',
      'exchange_rate': '21.095',
    },
    {
      'id': '1707',
      'currency': '2',
      'month': '2020_08',
      'exchange_rate': '6.354',
    },
    {
      'id': '1708',
      'currency': '3',
      'month': '2020_08',
      'exchange_rate': '3.903',
    },
    {
      'id': '1709',
      'currency': '4',
      'month': '2020_08',
      'exchange_rate': '29.835',
    },
    {
      'id': '1710',
      'currency': '5',
      'month': '2020_08',
      'exchange_rate': '20.955',
    },
    {
      'id': '1711',
      'currency': '6',
      'month': '2020_08',
      'exchange_rate': '0.2772',
    },
    {
      'id': '1712',
      'currency': '7',
      'month': '2020_08',
      'exchange_rate': '6.5805',
    },
    {
      'id': '1713',
      'currency': '8',
      'month': '2020_08',
      'exchange_rate': '0.02456',
    },
    {
      'id': '1714',
      'currency': '9',
      'month': '2020_08',
      'exchange_rate': '0.00203',
    },
    {
      'id': '1715',
      'currency': '10',
      'month': '2020_08',
      'exchange_rate': '19.24',
    },
    {
      'id': '1716',
      'currency': '11',
      'month': '2020_08',
      'exchange_rate': '32.59',
    },
    {
      'id': '1717',
      'currency': '12',
      'month': '2020_08',
      'exchange_rate': '37.08',
    },
    {
      'id': '1718',
      'currency': '13',
      'month': '2020_08',
      'exchange_rate': '21.095',
    },
    {
      'id': '1720',
      'currency': '3',
      'month': '2020_08',
      'exchange_rate': '3.903',
    },
    {
      'id': '1721',
      'currency': '4',
      'month': '2020_08',
      'exchange_rate': '29.835',
    },
    {
      'id': '1722',
      'currency': '5',
      'month': '2020_08',
      'exchange_rate': '20.955',
    },
    {
      'id': '1723',
      'currency': '6',
      'month': '2020_08',
      'exchange_rate': '0.2772',
    },
    {
      'id': '1724',
      'currency': '7',
      'month': '2020_08',
      'exchange_rate': '6.5805',
    },
    {
      'id': '1725',
      'currency': '8',
      'month': '2020_08',
      'exchange_rate': '0.02456',
    },
    {
      'id': '1726',
      'currency': '9',
      'month': '2020_08',
      'exchange_rate': '0.00203',
    },
    {
      'id': '1727',
      'currency': '10',
      'month': '2020_08',
      'exchange_rate': '19.24',
    },
    {
      'id': '1728',
      'currency': '11',
      'month': '2020_08',
      'exchange_rate': '32.59',
    },
    {
      'id': '1729',
      'currency': '12',
      'month': '2020_08',
      'exchange_rate': '37.08',
    },
    {
      'id': '1730',
      'currency': '13',
      'month': '2020_08',
      'exchange_rate': '21.095',
    },
  ],
};

const getAppleListData = {
  'data': [
    {
      'id': '122',
      'month': '201903',
      'country': '阿拉伯聯合大公國',
      'currency_id': '14',
      'currency': '阿聯迪拉姆',
      'exchange_rate': '0.2706',
    },
    {
      'id': '123',
      'month': '201903',
      'country': '澳洲',
      'currency_id': '10',
      'currency': '澳幣',
      'exchange_rate': '0.7127',
    },
    {
      'id': '124',
      'month': '201903',
      'country': '巴西',
      'currency_id': '32',
      'currency': '巴西雷亞爾',
      'exchange_rate': '0.26274',
    },
  ],
  'execution_time': '0.1406',
  'memory_usage': '3.15MB',
  'status_code': '00000000',
  'params': [],
};

const timeout = 1000;

function getList(req, res) {
  setTimeout(() => {
    return res.json(getListData);
  }, timeout);
}

function getAppleList(req, res) {
  setTimeout(() => {
    return res.json(getAppleListData);
  }, timeout);
}

const getAppleNotImportList = {
  "data": {
    "not_import_list": [
      "201902",
      "201903",
      "201906",
      "201907",
      "201910",
      "201911",
      "201912"
    ]
  },
  "execution_time": "1.1798",
  "memory_usage": "3.13MB",
  "status_code": "00000000",
  "params": {
    "year": "2019",
    "agent_eid": "1"
  }
}

function addExchangeRate(req, res) {
  setTimeout(() => {
    return res.json({
      'data':
      {
        'id': '2',
      },
    });
  }, timeout);
}

function patchExchangeRate(req, res) {
  setTimeout(() => {
    return res.json({
      'data': 'ok',
    });
  }, timeout);
}

const getLatestMonth = {
  "data": "2019_09",
  "execution_time": "0.0589",
  "memory_usage": "3.13MB",
  "status_code": "00000000",
  "params": {
    "is_apple": "1",
    "agent_eid": "1"
  }
}

export default {
  'post   /exchange_rate': getList,
  'get    /exchange_rate_apple': getAppleList,
  'get    /exchange_rate_apple/not_import_list': getAppleNotImportList,
  'get    /exchange_rate_apple/latest_month': getLatestMonth,
  'put    /exchange_rate': addExchangeRate,
  'patch  /exchange_rate': patchExchangeRate,
};
