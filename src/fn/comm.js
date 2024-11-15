import { history } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  notification,
} from 'antd';
import Cookies from 'js-cookie';
import globalSettings from '@/fn/globalsettings';

const commFn = {
  // init function -----
  // TODO: load language not finish
  initForLoadLanguage() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  checkEnvFile(init, orgText) {
    let base = this;

    return new Promise((resolve, reject) => {
      fetch(`${REACT_APP_PUBLIC_PATH}/${REACT_APP_ENV_PATH}?t=${base.randomNum()}`)
        .then(res => res.text())
        .then((textData) => {
          if (init || (orgText != textData)) {
            eval(textData);
            return resolve(textData);
          }

          return resolve();
        }).catch(() => {
          return resolve();
        });
    });
  },
  checkUiVersion(orgVer, pagePath) {
    let base = this;

    return new Promise((resolve, reject) => {
      fetch(`${REACT_APP_PUBLIC_PATH}/projectInfo.json?t=${base.randomNum()}`)
        .then(res => res.json())
        .then(jsonData => {
          if (orgVer && jsonData.version && orgVer != jsonData.version) {
            setTimeout(() => {
              sessionStorage.clear();
              window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${base.randomNum()}/#${pagePath}`;
              reject();
            });
          } else {
            resolve();
          }
        }).catch(err => {
          resolve();
        });
    });
  },
  // TODO: check language not finish
  initForCheckLanguage() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  // check uiroute
  checkUIRoute(list, path) {
    let returnVal = false;

    if (path == '/' || path == '/ui_info') {
      return true;
    }

    for (let i = 0; i < list.length; i++) {
      if (list[i].indexOf(':') >= 0) {
        let orgStr = list[i];
        let regStr = '^' + orgStr.replace(/[:]{1}[0-9a-zA-Z_-]{1,}/g, '[0-9a-zA-Z_-]{1,}') + '$';
        let reg = new RegExp(regStr, 'g');

        if (reg.test(path)) {
          returnVal = true;
          break;
        }
      } else {
        if (list[i] == path) {
          returnVal = true;
          break;
        }
      }
    }

    return returnVal;
  },
  // check platform or enterprise role
  checkPlatOrEntRole() {
    let returnVal = '2';  // 1: 大平台, 2: 企業版

    if (`${REACT_APP_ENV}` == 'development') {
      if (window.location.origin.indexOf('192.168.1') >= 0) {
        returnVal = '1';
      }
    } else {
      if (window.location.origin.toLowerCase().indexOf('platform') >= 0) {
        returnVal = '1';
      }
    }

    return returnVal;
  },
  // check login
  checkLogin(isPath) {
    return new Promise((resolve, reject) => {
      if (Cookies.get('uiAccess')) {
        return resolve();
      } else {
        return reject('logout');
      }
    });
  },
  isLogin() {
    if (Cookies.get('uiAccess')) {
      return true;
    }

    return false;
  },
  // api -----
  postDownloadFile(path, obj, defaultFileName, ext, notExt) {
    const base = this;
    let fileName = '';

    return new Promise((resolve, reject) => {
      fetch(path, {
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: (obj) ? JSON.stringify(obj) : null,
      }).then(res => {
        fileName = res.headers.get('content-disposition');
        if (fileName) {
          fileName = fileName.split('filename=')[1];
          fileName = fileName.replace(/\"/g, '');
        }

        if (res.status >= 200 && res.status < 300) {
          return res.blob();
        } else {
          throw new Error('');
        }
      }).then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');

        a.href = url;
        if (defaultFileName && notExt) {
          a.download = defaultFileName;
        } else {
          a.download = (defaultFileName) ? (`${defaultFileName}${ext ? '.' : ''}${ext ? ext : 'xlsx'}`) : ((fileName) ? (fileName) : (`download.${ext ? ext : 'xlsx'}`));
        }
        a.click();
        a.remove();

        resolve();
      }).catch(err => {
        base.errHandler('檔案下載失敗');

        resolve();
      });
    });
  },
  searchOption(keyword, api, callback, otherPara) {
    let path = `${window.FRONTEND_WEB}${api}?keyword=${keyword}`;

    if (otherPara) {
      for (let i = 0; i < otherPara.length; i++) {
        path += '&' + otherPara[i].key + '=' + otherPara[i].value;
      }
    }

    if (!keyword) {
      callback([]);
    } else {
      fetch(path).then(
        res => res.json()
      ).then(opts => {
        if (opts.data) {
          callback(opts.data);
        } else {
          callback([]);
        }
      }).catch(err => {
        callback([]);
      });
    }
  },
  logout() {
    let base = this;

    fetch(`${window.FRONTEND_WEB}/auth/user/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).catch(err => { });

    Cookies.remove('uiAccess');
    window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${base.randomNum()}/#/auth/login`;
  },
  // ui -----
  randomNum() {
    return Math.floor(Math.random() * 9999999999);
  },
  cookieExpires(sec) {
    let time = 1000 * sec;
    let expire = new Date(new Date().valueOf() + time);

    return expire;
  },
  convertOrderString(str) {
    let result = '';

    switch (str.toLowerCase()) {
      case 'ascend':
        result = 'asc';
        break;
      case 'descend':
        result = 'desc';
        break;
      default:
        result = str;
    }

    return result;
  },
  convertBoolToStr(bool) {
    return (bool) ? 'true' : 'false';
  },
  convertBoolToNumStr(bool) {
    return (bool) ? '1' : '0';
  },
  convertToBool(val) {
    let result = false;

    if (val === null) {
      return result;
    }

    switch (typeof (val)) {
      case 'boolean':
        return val;
      case 'string':
        switch (val.toLowerCase()) {
          case 'true':
          case '1':
            result = true;
            break;
        }
        return result;
      case 'number':
        if (val === 1) {
          result = true;
        }
        return result;
    }

    return result;
  },
  searchToString(arr, key, returnKey, val) {
    let left = 0;
    let right = arr.length - 1;

    if (val == null || val == '' || val == undefined || isNaN(parseInt(val))) {
      return '';
    }

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (parseInt(arr[mid][key]) > parseInt(val)) {
        right = mid - 1;
      } else if (parseInt(arr[mid][key]) < parseInt(val)) {
        left = mid + 1;
      } else {
        return arr[mid][returnKey];
      }
    }

    return '';
  },
  strToISWC(str) {
    let arr = [];

    if (str && str.length == 11) {
      arr = str.split('');
      return (arr[0] + '-' + arr[1] + arr[2] + arr[3] + '.' + arr[4] + arr[5] + arr[6] + '.' + arr[7] + arr[8] + arr[9] + '-' + arr[10]);
    }

    return '';
  },
  strToISRC(str) {
    let arr = [];

    if (str && str.length == 12) {
      arr = str.split('');
      return (arr[0] + arr[1] + '-' + arr[2] + arr[3] + arr[4] + '-' + arr[5] + arr[6] + '-' + arr[7] + arr[8] + arr[9] + arr[10] + arr[11]);
    }

    return '';
  },
  checkNoPage(nowPage, total) {
    let pageSize = globalSettings.pageSize;
    let maxPageNum = 1;
    let nowPageNum = parseInt(nowPage);
    let totalNum = parseInt(total);

    if (totalNum > 0 && !isNaN(nowPageNum) && !isNaN(totalNum)) {
      maxPageNum = Math.ceil((totalNum - 1) / pageSize);

      if (maxPageNum < nowPageNum) {
        return maxPageNum;
      } else {
        return nowPageNum;
      }
    }

    return 1;
  },
  trimInput({ target }, form, callback) {
    const { id, value } = target;

    if (!callback) {
      form.setFieldsValue({ [id]: value.trim() });
    } else {
      callback(value.trim());
    }
  },
  convertOverpayOpt(data) {
    let tmpList = [{ label: '-', value: '' }];

    tmpList.push({
      label: (data['income_tax_over'] && data['income_tax_over'].toLowerCase() != 'null' ? `本國 (${data['income_tax_over']})` : '本國'),
      value: 'income_tax_over'
    });
    tmpList.push({
      label: (data['income_tax_over_foreign'] && data['income_tax_over_foreign'].toLowerCase() != 'null' ? `外國 (${data['income_tax_over_foreign']})` : '外國'),
      value: 'income_tax_over_foreign'
    });

    return tmpList;
  },
  compareDateExpired(record) {
    let returnVal = false;
    let recordDate = '';
    // now
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1;
    var day = nowDate.getDate();

    if (record) {
      recordDate = record.split('-');
      recordDate = recordDate.map((elem) => parseInt(elem));

      if (recordDate.length >= 3 && !isNaN(recordDate[0]) && !isNaN(recordDate[1]) && !isNaN(recordDate[2])) {
        if (year > recordDate[0]) {
          returnVal = true;
        } else if (year == recordDate[0] && month > recordDate[1]) {
          returnVal = true;
        } else if (year == recordDate[0] && month == recordDate[1] && day >= recordDate[2]) {
          returnVal = true;
        }
      }
    }

    return returnVal;
  },
  convertAccountInfo(userData) {
    if (userData) {
      return `${(userData.user_name) ? (userData.user_name) : ''} ${(userData.account) ? ('(' + userData.account + ')') : ''}`;
    } else {
      return '';
    }
  },
  convertAreaContryText(areaType, areaName, countryId, countryList) {
    // countryList: authorizedCountryList.countryList

    let base = this;
    let showText = '';

    if (areaType == '2' || areaType == '3' || areaType == '4') {
      showText += (areaName ? areaName : '');
    }

    if (areaType == '3') {
      showText += '，包含';
    }

    if (areaType == '4') {
      showText += '，除了';
    }

    if (areaType == '1' || areaType == '3' || areaType == '4') {
      for (let i = 0; i < countryId.length; i++) {
        let countryItem = countryId[i];

        showText += base.searchToString(countryList, 'id', 'country_name_zh', countryItem);

        if (i < countryId.length - 1) {
          showText += '、';
        }
      }
    }

    return showText;
  },
  errHandler(msg) {
    notification.error({
      duration: 0,
      icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
      message: msg,
    });
  },
  getNowTime(cusFmt) {
    let fmt = 'yyyyMMdd';
    let now = new Date();
    let o = {
      "M+": now.getMonth() + 1,  // 月
      "d+": now.getDate(),  // 日
      "h+": now.getHours(),  // 時
      "m+": now.getMinutes(),  // 分
      "s+": now.getSeconds(),  // 秒
      "q+": Math.floor((now.getMonth() + 3) / 3),  // 季度
      "S": now.getMilliseconds()  //毫秒
    };

    if (cusFmt) {
      fmt = cusFmt;
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return fmt;
  },
  getMonthLastDay(yearAndMonth) {
    let splitArr = [];
    let newYear;
    let newMonth;
    let numReg = /[0-9]/;

    // 轉換為年、月
    if (!yearAndMonth || yearAndMonth.indexOf('-') < 0) {
      return null;
    }
    splitArr = yearAndMonth.split('-');
    if (!splitArr[0] || !splitArr[1] || !numReg.test(splitArr[0]) || !numReg.test(splitArr[1])) {
      return null;
    } else {
      // 年
      newYear = parseInt(splitArr[0]);
      // 下一個月
      newMonth = parseInt(splitArr[1]);
    }

    // 若為 12 月則改為明年 1 月
    if (newMonth >= 12) {
      newMonth = 0;
      newYear = newYear + 1;
    }

    // 取當年當月中的第一天
    let newDate = new Date(newYear, newMonth, 1);

    // 取當月最後一天日期
    return (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate().toString();
  },
  fractionCal(numerator1, denominator1, numerator2, denominator2, calculate) {
    // 分数類
    function Fraction(numerator, denominator) {
      this.n = numerator;
      this.d = denominator;
    }

    // 加法
    function fra_add(a, b) {
      if (a.n == 0)
        return b;
      else if (b.n == 0)
        return a;
      var x = lcm(a.d, b.d);
      var y = a.n * (x / a.d) + b.n * (x / b.d);
      var g = gcd(x, y);
      return new Fraction(y / g, x / g);
    }

    // 減法
    function fra_sub(a, b) {
      var x = lcm(a.d, b.d);
      var y = a.n * (x / a.d) - b.n * (x / b.d);
      var g = gcd(x, y);
      return new Fraction(y / g, x / g);
    }

    // 乘法
    function fra_mul(a, b) {
      var x = a.n * b.n;
      var y = a.d * b.d;
      if (x == 0)
        return new Fraction(0, 1);
      var g = gcd(x, y);
      return new Fraction(x / g, y / g);
    }

    // 最小公倍数
    function lcm(a, b) {
      if (a < b) {
        var temp = a;
        a = b;
        b = temp;
      }
      for (var i = 1; i <= b; i++) {
        if ((a * i) % b == 0) {
          return a * i;
        }
      }
    }

    // 最大公约数，用於化簡
    function gcd(a, b) {
      if (a < b) {
        var temp = a;
        a = b;
        b = temp;
      }
      return (a % b ? gcd(a % b, b) : b);
    }

    let result;

    switch (calculate) {
      case 'add':
        result = fra_add(new Fraction(parseFloat(numerator1), parseFloat(denominator1)), new Fraction(parseFloat(numerator2), parseFloat(denominator2)));
        break;
      case 'sub':
        result = fra_sub(new Fraction(parseFloat(numerator1), parseFloat(denominator1)), new Fraction(parseFloat(numerator2), parseFloat(denominator2)));
        break;
      case 'mul':
        result = fra_mul(new Fraction(parseFloat(numerator1), parseFloat(denominator1)), new Fraction(parseFloat(numerator2), parseFloat(denominator2)));
        break;
    }

    if (!result) {
      result = { n: 0, d: 0 };
    } else {
      if (isNaN(result.n) || result.n == Infinity) {
        result.n = 0;
      }

      if (isNaN(result.d)) {
        result.d = 0;
      } else if (result.d == Infinity) {
        result.d = 1;
      }
    }

    return result;
  },
  // 計算 - 加法
  calAdd(num1, num2) {
    let baseNum, baseNum1, baseNum2;

    try {
      baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
      baseNum1 = 0;
    }

    try {
      baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
      baseNum2 = 0;
    }

    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));

    return (num1 * baseNum + num2 * baseNum) / baseNum;
  },
  // 計算 - 減法
  calSub(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    let precision;// 精度

    try {
      baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
      baseNum1 = 0;
    }

    try {
      baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
      baseNum2 = 0;
    }

    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;

    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
  },
  // 計算 - 乘法
  calMulti(num1, num2) {
    let baseNum = 0;

    try {
      baseNum += num1.toString().split('.')[1].length;
    } catch (e) {
    }

    try {
      baseNum += num2.toString().split('.')[1].length;
    } catch (e) {
    }

    return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
  },
  // 計算 - 除法
  calDiv(num1, num2) {
    const base = this;

    let baseNum1 = 0, baseNum2 = 0;
    let baseNum3, baseNum4;

    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }

    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }

    /*
    with (Math) {
      baseNum3 = Number(num1.toString().replace('.', ''));
      baseNum4 = Number(num2.toString().replace('.', ''));

      resolve(base.calMulti((baseNum3 / baseNum4), Math.pow(10, baseNum2 - baseNum1)));
    }
    */

    baseNum3 = Number(num1.toString().replace('.', ''));
    baseNum4 = Number(num2.toString().replace('.', ''));

    return base.calMulti((baseNum3 / baseNum4).toFixed(5), Math.pow(10, baseNum2 - baseNum1));
  },
  // 計算 - 去除小數點的零
  trimZero(val) {
    // 判斷數字或字串
    if (typeof (val) != 'string' && typeof (val) != 'number') {
      return '';
    }

    if (typeof (val) == 'number') {
      val = val.toString();
    }

    // 拆解字串,格式為：整數.小數
    let arr = val.split('.');
    let intPart = arr[0];
    let decPart = (arr[1]) ? (arr[1]) : '';

    //將小數點，右邊的 0 去除
    decPart = decPart.replace(/0+$/, '');

    // 若沒有小數位則反為整數部分
    if (decPart == '') {
      return intPart.trim();
    }

    return intPart.trim() + '.' + decPart.trim();
  },
  // 數字加逗號
  numberWithCommas(x) {
    if (typeof (x) == 'number' || typeof (x) == 'string') {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return x;
  },
  convertQuarterToDate(str) {
    const base = this;
    let tmpStr = str.replace(/\//g, '');
    let startMon = '01';
    let endMon = '01';

    tmpStr = tmpStr.split('Q');

    if (!tmpStr[0] || !tmpStr[1]) {
      return null;
    }

    switch (tmpStr[1]) {
      case '4':
        startMon = '10';
        endMon = '12';
        break;
      case '3':
        startMon = '07';
        endMon = '09';
        break;
      case '2':
        startMon = '04';
        endMon = '06';
        break;
      case '1':
      default:
        startMon = '01';
        endMon = '03';
    }

    return [`${tmpStr[0]}-${startMon}-01`, `${tmpStr[0]}-${endMon}-${base.getMonthLastDay(`${tmpStr[0]}-${endMon}`)}`];
  },
  convertSessionToObj(key) {
    let result = null;

    try {
      if (sessionStorage[key]) {
        result = JSON.parse(sessionStorage[key]);
      }
    } catch (err) {
      result = null;
    }

    return result;
  }
};

export default commFn;