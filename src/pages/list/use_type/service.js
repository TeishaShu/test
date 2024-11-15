import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/use_type`, {
    method: 'post',
    data: params,
  });
}

export async function getAllList(params) {
  return request(`${window.FRONTEND_WEB}/use_type/list_auto`, {
    method: 'get',
    data: params,
  });
}

export async function toggleStatus(params) {
  return request(`${window.FRONTEND_WEB}/use_type/toggle`, {
    params,
  });
}

export async function addData(params) {
  return request(`${window.FRONTEND_WEB}/use_type`, {
    method: 'put',
    data: params,
  });
}

export async function editData(params) {
  return request(`${window.FRONTEND_WEB}/use_type`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/use_type/delete`, {
    method: 'post',
    data: params,
  });
}