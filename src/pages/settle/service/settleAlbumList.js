import request from 'umi-request';

// settle_album_import -----
export async function getList(params) {
  return request(`${window.FRONTEND_WEB}/settle_album_import`, {
    method: 'post',
    data: params,
  });
}

export async function deleteFiles(params) {
  return request(`${window.FRONTEND_WEB}/settle_album_import/settle_album_file_list_delete`, {
    method: 'post',
    data: params,
  });
}

export async function importInfo(params) {
  return request(`${window.FRONTEND_WEB}/settle_album_import/import`, {
    method: 'post',
    data: params,
  });
}


// settle_check_album_prepaid -----
export async function getPrepaidList(params) {
  return request(`${window.FRONTEND_WEB}/settle_check_album_prepaid`, {
    params,
  });
}

// settle_album_origin_data_preview -----
export async function getAlbumPreview(params) {
  return request(`${window.FRONTEND_WEB}/settle_album_origin_data_preview`, {
    params,
  });
}

export async function updateAlbumPreview(params) {
  return request(`${window.FRONTEND_WEB}/settle_album_origin_data_preview`, {
    method: 'patch',
    data: params,
  });
}

// settle_calc
export async function getCalcList(params) {
  return request(`${window.FRONTEND_WEB}/settle_calc`, {
    params,
  });
}

export async function calAlbum(params) {
  return request(`${window.FRONTEND_WEB}/settle_calc`, {
    method: 'post',
    data: params,
  });
}

// settle_souvenir
export async function importSouvInfo(params) {
  return request(`${window.FRONTEND_WEB}/settle_souvenir/import_sales_data`, {
    method: 'put',
    data: params,
  });
}

export async function getSettleSouvenirList(params) {
  return request(`${window.FRONTEND_WEB}/settle_souvenir/sales_data`, {
    params
  });
}

// calMisc
export async function calMisc(params) {
  return request(`${window.FRONTEND_WEB}/contract_misc/settle_statistics`, {
    params,
  });
}

// 詞曲結算-STEP3 - 預付與代結算
export async function getSettleRightState(params) {
  return request(`${window.FRONTEND_WEB}/settle_righ/states`, {
    params,
  });
}

// 詞曲結算-STEP3 - B. 專輯預付扣抵
export async function rightApplyAlbumPrepaid(params) {
  return request(`${window.FRONTEND_WEB}/settle_righ/apply_album_prepaid`, {
    method: 'post',
    data: params,
  });
}

// 詞曲結算-STEP3 - C. 代結算套用
export async function rightApplyReplaceSettlement(params) {
  return request(`${window.FRONTEND_WEB}/settle_righ/apply_replace_settlement`, {
    method: 'post',
    data: params,
  });
}

// 詞曲結算-STEP3 - B.-remove 撤銷專輯預付扣抵
export async function rightUnapplyAlbumPrepaid(params) {
  return request(`${window.FRONTEND_WEB}/settle_righ/unapply_album_prepaid`, {
    method: 'post',
    data: params,
  });
}

// 詞曲結算-STEP3 - C.-remove 撤銷代結算套用
export async function rightUnapplyReplaceSettlement(params) {
  return request(`${window.FRONTEND_WEB}/settle_righ/unapply_replace_settlement`, {
    method: 'post',
    data: params,
  });
}

// 錄音結算-STEP2
export async function getSettleRecoState(params) {
  return request(`${window.FRONTEND_WEB}/settle_reco/states`, {
    params,
  });
}

// 錄音結算-STEP2 - C. 代結算套用
export async function recoApplyReplaceSettlement(params) {
  return request(`${window.FRONTEND_WEB}/settle_reco/apply_replace_settlement`, {
    method: 'post',
    data: params,
  });
}

// 錄音結算-STEP2 - C. remove 撤銷代結算套用
export async function recoUnapplyReplaceSettlement(params) {
  return request(`${window.FRONTEND_WEB}/settle_reco/unapply_replace_settlement`, {
    method: 'post',
    data: params,
  });
}

// 詞曲預付扣抵餘額、本期專輯預付
export async function getAlbumPrepaid(params) {
  return request(`${window.FRONTEND_WEB}/settle_righ/get_album_prepaid`, {
    method: 'post',
    data: params,
  });
}
