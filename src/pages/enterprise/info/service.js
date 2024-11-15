import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/enterprise/list`, {
    method: 'POST',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/enterprise/view`, {
    params,
  });
}

export async function addEnterprise(params) {
  return request(`${window.FRONTEND_WEB}/enterprise/add`, {
    method: 'PUT',
    data: params,
  });
}

export async function editEnterprise(params) {
  return request(`${window.FRONTEND_WEB}/enterprise/edit`, {
    method: 'PATCH',
    data: params,
  });
}

export async function deleteEnterprise(params) {
  return request(`${window.FRONTEND_WEB}/enterprise/delete`, {
    method: 'POST',
    data: params,
  });
}
