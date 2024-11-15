import request from 'umi-request';

export async function getExternalContractList(params) {
  return request(`${window.FRONTEND_WEB}/album_prepaid/external_contract`, {
    params,
  });
}

export async function getInternalContractList(params) {
  return request(`${window.FRONTEND_WEB}/album_prepaid/internal_contract`, {
    params,
  });
}

export async function getDiscContent(params) {
  return request(`${window.FRONTEND_WEB}/album_prepaid/disc_content`, {
    params,
  });
}


export async function editExternalContract(params) {
  return request(`${window.FRONTEND_WEB}/album_prepaid/external_contract`, {
    method: 'patch',
    data: params,
  });
}

export async function editInternalContract(params) {
  return request(`${window.FRONTEND_WEB}/album_prepaid/internal_contract`, {
    method: 'patch',
    data: params,
  });
}

export async function removePrepaid(params) {
  return request(`${window.FRONTEND_WEB}/album_prepaid/delete`, {
    method: 'post',
    data: params,
  });
}