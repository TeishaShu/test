import React, { useState, useEffect, Fragment } from 'react';
import { CalculatorOutlined, EditOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
  Table,
  Tooltip,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComSplitInfo from './ComSplitInfo';
import ComSplitEdit from './ComSplitEdit';

export const ComRecordSplit = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    loadingEditIsrcSplitForm,
    loadingResetSplit,
    isrcList: { info, splitInfo },
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [tmpData, setTmpData] = useState({});
  const [authorIdList, setAuthorIdList] = useState([]);
  const [companyIdList, setCompanyIdList] = useState([]);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'isrcList/fetchGetSplitInfo',
      payload: {
        isrc_id: pageId,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [pageId]);

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  // onEditForm
  const onEditForm = () => {
    // set tmp data
    let newTmpData = {
      split: (splitInfo) ? (splitInfo.map((elem) => {
        let tmpElem = { ...elem };

        return tmpElem;
      })) : []
    };
    let tmpAuthorIdList = (splitInfo) ? (splitInfo.map((elem) => {
      if (elem.author_id) {
        return ([{
          id: elem.author_id,
          name: elem.author_name,
          author_code: elem.author_code,
        }]);
      }

      return ([]);
    })) : ([]);
    let tmpCompanyIdList = (splitInfo) ? (splitInfo.map((elem) => {
      if (elem.company_id) {
        return ([{
          id: elem.company_id,
          name: elem.company_name,
          company_code: elem.company_code,
        }]);
      }

      return ([]);
    })) : ([]);

    setAuthorIdList(tmpAuthorIdList);
    setCompanyIdList(tmpCompanyIdList)
    setTmpData(newTmpData);
    setIsEdit(true);
  }

  // onCancelForm
  const onCancelForm = () => {
    setIsEdit(false);
  }

  // onSaveForm
  const onSaveForm = (saveObj) => {
    dispatch({
      type: 'isrcList/fetchEditIsrcSplitForm',
      payload: saveObj,
      callback: res => {
        if (res && res != 'error') {
          getData();
          setIsEdit(false);
        }
      }
    });
  }

  // resetSplit
  const resetSplit = () => {
    dispatch({
      type: 'isrcList/fetchResetSplit',
      payload: {
        id: pageId,
        belong_album_id: info.belong_album_id,
        release_date: info.release_date,
        author_id: splitInfo.map((elem) => elem.author_id),
      },
      callback: res => {
        getData();
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingEditIsrcSplitForm || loadingResetSplit || loading || viewLoading}
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <span className={styles.colorBdCardTitle} style={{ color: color }}>
            分拆比例
          </span>
        }
        cover={cover}
        extra={
          (!isEdit)
            ? (
              <Fragment>
                <Tooltip title="計算">
                  <CalculatorOutlined
                    className={styles.om_icon_style}
                    onClick={() => {
                      if (info.release_date) {
                        resetSplit();
                      } else {
                        commFn.errHandler('需填寫"發行日期"，才可執行計算');
                      }
                    }}
                  />
                </Tooltip>
                &nbsp;&nbsp;
                <EditOutlined
                  className={styles.om_icon_style}
                  onClick={() => { onEditForm(); }}
                />
              </Fragment>
            )
            : (null)
        }
      >
        {
          (!isEdit)
            ? (<ComSplitInfo />)
            : (
              <ComSplitEdit
                isEdit={isEdit}
                isData={tmpData}
                onCancelForm={onCancelForm}
                authorIdList={authorIdList}
                setAuthorIdList={setAuthorIdList}
                setViewLoading={setViewLoading}
                companyIdList={companyIdList}
                setCompanyIdList={setCompanyIdList}
                pageId={pageId}
                onSaveForm={onSaveForm}
              />
            )
        }
      </Card>
    </Spin>
  );
}

export default connect(({ isrcList, loading }) => ({
  isrcList,
  loading: loading.effects['isrcList/fetchGetSplitInfo'],
  loadingEditIsrcSplitForm: loading.effects['isrcList/fetchEditIsrcSplitForm'],
  loadingResetSplit: loading.effects['isrcList/fetchResetSplit'],
}))(ComRecordSplit);