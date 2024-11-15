import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/album`, {
    method: 'post',
    data: params,
  });
}

export async function getAutoComplete(params) {
  return request(`${window.FRONTEND_WEB}/album/belong_album`, {
    params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/album/data`, {
    params,
  });
}

export async function addAlbumForm(params) {
  return request(`${window.FRONTEND_WEB}/album`, {
    method: 'put',
    data: params,
  });
}

export async function editAlbumForm(params) {
  return request(`${window.FRONTEND_WEB}/album`, {
    method: 'patch',
    data: params,
  });
}

export async function getContent(params) {
  return request(`${window.FRONTEND_WEB}/album/content`, {
    params,
  });
}

export async function editSongSeqForm(params) {
  return request(`${window.FRONTEND_WEB}/album/content`, {
    method: 'patch',
    data: params,
  });
}

export async function importIsrc(params) {
  return request(`${window.FRONTEND_WEB}/album/content`, {
    method: 'put',
    data: params,
  });
}

export async function copyDisc(params) {
  return request(`${window.FRONTEND_WEB}/album/copy`, {
    method: 'post',
    data: params,
  });
}

export async function setSongSetting(params) {
  return request(`${window.FRONTEND_WEB}/album/song_setting`, {
    method: 'patch',
    data: params,
  });
}

export async function editPrepaidForm(params) {
  return request(`${window.FRONTEND_WEB}/album/prepaid`, {
    method: 'patch',
    data: params,
  });
}

export async function getRelatedAlbum(params) {
  return request(`${window.FRONTEND_WEB}/album/related`, {
    params,
  });
}

export async function getSongSplit(params) {
  return request(`${window.FRONTEND_WEB}/album/righ_split`, {
    params,
  });
}

export async function getRecordSplit(params) {
  return request(`${window.FRONTEND_WEB}/album/record_split`, {
    params,
  });
}

export async function editRecordSplitForm(params) {
  return request(`${window.FRONTEND_WEB}/album/record_split`, {
    method: 'patch',
    data: params,
  });
}

export async function removeAlbum(params) {
  return request(`${window.FRONTEND_WEB}/album/delete`, {
    method: 'post',
    data: params,
  });
}

export async function calculateRecord(params) {
  return request(`${window.FRONTEND_WEB}/album/record_split`, {
    method: 'post',
    data: params,
  });
}

export async function calculateSong(params) {
  return request(`${window.FRONTEND_WEB}/album/righ_split`, {
    method: 'post',
    data: params,
  });
}

export async function getBelongAlbumInfo(params) {
  return request(`${window.FRONTEND_WEB}/album/belong_album`, {
    params,
  });
}

export async function removeDisc(params) {
  return request(`${window.FRONTEND_WEB}/album/disc_delete`, {
    method: 'post',
    data: params,
  });
}

export async function removePrepaid(params) {
  return request(`${window.FRONTEND_WEB}/album/prepaid_delete`, {
    method: 'post',
    data: params,
  });
}