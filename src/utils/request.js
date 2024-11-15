/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const codeMessage = {
  200: '伺服器成功返回請求的資料',
  201: '新建或修改資料成功',
  202: '一個請求已經進入後臺排隊（非同步任務）',
  204: '刪除資料成功',
  400: '發出的請求有錯誤，伺服器沒有進行新建或修改資料的操作',
  401: '使用者沒有許可權（權杖、用戶名、密碼錯誤）',
  403: '用戶得到授權，但是訪問是被禁止的',
  404: '發出的請求針對的是不存在的記錄，伺服器沒有進行操作',
  406: '請求的格式錯誤',
  410: '請求的資源被永久刪除，且不會再得到的',
  422: '當創建一個物件時，發生一個驗證錯誤',
  500: '伺服器發生錯誤，請檢查伺服器',
  502: '閘道錯誤',
  503: '服務不可用，伺服器暫時超載或維護',
  504: '閘道超時',
};

/**
 * 異常處理
 */
const errorHandler = error => {
  const { response, data } = error;
  let isErrorAndNoData = false;
  let isErrorObj = {
    resError: true
  };

  const checkHasNotNotificationAPI = (reqAPI) => {
    let returnVal = false;
    const notAPIList = [
      '/auth/user/login',
      '/auth/user/forgot_password',
      '/auth/user/change_password'
    ];

    if (reqAPI) {
      for (let i = 0; i < notAPIList.length; i++) {
        if (reqAPI.toLowerCase().indexOf(notAPIList[i].toLowerCase()) >= 0) {
          returnVal = true;
          break;
        }
      }
    }

    return returnVal;
  }

  const checkData = () => {
    if (typeof data == 'string' && data.indexOf('<!DOCTYPE html>') >= 0) {
      isErrorAndNoData = true;
    } else if (data) {
      data.resError = true;
    } else {
      isErrorAndNoData = true;
    }
  }

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (response.status == 401) {
      commFn.logout();
      return isErrorObj;
    }

    if (!checkHasNotNotificationAPI(url)) {
      notification.error({
        duration: 0,
        icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
        message: `請求錯誤 ${status}`,
        description: (
          (data && data.message)
            ? (<div className={styles.om_notification_text} dangerouslySetInnerHTML={{ __html: data.message }}></div>)
            : (
              (data && data.data)
                ? (data && data.data)
                : (errorText)
            )
        ),
      });
    }

    checkData();
  } else if (!response) {
    notification.error({
      duration: 0,
      icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
      description: '您的網路發生異常，無法連接伺服器',
      message: '網路異常',
    });

    checkData();
  }

  return (isErrorAndNoData) ? (isErrorObj) : (data);
};

/**
 * 配置 request 請求时的預設参数
 */
const request = extend({
  credentials: 'include', // 預設請求是否帶 cookie
});

request.interceptors.request.use((url, options) => {
  options.errorHandler = errorHandler;
});

export default request;