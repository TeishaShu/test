import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/souvenir`, {
    method: 'post',
    data: params,
  });
}

export async function getSouvenirType(params) {
  return request(`${window.FRONTEND_WEB}/souvenir/add`, {
    params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/souvenir/edit`, {
    params,
  });
}



export async function addSouvenirForm(params) {
  return request(`${window.FRONTEND_WEB}/souvenir`, {
    method: 'put',
    data: params,
  });
}

export async function editSouvenirForm(params) {
  return request(`${window.FRONTEND_WEB}/souvenir`, {
    method: 'patch',
    data: params,
  });
}



