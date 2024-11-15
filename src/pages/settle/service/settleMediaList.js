import request from 'umi-request';

// settle_media_import -----
export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import`, {
    method: 'post',
    data: params,
  });
}

export async function getAppleList(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import/apple`, {
    method: 'post',
    data: params,
  });
}

export async function getMediaOptions(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import`, {
    params,
  });
}

export async function fileImport(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import/import`, {
    method: 'post',
    data: params,
  });
}

export async function fileAppleImport(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import/import_apple`, {
    method: 'post',
    data: params,
  });
}

export async function deleteFiles(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import/settle_media_file_list_delete`, {
    method: 'post',
    data: params,
  });
}

export async function reportSetting(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_import/setting`, {
    method: 'post',
    data: params,
  });
}

export async function getMediaSongMatchList(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_song_match`, {
    method: 'post',
    data: params,
  });
}

export async function updateMediaSongMatch(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_song_match`, {
    method: 'put',
    data: params,
  });
}

// settle_media_calculate_check -----
export async function getSheetList(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/sheet_list`, {
    method: 'post',
    data: params,
  });
}

export async function markAsAlbum(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_song_match/mark_as_album`, {
    method: 'post',
    data: params,
  });
}

export async function mediaCalculate(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/calculate`, {
    method: 'post',
    data: params,
  });
}

export async function deleteMediaSaleData(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/delete_sale_data`, {
    method: 'post',
    data: params,
  });
}

export async function getCheckReport(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/check_report`, {
    method: 'post',
    data: params,
  });
}

export async function getSongList(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/song_list`, {
    method: 'post',
    data: params,
  });
}

export async function changeCheckStatus(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/change_check_status`, {
    method: 'post',
    data: params,
  });
}

export async function calMedia(params) {
  return request(`${window.FRONTEND_WEB}/settle_media_calculate_check/calculate_all`, {
    method: 'post',
    data: params,
  });
}