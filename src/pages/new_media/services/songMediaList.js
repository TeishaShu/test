import request from 'umi-request';

export async function getSongMediaList(params) {
  return request(`${window.FRONTEND_WEB}/song_media`, {
    method: 'post',
    data: params,
  });
}

export async function editData(params) {
  return request(`${window.FRONTEND_WEB}/song_media`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/song_media/delete_song`, {
    method: 'post',
    data: params,
  });
}


export async function importSongMedia(params) {
  return request(`${window.FRONTEND_WEB}/song_media/import_song_media`, {
    method: 'post',
    data: params,
  });
}

export async function downloadSongMedia(params) {
  return request(`${window.FRONTEND_WEB}/song_media/download_song_media`, {
    params,
  });
}