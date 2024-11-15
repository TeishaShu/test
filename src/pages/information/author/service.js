import request from 'umi-request';

export async function getAutoComplete(params) {
  return request(`${window.FRONTEND_WEB}/author/author_pen`, {
    params,
  });
}

export async function getAutoCompleteAuthorName(params) {
  return request(`${window.FRONTEND_WEB}/author/author_name`, {
    params,
  });
}

export async function getAutoCompleteStageName(params) {
  return request(`${window.FRONTEND_WEB}/author/author_stage`, {
    params,
  });
}

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/author`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/author/detail`, {
    params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/author/delete`, {
    method: 'post',
    data: params,
  });
}

export async function addForm(params) {
  return request(`${window.FRONTEND_WEB}/author`, {
    method: 'put',
    data: params,
  });
}

export async function editForm(params) {
  return request(`${window.FRONTEND_WEB}/author`, {
    method: 'patch',
    data: params,
  });
}