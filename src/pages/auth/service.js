import request from 'umi-request';

export async function login(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/login`, {
    method: 'post',
    data: params,
  });
}

export async function forgotPassword(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/forgot_password`, {
    method: 'post',
    data: params,
  });
}

export async function changePassword(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/change_password`, {
    method: 'patch',
    data: params,
  });
}

export async function getInitUserData(params) {
  return request(`${window.FRONTEND_WEB}/auth/User/get_user_data`, {
    params,
  });
}

export async function getDisplayUserById(params) {
  return request(`${window.FRONTEND_WEB}/auth/User/get_display_name_by_id`, {
    params,
  });
}

export async function editPersonalAccount(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/edit_peronsal_account`, {
    method: 'patch',
    data: params,
  });
}