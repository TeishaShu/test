import React, { useState, useEffect, Fragment } from 'react';
import { history, connect } from 'umi';
import {
  Spin,
  Modal,
} from 'antd';
import ComUpload from '../../../../components/ComUpload';
import ComRow from '../../../../components/ComRow';
import styles from '@/style/style.less';

export const Step1 = props => {
  const {
    selectSettlePhaseId,
    enterpriseList: { agent_eid },
    settleAlbumList: { list },
    dispatch,
  } = props;
  const { confirm } = Modal;
  const [viewLoading, setViewLoading] = useState(false);
  const cusStyles = {
    table: {
      width: '100%',
      margin: '0 50px'
    },
    subTitle: {
      marginLeft: '-15px'
    }
  };
  const uiType = 'righ';

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'settleAlbumList/fetchGetList',
      payload: {
        settle_type: uiType,
        agent_eid: agent_eid,
        settle_phase_id: selectSettlePhaseId
      },
    });
  }

  // change settle phase
  useEffect(() => {
    getData();
  }, [selectSettlePhaseId]);

  // mount
  useEffect(() => {
    getData();
  }, []);

  // importInfo
  const importInfo = (fileListId) => {
    dispatch({
      type: 'settleAlbumList/fetchImportInfo',
      payload: {
        agent_eid: agent_eid,
        id: fileListId,
        settle_type: uiType,
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // deleteFiles
  const deleteFiles = (fileListId) => {
    dispatch({
      type: 'settleAlbumList/fetchDeleteFiles',
      payload: {
        agent_eid: agent_eid,
        file_list_id: [fileListId],
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // ui -----
  const showConfirm = (fileListId) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除檔案嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        deleteFiles(fileListId);
      },
      onCancel() { },
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={viewLoading}
    >
      <ComUpload
        isType={uiType}
        setViewLoading={setViewLoading}
        getData={getData}
      />
      <p>1-1 匯入銷售量報表</p>
      <table style={cusStyles.table}>
        <tbody>
          <tr>
            <td colSpan="5">
              <p style={cusStyles.subTitle}>1. 台灣專輯</p>
            </td>
          </tr>
          {
            (list && list.tw)
              ? (list.tw.map((elem, idx) => (
                <ComRow
                  uiType={uiType}
                  key={`tw_${idx}`}
                  isName="tw"
                  fileName={`${elem.orig_name}.${elem.ext}`}
                  row={elem.row}
                  fileListId={elem.file_list_id}
                  selectSettlePhaseId={selectSettlePhaseId}
                  importInfo={importInfo}
                  handleDelete={showConfirm}
                />
              )))
              : (null)
          }
          <tr>
            <td colSpan="5">
              <div className={styles.contentBBd}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <p style={cusStyles.subTitle}>2. 外部專輯</p>
            </td>
          </tr>
          {
            (list && list.ext)
              ? (list.ext.map((elem, idx) => (
                <ComRow
                  uiType={uiType}
                  key={`ext_${idx}`}
                  isName="ext"
                  fileName={`${elem.orig_name}.${elem.ext}`}
                  row={elem.row}
                  fileListId={elem.file_list_id}
                  selectSettlePhaseId={selectSettlePhaseId}
                  importInfo={importInfo}
                  handleDelete={showConfirm}
                />
              )))
              : (null)
          }
          <tr>
            <td colSpan="5">
              <div className={styles.contentBBd}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <p style={cusStyles.subTitle}>3. 海外專輯</p>
            </td>
          </tr>
          {
            (list && list.os)
              ? (list.os.map((elem, idx) => (
                <ComRow
                  uiType={uiType}
                  key={`os_${idx}`}
                  isName="os"
                  isIdx={idx}
                  fileName={`${elem.orig_name}.${elem.ext}`}
                  row={elem.row}
                  fileListId={elem.file_list_id}
                  selectSettlePhaseId={selectSettlePhaseId}
                  importInfo={importInfo}
                  handleDelete={showConfirm}
                />
              )))
              : (null)
          }
          <tr>
            <td colSpan="5">
              <div className={styles.contentBBd}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <p style={cusStyles.subTitle}>4. 例外專輯</p>
            </td>
          </tr>
          {
            (list && list.exception)
              ? (list.exception.map((elem, idx) => (
                <ComRow
                  uiType={uiType}
                  key={`exception_${idx}`}
                  isName="exception"
                  isIdx={idx}
                  fileName={`${elem.orig_name}.${elem.ext}`}
                  row={elem.row}
                  fileListId={elem.file_list_id}
                  selectSettlePhaseId={selectSettlePhaseId}
                  importInfo={importInfo}
                  handleDelete={showConfirm}
                />
              )))
              : (null)
          }
          <tr>
            <td colSpan="5">
              <div className={styles.contentBBd}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <p style={cusStyles.subTitle}>5. 其他授權</p>
            </td>
          </tr>
          <ComRow
            uiType={uiType}
            isName="misc"
            isIdx="0"
            fileName="其他授權 + 卡拉 OK"
            row=""
            selectSettlePhaseId={selectSettlePhaseId}
          />
          <tr>
            <td colSpan="5">
              <div className={styles.contentBBd}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <p style={cusStyles.subTitle}>6. 新媒體</p>
            </td>
          </tr>
          <ComRow
            uiType={uiType}
            isName="new_media"
            isIdx="0"
            fileName="新媒體"
            row=""
          />
          <tr>
            <td colSpan="5">
              <div className={styles.contentBBd}></div>
            </td>
          </tr>
        </tbody>
      </table>
    </Spin>
  );
}

export default connect(({ enterpriseList, settleAlbumList, loading }) => ({
  enterpriseList,
  settleAlbumList,
}))(Step1);
