import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/list_enterprise_account`, {
    method: 'post',
    data: params,
  });
}

export async function freezeAction(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/freeze_enterprise_account_by_id`, {
    method: 'patch',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/view_enterprise_account`, {
    params,
  });
}

export async function editEnterprise(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/edit_enterprise_account_by_id`, {
    method: 'patch',
    data: params,
  });
}

export async function deleteEnterprise(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/delete_enterprise_account_by_id`, {
    method: 'post',
    data: params,
  });
}

export async function addEnterpriseAccount(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/add_enterprise_account`, {
    method: 'put',
    data: params,
  });
}
