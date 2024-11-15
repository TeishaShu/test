import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke/list`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke/view`, {
    params,
  });
}

export async function addOrCopyKaraokeForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke`, {
    method: 'put',
    data: params,
  });
}

export async function editKaraokeForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke/delete`, {
    method: 'post',
    data: params,
  });
}

export async function updateSettlePhase(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke/settle_phase`, {
    method: 'patch',
    data: params,
  });
}

export async function getAvailableContractCode(params) {
  return request(`${window.FRONTEND_WEB}/contract_karaoke/available_contract_code`, {
    params,
  });
}
