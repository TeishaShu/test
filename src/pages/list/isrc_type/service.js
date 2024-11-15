import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/isrc_type`, {
    params,
  });
}

export async function getListAutoList(params) {
  return request(`${window.FRONTEND_WEB}/isrc_type/list_auto`, {
    params,
  });
}

export async function toggleStatus(params) {
  return request(`${window.FRONTEND_WEB}/isrc_type/toggle_status`, {
    params,
  });
}

export async function addData(params) {
  return request(`${window.FRONTEND_WEB}/isrc_type`, {
    method: 'put',
    data: params,
  });
}

export async function editData(params) {
  return request(`${window.FRONTEND_WEB}/isrc_type`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/isrc_type/delete`, {
    method: 'post',
    data: params,
  });
}