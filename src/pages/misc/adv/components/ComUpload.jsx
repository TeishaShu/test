import React from 'react';
import {
  Upload,
  Tooltip,
  Modal,
} from 'antd';
import { Link, connect } from 'umi';
import { UploadOutlined, } from '@ant-design/icons';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const ComUpload = props => {
  const {
    setViewLoading,
    getData,
    dispatch,
    miscList,
  } = props;

  return (
    <Upload
      name="files[]"
      method="post"
      action={`${window.FRONTEND_WEB}/contract_misc/import_content`}
      accept='.xlsx'
      beforeUpload={(file, fileList) => {
        if (!miscList.info.sold_date) {
          commFn.errHandler('需填寫"銷售日期"，才可匯入檔案');
          return Upload.LIST_IGNORE;
        }

        return true;
      }}
      onChange={(info) => {
        if (info.file.status === 'done') {
          let data = (info.file.response && info.file.response.data && info.file.response.data.data_list) ? (info.file.response.data.data_list) : ([]);
          let tmpInfo = { ...miscList.info };

          if (data.length == 0) {
            commFn.errHandler(`"${info.file.name}" 檔案上傳無資料`);
            setViewLoading(false);
          } else {
            // 存入檔案
            tmpInfo.content = data.map((elem) => ({ ...elem, contract_author_subcontract_id: elem.subcontract_author_id, cm_id: tmpInfo.id, is_new: '1' }));

            dispatch({
              type: 'miscList/fecthEditMiscForm',
              payload: tmpInfo,
              callback: (result) => {
                if (result != '' && result != 'error') {
                  setViewLoading(false);
                  getData();
                } else {
                  setViewLoading(false);
                }
              }
            });
          }
        } else if (info.file.status === 'error') {
          setViewLoading(false);
          commFn.errHandler(`"${info.file.name}" 檔案上傳失敗`);
        }
      }}
      showUploadList={false}
      data={() => {
        return { sold_date: miscList.info.sold_date };
      }}
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

export default connect(({ miscList, loading }) => ({
  miscList,
}))(ComUpload);