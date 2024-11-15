import { message } from 'antd';
import { login, forgotPassword, changePassword, getInitUserData, getDisplayUserById, editPersonalAccount } from './service';

const Model = {
  namespace: 'authList',
  state: {
    // change -----
    changeId: 0,
    loginResult: '',
    forgotPasswordResult: '',
    changePasswordResult: '',
    changeUserdataResult: '',
    editDataResult: '',
    // data -----
    // getInitUserData
    initUserData: {},
    // getCreatedUser
    createdUser: {},
    // getUpdatedUser
    updatedUser: {},
  },
  effects: {
    *fetchLogin({ payload, callback }, { call, put, select }) {
      const response = yield call(login, payload);

      yield put({
        type: 'login',
        payload: response,
      });

      const getPara = yield select((state) => (state.authList.loginResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchForgotPassword({ payload, callback }, { call, put, select }) {
      const response = yield call(forgotPassword, payload);

      yield put({
        type: 'forgotPassword',
        payload: response,
      });

      const getPara = yield select((state) => (state.authList.forgotPasswordResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchChangePassword({ payload, callback }, { call, put, select }) {
      const response = yield call(changePassword, payload);

      yield put({
        type: 'changePassword',
        payload: response,
      });

      const getPara = yield select((state) => (state.authList.changePasswordResult));

      if (callback) {
        callback(getPara);
      }
    },
    // getInitUserData
    *fetchGetInitUserData({ payload, callback }, { call, put, select }) {
      const response = yield call(getInitUserData, payload);

      yield put.resolve({
        type: 'getInitUserData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authList.initUserData));

      if (callback) {
        callback(getPara);
      }
    },
    // getCreatedUser
    *fetchGetCreatedUser({ payload, callback }, { call, put, select }) {
      const response = yield call(getDisplayUserById, payload);

      yield put({
        type: 'getCreatedUser',
        payload: response,
      });
    },
    // getUpdatedUser
    *fetchGetUpdatedUser({ payload, callback }, { call, put, select }) {
      const response = yield call(getDisplayUserById, payload);

      yield put({
        type: 'getUpdatedUser',
        payload: response,
      });
    },
    // update -----
    *fetchEditForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editPersonalAccount, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    initAuthResult(state, action) {
      return { ...state, loginResult: '', forgotPasswordResult: '', changePasswordResult: '', changeUserdataResult: '' };
    },
    login(state, action) {
      let loginResult = 'error';

      if (!action.payload.resError) {
        loginResult = 'ok';
      } else if (action.payload.message) {
        loginResult = action.payload.message;
      }

      return { ...state, loginResult: loginResult };
    },
    forgotPassword(state, action) {
      let forgotPasswordResult = 'error';

      if (!action.payload.resError) {
        forgotPasswordResult = 'ok';
      } else if (action.payload.message) {
        forgotPasswordResult = action.payload.message;
      }

      return { ...state, forgotPasswordResult: forgotPasswordResult };
    },
    changePassword(state, action) {
      let changePasswordResult = 'error';

      if (!action.payload.resError) {
        changePasswordResult = 'ok';
        message.success('修改密碼成功！');
      } else if (action.payload.message) {
        changePasswordResult = action.payload.message;
      }

      return { ...state, changePasswordResult: changePasswordResult };
    },
    // getInitUserData
    getInitUserData(state, action) {
      let changeId = state.changeId + 1;
      let returnData = action.payload.data;

      if (action.payload.resError) {
        returnData = {
          user_name: 'guest',
        };
      }

      return { ...state, changeId: changeId, initUserData: returnData };
    },
    // getCreatedUser
    getCreatedUser(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, createdUser: action.payload.data };
    },
    // getUpdatedUser
    getUpdatedUser(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, updatedUser: action.payload.data };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';
        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
  },
};

export default Model;
