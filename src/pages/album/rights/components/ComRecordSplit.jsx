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
import ComRecordSplitInfo from './ComRecordSplitInfo';
import ComRecordSplitEdit from './ComRecordSplitEdit';

export const ComRecordSplit = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    loadingCalculateRecord,
    loadingEditRecordSplitForm,
    albumList: { recordSplit },
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const [calText, setCalText] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [tmpData, setTmpData] = useState({});
  const [authorIdList, setAuthorIdList] = useState([]);
  const [companyIdList, setCompanyIdList] = useState([]);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetRecordSplit',
      payload: {
        album_id: pageId,
      },
      callback: (res) => {
        let tmpCalText = { n: 1, d: 1 };
        let hasErr = false;
        let tmpFixedNum = 0;

        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (!hasErr) {
              try {
                tmpCalText = commFn.fractionCal(tmpCalText.n, tmpCalText.d, commFn.calMulti(res[i].numerator, 1000), commFn.calMulti(res[i].denominator, 1000), 'sub');
              } catch (e) {
                tmpFixedNum = commFn.calSub(commFn.calDiv(tmpCalText.n, tmpCalText.d), commFn.calDiv(res[i].numerator, res[i].denominator));
              }
            } else {
              tmpFixedNum = commFn.calSub(tmpFixedNum, commFn.calDiv(res[i].numerator, res[i].denominator))
            }
          }
        }

        if (!hasErr) {
          setCalText(tmpCalText);
        } else {
          if (tmpFixedNum < 0) {
            setCalText({ n: 0, d: 0 });
          } else {
            setCalText({ n: commFn.calMulti(parseFloat(tmpFixedNum).toFixed(5), 100), d: 100 });
          }
        }
      }
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
      split: (recordSplit) ? (recordSplit.map((elem) => {
        let tmpElem = { ...elem };

        if (tmpElem.company_id && tmpElem.company_id == '0') {
          tmpElem.company_id = '';
        }

        tmpElem.contract_id = tmpElem.contract_author_id;

        return tmpElem;
      })) : []
    };
    let tmpAuthorIdList = (recordSplit) ? (recordSplit.map((elem) => {
      return ([{
        id: elem.author_id,
        name: elem.author_name,
        author_code: elem.author_code,
      }])
    })) : ([]);
    let tmpCompanyIdList = (recordSplit) ? (recordSplit.map((elem) => {
      if (elem.company_id && elem.company_id != '0') {
        return ([{
          id: elem.company_id,
          name: elem.company_name,
          company_code: elem.company_code,
        }])
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
      type: 'albumList/fetchEditRecordSplitForm',
      payload: saveObj,
      callback: res => {
        if (res && res != 'error') {
          getData();
          setIsEdit(false);
        }
      }
    });
  }

  // calculateRecord
  const calculateRecord = () => {
    dispatch({
      type: 'albumList/fetchCalculateReaord',
      payload: {
        album_id: pageId
      },
      callback: res => {
        getData();
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingEditRecordSplitForm || loadingCalculateRecord || loading || viewLoading}
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <Fragment>
            <span className={styles.colorBdCardTitle} style={{ color: color }}>
              錄音結算
            </span>
            <span className={styles.colorBdCardTitle2}>
              &nbsp;
              未結：
              {
                (calText && ((calText.n == 0 && calText.d == 0) || (calText.n == 0 && calText.d == 1)))
                  ? (0)
                  : (
                    <Fragment>
                      {(calText && calText.d && calText.d.toString().indexOf('-') >= 0 ? '-' : '')}
                      {(calText && calText.n) ? (calText.n) : 0}
                      /
                      {(calText && calText.d) ? (calText.d.toString().replace('-', '')) : 0}
                    </Fragment>
                  )
              }
            </span>
          </Fragment>
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
                      calculateRecord();
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
            ? (<ComRecordSplitInfo />)
            : (
              <ComRecordSplitEdit
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

export default connect(({ albumList, loading }) => ({
  albumList,
  loading: loading.effects['albumList/fetchGetRecordSplit'],
  loadingEditRecordSplitForm: loading.effects['albumList/fetchEditRecordSplitForm'],
  loadingCalculateRecord: loading.effects['albumList/fetchCalculateReaord'],
}))(ComRecordSplit);