import request from 'umi-request';

// settle_report -----
export async function getReportList(params) {
  return request(`${window.FRONTEND_WEB}/settle_report/report_list`, {
    method: 'post',
    data: params,
  });
}

export async function getReportOpts(params) {
  return request(`${window.FRONTEND_WEB}/settle_report/report_list`, {
    params,
  });
}

export async function getCalculationPreview(params) {
  return request(`${window.FRONTEND_WEB}/settle_report/calculation_preview`, {
    method: 'post',
    data: params,
  });
}

export async function cleanAll(params) {
  return request(`${window.FRONTEND_WEB}/settle_report/clean_all`, {
    method: 'post',
    data: params,
  });
}