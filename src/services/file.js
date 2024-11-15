import request from 'umi-request';

export async function downloadFile(params) {
  return request(`${window.FRONTEND_WEB}/file/download`, {
    params,
  });
}