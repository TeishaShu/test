import React, { useState, useEffect } from 'react';
import {
  Upload,
  message,
  Card,
  Button,
  Modal
} from 'antd';
import { UploadOutlined, } from '@ant-design/icons';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { confirm } = Modal;

const ComUpload = props => {
  const {
    isEdit,
    contractId,
    tmpFileList,
    setTmpFileList,
    errHandler
  } = props;

  return (
    <Card
      bordered={false}
      className={styles.card}
      title={
        <div>附件
        <span
            style={{ fontSize: '10px', color: '#a4a2a2', marginLeft: '10px' }}>只支援 .pdf 檔案格式，單一檔案容量須小於5MB</span>
        </div>
      }
    >
      <Upload
        name="files[]"
        action={`${window.FRONTEND_WEB}/Contract_author/upload_file`}
        accept='.pdf'
        listType="text"
        fileList={tmpFileList.filter((elem) => elem.status != 'removed' && elem.status != 'error')}
        beforeUpload={(file) => {
          if (file.type !== 'application/pdf' || (file.size / 1024 / 1024) > 5) {
            errHandler('只支援 .pdf 檔案格式，單一檔案容量須小於5MB');
            return false;
          } else {
            return true;
          }
        }}
        onPreview={(file) => {
          let setObj = {};

          if (file.status == 'old') {
            setObj.contract_author_id = contractId;
            setObj.file_id = file.fileId;
          } else {
            setObj.tmp_file_name = file.name;
          }

          commFn.postDownloadFile(file.url, setObj, file.name);

          return false;
        }}
        onChange={(info) => {
          let updateTmpFileList = info.fileList.filter((elem) => elem.status != 'removed' || elem.status != 'error');

          if (info.file.status === 'done' && (!info.file.response.data || !info.file.response.data.tmp_file || !info.file.response.data.tmp_file.name || !info.file.response.data.tmp_file.id)) {
            errHandler('檔案上傳錯誤');
          } else if (info.file.status === 'done' && info.file.response.data) {
            updateTmpFileList = info.fileList.map((mFile) => {
              if (info.file.uid == mFile.uid) {
                mFile.newFile = true;
                mFile.url = `${window.FRONTEND_WEB}/Contract_author/download_file`;
                mFile.fileId = info.file.response.data.tmp_file.id;
                mFile.name = info.file.response.data.tmp_file.name;
              }

              return mFile;
            });
          } else if (info.file.status === 'error') {
            if (info.file.response && info.file.response.message) {
              errHandler(`檔案上傳錯誤：${info.file.response.message}`);
            } else {
              errHandler('檔案上傳錯誤');
            }
          }

          setTmpFileList(updateTmpFileList);
        }}
        onRemove={(file) => {
          return new Promise((resolve, reject) => {
            if (!file.newFile && isEdit) {
              confirm({
                title: '',
                icon: '',
                content: '確定要刪除嗎？',
                okText: '確定',
                cancelText: '取消',
                onOk() {
                  fetch(`${window.FRONTEND_WEB}/contract_author/delete_file`, {
                    method: 'post',
                    headers: {
                      'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                      contract_author_id: contractId,
                      file_id: (file.response && file.response.data && file.response.data.tmp_file && file.response.data.tmp_file.id) ? (file.response.data.tmp_file.id) : (file.fileId)
                    })
                  }).then(res => {
                    if (res.status == 200 || res.status == 204) {
                      message.success(`"${file.name}" 檔案刪除成功`);
                      return resolve();
                    } else {
                      errHandler(`"${file.name}" 檔案刪除失敗`);
                      reject();
                    }
                  }).then(success => {
                    removeFile(file.uid);
                    resolve();
                  }).catch(error => {
                    // errHandler(`"${file.name}" 檔案刪除失敗`);
                    reject();
                  });
                },
                onCancel() {
                  reject();
                },
              });
            } else {
              resolve();
            }
          });
        }}
      >
        <Button icon={<UploadOutlined />}>上傳檔案</Button>
      </Upload>
    </Card>
  );
}

export default ComUpload;



