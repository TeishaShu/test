import React, { Fragment } from 'react';
import {
  Upload,
  message,
  Tooltip,
  notification,
  Modal,
} from 'antd';
import { UploadOutlined, ExclamationCircleFilled, } from '@ant-design/icons';
import styles from '@/style/style.less';

const ComUpload = props => {
  const {
    setPageCurrent,
    getData,
    setViewLoading,
  } = props;
  const { confirm } = Modal;

  const errHandler = (msg) => {
    notification.error({
      duration: 0,
      icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
      message: msg,
    });
  }

  return (
    <Upload
      name="files[]"
      method="post"
      action={`${window.FRONTEND_WEB}/souvenir/import`}
      // accept='.xlsx'
      beforeUpload={(file, fileList) => {
        return new Promise((resolve, reject) => {
          let formData = new FormData();

          setViewLoading(true);
          formData.append('files[]', file);
          fetch(`${window.FRONTEND_WEB}/souvenir/import_check`, {
            method: 'post',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Access-Control-Allow-Credentials': 'true'
            },
            body: formData,
          }).then(res => {
            if (res.status == 200) {
              return res.json();
            } else {
              setViewLoading(false);
              errHandler(`"${file.name}" 檔案上傳失敗`);
              reject();
            }
          }).then((res) => {
            if (res) {
              // TODO: 跑迴圈顯示...
              let setTable = () => {
                let list = [];

                for (let key in res.data) {
                  list.push(
                    <tr key={`tr_${key}`}>
                      <td><p>{key}</p></td>
                      <td>{
                        res.data[key].map((elem, idx) => {
                          let showNum = (idx + 1).toString();
                          let showText = '';
                          let colorStyle = { color: '#E75757' };

                          // key check
                          if (elem.hasOwnProperty('souvenir_name')) {
                            showText += '名稱：' + ((elem.souvenir_name === undefined) ? ('(空值)') : (elem.souvenir_name)) + '；';
                          }
                          if (elem.hasOwnProperty('souvenir_type_name')) {
                            showText += '型態：' + ((elem.souvenir_type_name === undefined) ? ('(空值)') : (elem.souvenir_type_name)) + '；';
                          }
                          if (elem.hasOwnProperty('souvenir_price')) {
                            showText += '售價(台幣)：' + ((elem.souvenir_price === undefined) ? ('(空值)') : (elem.souvenir_price)) + '；';
                          }
                          if (elem.hasOwnProperty('souvenir_launch_day')) {
                            showText += '首發日：' + ((elem.souvenir_launch_day === undefined) ? ('(空值)') : (elem.souvenir_launch_day)) + '；';
                          }
                          if (elem.hasOwnProperty('author_code')) {
                            showText += '藝人編號：' + ((elem.author_code === undefined) ? ('(空值)') : (elem.author_code)) + '；';
                          }
                          if (elem.hasOwnProperty('stage_name')) {
                            showText += '藝名：' + ((elem.stage_name === undefined) ? ('(空值)') : (elem.stage_name)) + '；';
                          }
                          if (elem.hasOwnProperty('numerator')) {
                            showText += '拆分比(分子)：' + ((elem.numerator === undefined) ? ('(空值)') : (elem.numerator)) + '；';
                          }
                          if (elem.hasOwnProperty('denominator')) {
                            showText += '拆分比(分母)：' + ((elem.denominator === undefined) ? ('(空值)') : (elem.denominator)) + '；';
                          }
                          if (elem.hasOwnProperty('contract_code')) {
                            showText += '藝人發行合約：' + ((elem.contract_code === undefined) ? ('(空值)') : (elem.contract_code)) + '；';
                          }

                          if (showText == '') {
                            showText += '(無修改)';
                            colorStyle.color = 'rgba(0, 0, 0, 0.85)';
                          } else if (showText.indexOf('[data deleted]') >= 0) {
                            showText = '(資料刪除)';
                          }

                          return (
                            <p
                              key={`elemText_${idx}`}
                              style={colorStyle}
                            >
                              {`${showNum}. `}{showText}
                            </p>
                          )
                        })
                      }</td>
                    </tr>
                  );
                }

                return (
                  <table className={styles.formTable}>
                    <thead>
                      <tr>
                        <td><p>編號</p></td>
                        <td><p>修改或問題處</p></td>
                      </tr>
                    </thead>
                    <tbody>
                      {list}
                    </tbody>
                  </table>
                )
              };

              confirm({
                title: '檔案檢查',
                icon: '',
                width: '600px',
                content: setTable(),
                okText: '確定匯入',
                cancelText: '取消',
                onOk() {
                  resolve();
                },
                onCancel() {
                  setViewLoading(false);
                  reject();
                },
              });
            } else {
              setViewLoading(false);
              reject();
            }
          }).catch(error => {
            setViewLoading(false);
            errHandler(`"${file.name}" 檔案上傳失敗`);
            reject();
          });
        });
      }}
      onChange={(info) => {
        if (info.file.status === 'done') {
          setPageCurrent(1);
          getData({
            pageCurrent: 1,
          });
          setViewLoading(false);
          message.success(`"${info.file.name}" 檔案上傳成功`);
        } else if (info.file.status === 'error') {
          setViewLoading(false);
          errHandler(`"${info.file.name}" 檔案上傳失敗`);
        }
      }}
      showUploadList={false}
    >
      <Tooltip title="匯入檔案">
        <UploadOutlined
          className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
          style={{ marginLeft: '18px' }}
        />
      </Tooltip>
    </Upload>
  );
}

export default ComUpload;