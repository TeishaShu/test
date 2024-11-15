import request from 'umi-request';

// getbyAuthorList
export async function getbyAuthorList(params) {
  return request(`${window.FRONTEND_WEB}/song_rights/song_rights_by_author`, {
    method: 'post',
    data: params,
  });
}

// get song_rights
export async function getSongRights(params) {
  return request(`${window.FRONTEND_WEB}/song_rights`, {
    params,
  });
}

// check song_rights
export async function checkSongRightsForm(params) {
  return request(`${window.FRONTEND_WEB}/song_rights/check_rights_exists`, {
    method: 'post',
    data: params,
  });
}

// add song_rights
export async function addSongRightsForm(params) {
  return request(`${window.FRONTEND_WEB}/song_rights`, {
    method: 'put',
    data: params,
  });
}

// edit song_rights
export async function editSongRightsForm(params) {
  return request(`${window.FRONTEND_WEB}/song_rights`, {
    method: 'patch',
    data: params,
  });
}

// remove song_rights
export async function removeSongRightsData(params) {
  return request(`${window.FRONTEND_WEB}/song_rights/delete_rights`, {
    method: 'post',
    data: params,
  });
}

// to history song_rights
export async function toHistorySongRightsData(params) {
  return request(`${window.FRONTEND_WEB}/song_rights/change_valid`, {
    method: 'post',
    data: params,
  });
}

export async function expireContract(params) {
  return request(`${window.FRONTEND_WEB}/song_rights/contract_termination`, {
    method: 'post',
    data: params,
  });
}

export async function transferContract(params) {
  return request(`${window.FRONTEND_WEB}/song_rights/contract_transfer`, {
    method: 'post',
    data: params,
  });
}