import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/authorized_area`, {
    params,
  });
}

export async function addData(params) {
  return request(`${window.FRONTEND_WEB}/authorized_area`, {
    method: 'put',
    data: params,
  });
}

export async function updateData(params) {
  return request(`${window.FRONTEND_WEB}/authorized_area`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/authorized_area/delete_area`, {
    method: 'post',
    data: params,
  });
}
