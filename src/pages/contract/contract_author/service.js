import request from 'umi-request';


export async function getContractGroupList(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/contract_group_list`, {
    params,
  });
}

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/overview`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/contract_author`, {
    params,
  });
}

export async function getSpecifiedAlbum(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/specified_album`, {
    params,
  });
}

export async function getSpecifiedSong(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/specified_song`, {
    params,
  });
}

export async function getPrepaid(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/prepaid`, {
    params,
  });
}


export async function createSubContract(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/sub_contract/create`, {
    method: 'post',
    data: params,
  });
}

export async function contractRenewal(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/contract_renewal`, {
    method: 'patch',
    data: params,
  });
}

export async function deleteSubcontract(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/delete_subcontract`, {
    method: 'post',
    data: params,
  });
}

export async function addSubcontract(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/subcontract`, {
    method: 'put',
    data: params,
  });
}

export async function addContractAuthorForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_author`, {
    method: 'put',
    data: params,
  });
}

export async function editContractAuthorForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_author`, {
    method: 'patch',
    data: params,
  });
}

export async function exitContractGroup(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/exit_contract_group`, {
    method: 'post',
    data: params,
  });
}

export async function removeContract(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/delete`, {
    method: 'post',
    data: params,
  });
}

export async function copyContract(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/copy_contract`, {
    method: 'put',
    data: params,
  });
}

export async function editSpecifiedAlbumForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/specified_album`, {
    method: 'patch',
    data: params,
  });
}

export async function editSpecifiedSongForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/specified_song`, {
    method: 'patch',
    data: params,
  });
}

export async function addPrepaidForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/prepaid`, {
    method: 'put',
    data: params,
  });
}

export async function editPrepaidForm(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/prepaid`, {
    method: 'patch',
    data: params,
  });
}

export async function deletePrepaid(params) {
  return request(`${window.FRONTEND_WEB}/contract_author/delete_prepaid`, {
    method: 'post',
    data: params,
  });
}