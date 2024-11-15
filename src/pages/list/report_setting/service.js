import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/report_setting`, {
    params,
  });
}

export async function getIncomeTaxOverList(params) {
  return request(`${window.FRONTEND_WEB}/report_setting/income_tax_over`, {
    params,
  });
}

export async function editData(params) {
  return request(`${window.FRONTEND_WEB}/report_setting`, {
    method: 'patch',
    data: params,
  });
}