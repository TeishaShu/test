import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/exchange_rate`, {
    method: 'post',
    data: params,
  });
}

export async function getAppleList(params) {
  return request(`${window.FRONTEND_WEB}/exchange_rate_apple`, {
    params,
  });
}

export async function getAppleNotImportList(params) {
  return request(`${window.FRONTEND_WEB}/exchange_rate_apple/not_import_list`, {
    params,
  });
}

export async function addExchangeRate(params) {
  return request(`${window.FRONTEND_WEB}/exchange_rate`, {
    method: 'put',
    data: params,
  });
}

export async function patchExchangeRate(params) {
  return request(`${window.FRONTEND_WEB}/exchange_rate`, {
    method: 'patch',
    data: params,
  });
}

export async function getLatestMonth(params) {
  return request(`${window.FRONTEND_WEB}/exchange_rate_apple/latest_month`, {
    params,
  })
}
