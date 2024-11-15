import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc`, {
    params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc/view`, {
    params,
  });
}

export async function addMiscForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc`, {
    method: 'put',
    data: params,
  });
}

export async function editMiscForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc`, {
    method: 'post',
    data: params,
  });
}

export async function updateSettlePhase(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc/settle_phase`, {
    method: 'patch',
    data: params,
  });
}

export async function getSettleView(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc/settle_view`, {
    params,
  });
}

export async function getLyricsStatistics(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc/lyrics_statistics_search`, {
    params,
  });
}

export async function getRecordStatistics(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc/record_statistics_search`, {
    params,
  });
}