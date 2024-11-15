import request from 'umi-request';

export async function getAuthorizedCountry(params) {
  return request(`${window.FRONTEND_WEB}/authorized_country`, {
    params,
  });
}
