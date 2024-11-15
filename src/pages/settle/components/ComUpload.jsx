import React, { useState, useEffect, Fragment } from 'react';
import { history, connect } from 'umi';
import {
  Upload,
  message,
  Modal,
} from 'antd';
import { CloudUploadOutlined } from "@ant-design/icons";
import commFn from '@/fn/comm';
import styles from '@/style/style.less';

const { Dragger } = Upload;
const { confirm } = Modal;

export const ComUpload = props => {
  const {
    dispatch,
    enterpriseList,
    isType,
    setViewLoading,
    getData,
    isDisabled,  // optional
    isApple,  // optional
    phaseType,  // optional
  } = props;
  let uploadNum = 0;
  let multiUploadTimer;

  // componentWillUnmount
  useEffect(() => {
    return () => {
      clearTimeout(multiUploadTimer);
    }
  }, []);

  return (
    <div style={{ marginBottom: '60px' }}>
      <Dragger
        disabled={(isDisabled) ? (isDisabled) : (false)}
        name=""
        multiple={true}
        showUploadList={false}
        action=""
        beforeUpload={(file, fileList) => {
          return new Promise((resolve, reject) => {
            uploadNum++;
            let tmpUploadNum = uploadNum;
            const setTable = (res) => {
              let newList = [];
              let updateList = [];

              if (res && res.data) {
                newList = res.data.false.map((elem, idx) => (
                  <tr key={`new_${idx}`}>
                    <td><p>{elem.file_name}</p></td>
                  </tr>
                ));
                updateList = res.data.true.map((elem, idx) => (
                  <tr key={`update_${idx}`}>
                    <td><p>{elem.file_name}</p></td>
                  </tr>
                ));
              }

              return (
                <Fragment>
                  <table className={styles.formTable}>
                    <thead>
                      <tr>
                        <td><p>新增檔案</p></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        (newList.length > 0)
                          ? (newList)
                          : (<tr><td><p>(無)</p></td></tr>)
                      }
                    </tbody>
                  </table>
                  <br />
                  <table className={styles.formTable}>
                    <thead>
                      <tr>
                        <td><p>修改檔案</p></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        (updateList.length > 0)
                          ? (updateList)
                          : (<tr><td><p>(無)</p></td></tr>)
                      }
                    </tbody>
                  </table>
                </Fragment>
              );
            }
            const checkFiles = (reject) => {
              let formData = new FormData();
              let api = '/settle_media_import/check_settle_media_file_list_repeat';

              if (isType != 'new_media') {
                api = '/settle_album_import/check_settle_album_file_list_repeat';

                if (isType == 'righ') {
                  formData.append('type', isType);
                } else {
                  if (fileList[0] && fileList[0]['name'] && fileList[0]['name'].indexOf('calc_souv_') >= 0) {
                    formData.append('type', 'souv');
                  } else {
                    formData.append('type', isType);
                  }
                }
              } else {
                // is_apple, phase_type
                if (isApple) {
                  formData.append('is_apple', isApple ? '1' : '0');
                  formData.append('phase_type', phaseType);
                } else {
                  formData.append('is_apple', '0');
                  formData.append('phase_type', 'current');
                }
              }
              formData.append('agent_eid', enterpriseList.agent_eid);
              for (let i = 0; i < fileList.length; i++) {
                formData.append('upload_files[]', fileList[i]['name']);
              }

              fetch(`${window.FRONTEND_WEB}${api}`, {
                method: 'post',
                body: formData,
              }).then(res => {
                if (res.status == 200) {
                  return res.json();
                } else {
                  setViewLoading(false);
                  commFn.errHandler('檔案上傳失敗');
                  reject();
                  return null;
                }
              }).then(res => {
                if (res) {
                  confirm({
                    title: '檔案檢查',
                    icon: '',
                    width: '600px',
                    content: setTable(res),
                    okText: '確定上傳',
                    cancelText: '取消',
                    onOk() {
                      uploadFiles(reject);
                    },
                    onCancel() {
                      setViewLoading(false);
                      reject();
                    },
                  });
                }
              }).catch(error => {
                setViewLoading(false);
                commFn.errHandler('檔案上傳失敗');
                reject();
              });
            }
            const uploadFiles = (reject) => {
              let formData = new FormData();
              let api = '/settle_media_import';

              if (isType != 'new_media') {
                api = '/settle_album_import';

                if (isType == 'righ') {
                  formData.append('type', isType);
                } else {
                  if (fileList[0] && fileList[0]['name'] && fileList[0]['name'].indexOf('calc_souv_') >= 0) {
                    formData.append('type', 'souv');
                  } else {
                    formData.append('type', isType);
                  }
                }

              } else {
                // is_apple, phase_type
                if (isApple) {
                  formData.append('is_apple', isApple ? '1' : '0');
                  formData.append('phase_type', phaseType);
                } else {
                  formData.append('is_apple', '0');
                  formData.append('phase_type', 'current');
                }
              }
              formData.append('agent_eid', enterpriseList.agent_eid);
              for (let i = 0; i < fileList.length; i++) {
                formData.append('files[]', fileList[i]);
              }

              fetch(`${window.FRONTEND_WEB}${api}/upload`, {
                method: 'post',
                body: formData,
              }).then(res => {
                if (res.status == 200) {
                  setViewLoading(false);
                  message.success('檔案上傳成功');
                  getData();
                  reject();
                } else {
                  setViewLoading(false);
                  commFn.errHandler('檔案上傳失敗');
                  reject();
                }
              }).catch(error => {
                setViewLoading(false);
                commFn.errHandler('檔案上傳失敗');
                reject();
              });
            }

            setViewLoading(true);

            multiUploadTimer = setTimeout(() => {
              if (tmpUploadNum != uploadNum) {
                reject();
              } else if (uploadNum > 20) {
                setViewLoading(false);
                commFn.errHandler('檔案上傳數量不可超過 20 個');
                uploadNum = 0;
                reject();
              } else {
                uploadNum = 0;
                checkFiles(reject);
              }
            }, 300);
          });
        }}
      >
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined
            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
          />
        </p>
        <p className="ant-upload-text">拖曳檔案至此處上傳</p>
      </Dragger>
    </div>
  );
}

export default connect(({ enterpriseList }) => ({
  enterpriseList,
}))(ComUpload);