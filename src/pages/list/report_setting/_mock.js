function getReportSetting(req, res) {
  const getReportSettingData = {
    "data": {
      "id": "1",
      "eid": "1",
      "company_name": "相信音樂股份有限公司",
      "company_name_en": "B'in Music International Limited",
      "company_contact": "台北市光復南路33巷12號6樓 TEL: 02-2768-9328 FAX: 02-7746-1201",
      "invoice": "發票資料如下：\n相信音樂國際股份有限公司\n統一編號：28464395\n發票請寄至：10563 台北市光復南路33巷12號6樓\n\n商祺",
      "health_tax_rate": "1.91%",
      "health_tax_over": "20000",
      "income_tax_over": "20010",
      "income_tax_over_foreign": "5000",
      "report_reco_contact_name": "洪巧燕",
      "report_reco_contact_tel": "Tel: (02)2768-9328#151",
      "report_right_contact_name": "王育萱",
      "report_right_contact_tel": "Tel: (02)2768-9328#147",
      "report_right_op_maker": "相信音樂股份有限公司",
      "report_right_maker": null,
      "account_to": null,
      "created_by": "",
      "created_at": "",
      "update_by": "",
      "update_at": "",
      "is_delete": 0
    }
  };

  if (req.query.eid != '1') {
    getReportSettingData.data.id = '2';
    getReportSettingData.data.company_name = '相知音樂股份有限公司';
  }

  return res.json(getReportSettingData);
}

function getIncomeTaxOver(req, res) {
  const getIncomeTaxOverData = {
    "data": {
      "id": "1",
      "eid": "1",
      "income_tax_over": "20010",
      "income_tax_over_foreign": "5100"
    }
  };

  return res.json(getIncomeTaxOverData);
}

function updateData(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

export default {
  'get    /report_setting': getReportSetting,
  'get    /report_setting/income_tax_over': getIncomeTaxOver,
  'patch  /report_setting': updateData,
};