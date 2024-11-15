import request from 'umi-request';

export async function getNameAutoComplete(params) {
  return request(`${window.FRONTEND_WEB}/company/auto`, {
    params,
  });
}


export async function getAutoComplete(params) {
  return request(`${window.FRONTEND_WEB}/company`, {
    params,
  });
}

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/company`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/company/detail`, {
    params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/company/delete`, {
    method: 'post',
    data: params,
  });
}

export async function addData(params) {
  return request(`${window.FRONTEND_WEB}/company`, {
    method: 'put',
    data: params,
  });
}

export async function editData(params) {
  return request(`${window.FRONTEND_WEB}/company`, {
    method: 'patch',
    data: params,
  });
}

export async function editReplaceSettlement(params) {
  return request(`${window.FRONTEND_WEB}/company/replace_settlement`, {
    method: 'patch',
    data: params,
  });
}