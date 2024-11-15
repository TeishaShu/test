import request from 'umi-request';

export async function getInfo(params) {
  return request(`${window.FRONTEND_WEB}/settle_phase`, {
    params,
  });
}

export async function getPhaseList(params) {
  return request(`${window.FRONTEND_WEB}/settle_phase/phase_list`, {
    params,
  });
}