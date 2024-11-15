import request from 'umi-request';

export async function getTempReport(params) {
  return request(`${window.FRONTEND_WEB}/settle_souvenir/settle_temp_report`, {
    params,
  });
}

export async function getAuthorOpt(params) {
  return request(`${window.FRONTEND_WEB}/settle_souvenir/settle_author`, {
    params,
  });
}

export async function calculation(params) {
  return request(`${window.FRONTEND_WEB}/settle_souvenir/calculation`, {
    method: 'post',
    data: params,
  });
}

export async function deleteImportedSalesData(params) {
  return request(`${window.FRONTEND_WEB}/settle_souvenir/delete_imported_sales_data`, {
    method: 'post',
    data: params,
  });
}


