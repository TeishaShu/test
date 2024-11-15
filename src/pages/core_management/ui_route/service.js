import request from 'umi-request';

export async function getInitMenu(params) {
  return request(`${window.FRONTEND_WEB}/ui_route/init_menu`, {
    params,
  });
}

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/ui_route`, {
    params,
  });
}

export async function addData(params) {
  return request(`${window.FRONTEND_WEB}/ui_route`, {
    method: 'put',
    data: params,
  });
}

export async function updateData(params) {
  return request(`${window.FRONTEND_WEB}/ui_route`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/ui_route/delete`, {
    method: 'post',
    data: params,
  });
}