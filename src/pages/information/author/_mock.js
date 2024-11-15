// getAuthorAuto
function getAuthorAuto(req, res) {
  let result = {
    data: [
      { id: '1', pen_name: 'pen_name1', author_code: 'bacs00006' },
      { id: '2', pen_name: 'pen_name2', author_code: 'bacs00007' },
      { id: '3', pen_name: 'pen_name3', author_code: 'bacs00008' },
    ]
  };

  let filterResult = result.data.filter((elem) => {
    return elem.pen_name.indexOf(req.query.keyword) >= 0 || elem.author_code.indexOf(req.query.keyword) >= 0
  });

  return res.json({ data: filterResult });
}

// getAutoCompleteAuthorName
function getAutoCompleteAuthorName(req, res) {
  let result = {
    data: [
      {
        "id": "6",
        "name": "Chloe",
        "author_code": "bacs00006"
      },
      {
        "id": "7",
        "name": "克洛伊",
        "author_code": "bacs00007"
      },
      {
        "id": "8",
        "name": "克洛伊",
        "author_code": "bacs00008"
      },
      {
        "id": "9",
        "name": "AdabudaAlibuda",
        "author_code": "bacs00009"
      },
    ]
  };

  let filterResult = result.data.filter((elem, idx, arr) => {
    return (elem.name.toLowerCase().indexOf(req.query.keyword) >= 0 || elem.author_code.toLowerCase().indexOf(req.query.keyword) >= 0)
  });

  return res.json({ data: filterResult });
}

function getAutoCompleteAuthorStageName(req, res) {
  let result = {
    "data": [
      {
        "id": "6",                 // author_stage_name.id
        "author_id": "6",          // author_stage_name.author_id  (藝人作者 id)
        "stage_name": "Chloe",
        "author_code": "bacs00006"
      },
      {
        "id": "7",
        "author_id": "7",
        "stage_name": "克洛伊",
        "author_code": "bacs00007"
      },
      {
        "id": "8",
        "author_id": "8",
        "stage_name": "克洛伊",
        "author_code": "bacs00008"
      },
      {
        "id": "9",
        "author_id": "9",
        "stage_name": "AdabudaAlibuda",
        "author_code": "bacs00009"
      },
    ]
  };

  let filterResult = result.data.filter((elem, idx, arr) => {
    return (elem.stage_name.indexOf(req.query.keyword) >= 0 || elem.author_code.indexOf(req.query.keyword) >= 0)
  });

  return res.json({ data: filterResult });
}

// getAuthor
function fakeList(count) {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `list-${i}`,
      author_code: `author_code${i}`,
      name: `name${i}`,
      pen_name: [{ id: '1', pen_name: 'pen1' }, { id: '2', pen_name: 'pen2' }],
      stage_name: [{ id: '1', stage_name: 'stage1' }, { id: '2', stage_name: 'stage2' }],
      type: (i % 3 === 0) ? '3' : ((i % 3 === 2) ? '2' : '1'),
    });
  }

  return list;
}

function getAuthor(req, res) {
  const params = req.query;
  const count = params.count * 1 || 20;
  const result = fakeList(count);
  let sourceData = result;

  let addResult = {
    data: {
      total_items: 40,
      data_list: result,
    }
  };

  // return res.status(500).json({});
  return res.json(addResult);
}

// getAuthorDetail
function getAuthorDetail(req, res) {
  let result = {
    data: {
      id: req.query.id,
      created_by: '1',
      created_at: '2002-10-22 12:30:00',
      updated_by: '2',
      updated_at: '0000-00-00 00:00:00',
      type: '1',
      role: ['2'],
      author_code: 'author_code',
      name: 'name',
      stage_name: [
        { id: '1', stage_name: 'stage_name1' },
        { id: '2', stage_name: 'stage_name2' }
      ],
      pen_name: [
        { id: '1', pen_name: 'pen_name1' },
        { id: '2', pen_name: 'pen_name2' },
        { id: '3', pen_name: 'pen_name3' },
      ],
      is_split: '1',
      members: [
        { id: '1', member_author_stage_name_id: '1', member_author_id: '1', stage_name: 'member name1', member_author_code: 'bacs00006' },
        { id: '2', member_author_stage_name_id: '2', member_author_id: '2', stage_name: 'member name2', member_author_code: 'bacs00007' },
        { id: '3', member_author_stage_name_id: '3', member_author_id: '3', stage_name: 'member name3', member_author_code: 'bacs00008' },
      ],
      nationality: '42',
      id_number: 'id_number',
      payment_rate: '0',
      overpay: 'income_tax_over',
      account_company_id: '2',
      account_company_code: 'companycode2',
      account_company_name: 'companyname2',
      insurance: '0',
      residence_add: 'residence',
      mailing_add: 'mailing_address',
      mobile: 'mobile',
      home_phone: 'home_phone',
      company_phone: 'company_phone',
      fax: 'fax',
      email: 'email',
      notes: 'notes\nnotest\nnote',
    }
  };

  setTimeout(() => {
    return res.json(result);
  }, 1000);
}

function removeAuthor(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

function addAuthor(req, res) {
  let obj = {
    data: {
      id: '12'
    }
  };

  setTimeout(() => {
    return res.json(obj);
  }, 1000);
}

function updateAuthor(req, res) {
  setTimeout(() => {
    return res.json();
  }, 1000);
}

function checkNameExist(req, res) {
  setTimeout(() => {
    return res.json({ data: true });
  }, 500);
}

export default {
  'get    /author/author_pen': getAuthorAuto,
  'get    /author/author_name': getAutoCompleteAuthorName,
  'get    /author/author_stage': getAutoCompleteAuthorStageName,
  'post   /author': getAuthor,
  'get    /author/detail': getAuthorDetail,
  'post   /author/delete': removeAuthor,
  'put    /author': addAuthor,
  'patch  /author': updateAuthor,
  'get    /author/name_exist': checkNameExist,
};