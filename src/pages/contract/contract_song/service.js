import request from 'umi-request';

export async function getAutoCompleteByAuthorId(params) {
  return request(`${window.FRONTEND_WEB}/contract_song`, {
    params,
  });
}

export async function getContractGroupList(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/contract_group_list`, {
    params,
  });
}


export async function addForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_song`, {
    method: 'put',
    data: params,
  });
}

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/search`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/view`, {
    params,
  });
}

export async function editForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_song`, {
    method: 'patch',
    data: params,
  });
}

export async function postDeleteData(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/delete`, {
    method: 'post',
    data: params,
  });
}

export async function postExtendData(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/extend`, {
    method: 'post',
    data: params,
  });
}

export async function copyContract(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/copy`, {
    method: 'put',
    data: params,
  });
}

export async function deleteContractGroup(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/clear_group`, {
    method: 'post',
    data: params,
  });
}

export async function updateFile(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/update_fk_id`, {
    method: 'post',
    data: params,
  });
}

export async function deleteFile(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/file_delete`, {
    method: 'post',
    data: params,
  });
}

export async function getRightSong(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/song_right`, {
    method: 'post',
    data: params,
  });
}

export async function getTransferData(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/transfer`, {
    params,
  });
}

export async function postTransferContract(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/transfer_contract`, {
    method: 'post',
    data: params,
  });
}

export async function postExpireContract(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/expire`, {
    method: 'post',
    data: params,
  });
}


export async function getPrepaid(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/prepaid`, {
    params,
  });
}

export async function addPrepaidForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/prepaid`, {
    method: 'put',
    data: params,
  });
}

export async function editPrepaidForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/prepaid`, {
    method: 'patch',
    data: params,
  });
}

export async function deletePrepaid(params) {
  return request(`${window.FRONTEND_WEB}/contract_song/delete_prepaid`, {
    method: 'post',
    data: params,
  });
}