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
      action={`${window.FRONTEND_WEB}/contract_karaoke/import`}
      // accept='.xlsx'
      onChange={(info) => {
        setViewLoading(true);

        if (info.file.status === 'done') {
          setPageCurrent(1);
          getData({
            pageCurrent: 1,
          });
          setViewLoading(false);
          message.success(`"${info.file.name}" 檔案上傳成功`);
        } else if (info.file.status === 'error') {
          if (info.file.response && info.file.response.message) {
            let message = {};

            try {
              message = JSON.parse(info.file.response.message);

              const setTable = () => {
                const trList = [];
                let i = 0;

                for (let key in message) {
                  trList.push(
                    <tr key={`tr_${i}`}>
                      <td>{key}</td>
                      <td>{message[key]}</td>
                    </tr>
                  );
                  i++;
                }

                return (
                  <table className={styles.formTable}>
                    <thead>
                      <tr>
                        <td><p>編號</p></td>
                        <td><p>問題處</p></td>
                      </tr>
                    </thead>
                    <tbody>
                      {trList}
                    </tbody>
                  </table>
                );
              }

              Modal.info({
                title: '檔案匯入失敗',
                icon: '',
                width: '600px',
                content: setTable(),
                okText: '確定',
                onOk() {
                },
              });
            } catch {
              errHandler(`"${info.file.name}" 檔案上傳失敗`);
            }
          } else {
            errHandler(`"${info.file.name}" 檔案上傳失敗`);
          }

          setViewLoading(false);
        }
      }}
      showUploadList={false}
    >
      <Tooltip title="匯入檔案">
        <UploadOutlined
          className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
        />
      </Tooltip>
    </Upload>
  );
}

export default ComUpload;