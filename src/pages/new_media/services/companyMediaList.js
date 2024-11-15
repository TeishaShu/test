import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/company_media`, {
    method: 'post',
    data: params,
  });
}

export async function addData(params) {
  return request(`${window.FRONTEND_WEB}/company_media`, {
    method: 'put',
    data: params,
  });
}

export async function editData(params) {
  return request(`${window.FRONTEND_WEB}/company_media`, {
    method: 'patch',
    data: params,
  });
}

export async function removeData(params) {
  return request(`${window.FRONTEND_WEB}/company_media/delete_company`, {
    method: 'post',
    data: params,
  });
}

export async function checkCompanyCodeExists(params) {
  return request(`${window.FRONTEND_WEB}/company_media/check_company_code_exists`, {
    method: 'post',
    data: params,
  });
}


