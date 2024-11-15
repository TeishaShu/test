import request from 'umi-request';

export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/list_enterprise_member`, {
    method: 'post',
    data: params,
  });
}

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/view_enterprise_member`, {
    params,
  });
}

export async function freezeMember(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/freeze_entperprise_member_by_id`, {
    method: 'patch',
    data: params,
  });
}

export async function deleteMember(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/delete_enterprise_member_by_id`, {
    method: 'post',
    data: params,
  });
}

export async function updateMember(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/edit_enterprise_member`, {
    method: 'patch',
    data: params,
  });
}

export async function setAgent(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/set_agent`, {
    method: 'patch',
    data: params,
  });
}

export async function addMember(params) {
  return request(`${window.FRONTEND_WEB}/auth/user/add_enterprise_member`, {
    method: 'put',
    data: params,
  });
}

export async function getRole(params) {
  return request(`${window.FRONTEND_WEB}/auth/role/list_all`, {
    params,
  });
}
