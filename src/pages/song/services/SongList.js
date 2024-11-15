import request from 'umi-request';

export async function getAutoComplete(params) {
  return request(`${window.FRONTEND_WEB}/song`, {
    params,
  });
}

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/song`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/song/detail`, {
    params,
  });
}

export async function getISRCListBySong(params) {
  return request(`${window.FRONTEND_WEB}/song/detail_isrc`, {
    params,
  });
}

export async function getSongMediaListBySong(params) {
  return request(`${window.FRONTEND_WEB}/song/detail_song_media`, {
    params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/song/delete_song`, {
    method: 'post',
    data: params,
  });
}

export async function addForm(params) {
  return request(`${window.FRONTEND_WEB}/song`, {
    method: 'put',
    data: params,
  });
}

export async function editForm(params) {
  return request(`${window.FRONTEND_WEB}/song`, {
    method: 'patch',
    data: params,
  });
}

// get detail_rights
export async function getDetailRights(params) {
  return request(`${window.FRONTEND_WEB}/song/detail_rights`, {
    params,
  });
}