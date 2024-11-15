import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/isrc`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/isrc/detail`, {
    params,
  });
}

export async function getSplitInfo(params) {
  return request(`${window.FRONTEND_WEB}/isrc/detail_split`, {
    params,
  });
}

export async function addIsrcForm(params) {
  return request(`${window.FRONTEND_WEB}/isrc`, {
    method: 'put',
    data: params,
  });
}

export async function editIsrcForm(params) {
  return request(`${window.FRONTEND_WEB}/isrc`, {
    method: 'patch',
    data: params,
  });
}

export async function removeIsrcData(params) {
  return request(`${window.FRONTEND_WEB}/isrc/delete_isrc`, {
    method: 'post',
    data: params,
  });
}

export async function editIsrcSplitForm(params) {
  return request(`${window.FRONTEND_WEB}/isrc/edit_split`, {
    method: 'post',
    data: params,
  });
}

export async function resetSplit(params) {
  return request(`${window.FRONTEND_WEB}/isrc/reset_split`, {
    method: 'post',
    data: params,
  });
}

export async function getSongMedia(params) {
  return request(`${window.FRONTEND_WEB}/isrc/detail_song_media`, {
    params,
  });
}

export async function getIsrcByAuthor(params) {
  return request(`${window.FRONTEND_WEB}/isrc/isrc_by_author`, {
    method: 'post',
    data: params,
  });
}