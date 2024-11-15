import request from 'umi-request';

export async function getListAll(params) {
  return request(`${window.FRONTEND_WEB}/enterprise/list_all`, {
    params,
  });
}