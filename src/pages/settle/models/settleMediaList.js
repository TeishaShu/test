import { getList, getMediaOptions, getMediaSongMatchList, fileImport, fileAppleImport, reportSetting, updateMediaSongMatch, markAsAlbum, mediaCalculate, deleteMediaSaleData, getCheckReport, getSheetList, getSongList, changeCheckStatus, deleteFiles, calMedia, getAppleList } from '../service/settleMediaList';
import { getPhaseList, } from '../service/settlePhase';
import { message, } from 'antd';
const Model = {
  namespace: 'settleMediaList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    // data -----
    // getList
    list: {},
    // getAppleList
    appleList: {},
    mediaOptions: {},
    mediaSongMatchList: {
      total_items: 0,
      data_list: [],
    },
    markAsAlbum: {},
    // getCheckReport
    checkReport: [],
    // getSheetList
    sheetList: [],
    // getSongList
    songListNotOurs: {
      total_items: 0,
      total_price: 0,
      data_list: [],
    },
    songListNotSettle: {
      total_items: 0,
      total_price: 0,
      data_list: [],
    },
    // 結算期別
    phaseList: {},
  },
  effects: {
    // get -----
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *fetchGetAppleList({ payload }, { call, put }) {
      const response = yield call(getAppleList, payload);
      yield put({
        type: 'getAppleList',
        payload: response,
      });
    },
    *fetchGetMediaOptions({ payload }, { call, put }) {
      const response = yield call(getMediaOptions, payload);
      yield put({
        type: 'getMediaOptions',
        payload: response,
      });
    },
    *fetchGetMdieaSongMatchList({ payload, callback }, { call, put, all, select }) {
      const response = yield call(getMediaSongMatchList, payload);
      yield put({
        type: 'getMediaSongMatchList',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.mediaSongMatchList));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetCheckReport({ payload }, { call, put }) {
      const response = yield call(getCheckReport, payload);
      yield put({
        type: 'getCheckReport',
        payload: response,
      });
    },
    *fetchGetSheetList({ payload }, { call, put }) {
      const response = yield call(getSheetList, payload);
      yield put({
        type: 'getSheetList',
        payload: response,
      });
    },
    *fetchGetSongList({ payload }, { call, put }) {
      const response = yield call(getSongList, payload);
      yield put({
        type: 'getSongList',
        payload: response,
        req_type: payload.search_type,
      });
    },
    *fetchGetPhaseList({ payload, callback }, { call, put, select }) {
      const response = yield call(getPhaseList, { type: payload.type, agent_eid: payload.agent_eid });
      yield put({
        type: 'getPhaseList',
        payload: {
          response: response,
          routerId: payload.routerId,
          agent_eid: payload.agent_eid
        }
      })
    },
    // update -----
    *fetchFileImport({ payload, callback }, { call, put, all, select }) {
      const response = yield call(fileImport, payload);

      yield put({
        type: 'fileImport',
        payload: response,
      });

      // newmedia phaseid
      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchFileAppleImport({ payload, callback }, { call, put, all, select }) {
      const response = yield call(fileAppleImport, payload);

      yield put({
        type: 'fileAppleImport',
        payload: response,
      });

      // newmedia phaseid
      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchDeleteFiles({ payload, callback }, { call, put, all, select }) {
      const response = yield call(deleteFiles, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchReportSetting({ payload, callback }, { call, put, all, select }) {
      const response = yield call(reportSetting, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchUpdateMediaSongMatch({ payload, callback }, { call, put, select }) {
      const response = yield call(updateMediaSongMatch, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchMarkAsAlbum({ payload, callback }, { call, put, select }) {
      const response = yield call(markAsAlbum, payload);

      yield put.resolve({
        type: 'markAsAlbum',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.markAsAlbum));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchMediaCalculate({ payload, callback }, { call, put, select }) {
      const response = yield call(mediaCalculate, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.markAsAlbum));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchDeleteMediaSaleData({ payload, callback }, { call, put, select }) {
      const response = yield call(deleteMediaSaleData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.markAsAlbum));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchChangeCheckStatus({ payload, callback }, { call, put, all, select }) {
      const response = yield call(changeCheckStatus, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCalMedia({ payload, callback }, { call, put, all, select }) {
      const response = yield call(calMedia, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetList({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all', agent_eid: payload.agent_eid } }),
        yield put({
          type: 'settlePhaseList/fetchGetInfo',
          payload: {
            type: (payload.settle_type == 'righ') ? '3' : '4',
            phase_type: 'current',
            agent_eid: payload.agent_eid
          }
        }),
      ]);

      // newmedia phaseid
      const getPara = yield select((state) => (payload.settle_type == 'righ') ? (state.settlePhaseList.newMediaRight) : (state.settlePhaseList.newMediaRecord));
      const [c, d] = yield all([
        yield put({
          type: 'fetchGetMediaOptions', payload: {
            settle_type: (payload.settle_type) ? (payload.settle_type) : (''),
            settle_phase_id: (payload.settle_phase_id === '')
              ? ((getPara.current && getPara.current.id) ? (getPara.current.id) : (''))
              : payload.settle_phase_id,
            is_apple: '0',
            agent_eid: payload.agent_eid
          }
        }),
        yield put({
          type: 'fetchGetList', payload: {
            ...payload,
            settle_phase_id: (
              (payload.settle_phase_id === '')
                ? ((getPara.current && getPara.current.id) ? (getPara.current.id) : (''))
                : payload.settle_phase_id
            )
          }
        }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });

      if (callback) {
        callback(getPara);
      }
    },
    *fetchMultiGetAppleList({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a, b, c] = yield all([
        yield put({
          type: 'authorizedCountryList/fetchGetAuthorizedCountry',
          payload: {
            search: 'all',
            agent_eid: payload.agent_eid,
          }
        }),
        yield put({
          type: 'settlePhaseList/fetchGetInfo',
          payload: {
            type: '4',
            phase_type: 'current',
            agent_eid: payload.agent_eid,
          }
        }),
        yield put({
          type: 'settlePhaseList/fetchGetInfo',
          payload: {
            type: '4',
            phase_type: 'next',
            agent_eid: payload.agent_eid,
          }
        }),
      ]);

      // newmedia phaseid
      const getPara = yield select((state) => (state.settlePhaseList.newMediaRecord));
      const [d, e] = yield all([
        yield put({
          type: 'fetchGetMediaOptions', payload: {
            settle_type: (payload.settle_type) ? (payload.settle_type) : (''),
            settle_phase_id: (
              (payload.settle_phase_id === "")
                ? ((getPara.current && getPara.current.id) ? (getPara.current.id) : (''))
                : (payload.settle_phase_id)
            ),
            is_apple: '1',
            agent_eid: payload.agent_eid,
          }
        }),
        yield put({
          type: 'fetchGetAppleList', payload: {
            ...payload,
            settle_phase_id: (
              (payload.settle_phase_id === "")
                ? ((getPara.current && getPara.current.id) ? (getPara.current.id) : (''))
                : (payload.settle_phase_id)
            )
          }
        }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });

      if (callback) {
        callback(getPara);
      }
    },
    *fetchMultiGetCheckReport({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a] = yield all([
        yield put({ type: 'fetchGetCheckReport', payload: payload }),
      ]);

      const [b, c, d] = yield all([
        (payload.uiIsApple) ? (null) : (yield put({ type: 'fetchGetSheetList', payload: payload })),
        yield put({ type: 'fetchGetSongList', payload: { ...payload, search_type: 'not_ours' } }),
        yield put({ type: 'fetchGetSongList', payload: { ...payload, search_type: 'not_settle' } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
  },
  reducers: {
    // get -----
    getList(state, action) {
      let changeId = state.changeId + 1;
      let tmpList = {};

      if (!action.payload.resError && action.payload.data) {
        tmpList = action.payload.data;
      }

      return { ...state, changeId: changeId, list: tmpList };
    },
    getAppleList(state, action) {
      let changeId = state.changeId + 1;
      let tmpList = {};

      if (!action.payload.resError && action.payload.data) {
        tmpList = { ...action.payload.data };

        for (let i = 0; i < tmpList.data.length; i++) {
          let parentId = 'parent_' + tmpList.data[i].file_list_id;

          tmpList.data[i].ui_id = parentId;
          tmpList.data[i].detail = (tmpList.data[i].detail && tmpList.data[i].detail[0]) ? (tmpList.data[i].detail[0]) : ([]);

          for (let j = 0; j < tmpList.data[i].detail.length; j++) {
            tmpList.data[i].detail[j].ui_is_calcu = tmpList.data[i].is_calcu;
            tmpList.data[i].detail[j].ui_id = tmpList.data[i].detail[j].settle_file_id;
            tmpList.data[i].detail[j].ui_data_phase = tmpList.data[i].data_phase;
          }
        }
      }

      return { ...state, changeId: changeId, appleList: tmpList };
    },
    getMediaOptions(state, action) {
      let changeId = state.changeId + 1;
      let tmpMediaOptions = {};

      if (!action.payload.resError && action.payload.data) {
        tmpMediaOptions = action.payload.data;
      }

      return { ...state, changeId: changeId, mediaOptions: tmpMediaOptions };
    },
    getMediaSongMatchList(state, action) {
      let changeId = state.changeId + 1;
      let tmpMediaSongMatchList;
      let tmpDataList = [];

      if (!action.payload.resError && action.payload.data) {
        tmpMediaSongMatchList = action.payload.data;

        if (tmpMediaSongMatchList.data_list) {
          for (let i = 0; i < action.payload.data.data_list.length; i++) {
            let item = action.payload.data.data_list[i];
            let uiIsOurs = false;

            if (item.song_name && item.song_code) {
              uiIsOurs = true;
            }

            tmpDataList.push({
              ...item,
              ui_id: (uiIsOurs) ? (item.id ? item.id : item.song_media_id) : ((item.id ? item.id : item.song_media_id) + '_notours'),
              ui_media_song_code: item.media_song_code,
              ui_media_song_name: item.media_song_name,
              ui_song_name: item.song_name,
              ui_is_ours: uiIsOurs,
            });

            if (uiIsOurs) {
              tmpDataList.push({
                ...item,
                ui_media_song_code: '',
                ui_media_song_name: '',
                singer: '',
                isrc: '',
                song_code: '',
                ui_song_name: '',
                ui_id: (item.id ? item.id : item.song_media_id) + '_notours',
                ui_is_ours: false,
                ui_has_ours: true,
              });
            }
          }
        }

        tmpMediaSongMatchList.data_list = tmpDataList;
      }

      return { ...state, changeId, mediaSongMatchList: tmpMediaSongMatchList };
    },
    getCheckReport(state, action) {
      let changeId = state.changeId + 1;
      let tmpCheckReport = [];

      if (!action.payload.resError && action.payload.data) {
        tmpCheckReport = action.payload.data;
      }

      return { ...state, changeId, checkReport: tmpCheckReport };
    },
    getSheetList(state, action) {
      let changeId = state.changeId + 1;
      let tmpSheetList = [];

      if (!action.payload.resError && action.payload.data) {
        tmpSheetList = action.payload.data;
      }

      return { ...state, changeId, sheetList: tmpSheetList };
    },
    getSongList(state, action) {
      let changeId = state.changeId + 1;
      let returnObj = { ...state, changeId, };
      let objName = 'songListNotOurs';

      if (action.req_type && action.req_type == 'not_settle') {
        objName = 'songListNotSettle';
      }

      if (!action.payload.resError && action.payload.data) {
        returnObj[objName] = action.payload.data;
      } else {
        returnObj[objName] = {
          total_items: 0,
          total_price: 0,
          data_list: [],
        };
      }

      return returnObj;
    },
    getPhaseList(state, action) {
      let changeId = state.changeId + 1;
      let dataInfo = {};
      let routerId = "";
      let phaseList = {};

      if (action.payload.response && action.payload.response.data) {
        dataInfo = action.payload.response.data;
        routerId = action.payload.routerId;
        const filterInfo = dataInfo.filter((item, index) => {
          return item.id === routerId;
        })
        phaseList = filterInfo[0];
      }

      return {
        ...state,
        changeId: changeId,
        phaseList: phaseList
      };
    },
    // update -----
    fileImport(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';
        message.success('匯入成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    fileAppleImport(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';
        message.success('匯入成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.id) {
          updateDataResult = action.payload.data.id;
        } else {
          updateDataResult = 'ok';
        }
        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    markAsAlbum(state, action) {
      let tmpData = 'error';

      if (!action.payload.resError) {
        tmpData = action.payload.data;
      }

      return { ...state, markAsAlbum: tmpData };
    },
    // multi -----
    multiUpdateData(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;