import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
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
import ComSpecifiedAlbumEdit from './ComSpecifiedAlbumEdit';
import ComSpecifiedAlbumInfo from './ComSpecifiedAlbumInfo';

export const ComSpecifiedAlbum = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    loadingEditSpecifiedAlbumForm,
  } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [tmpData, setTmpData] = useState({});
  const [albumSelectList, setAlbumSelectList] = useState([]);
  // info
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getData
  const getData = (page, editForm) => {
    dispatch({
      type: 'contractAuthorList/fetchGetSpecifiedAlbum',
      payload: {
        contract_author_id: pageId,
        page_current: (editForm) ? (undefined) : (pageCurrent),
      },
      callback: res => {
        if (editForm) {
          onEditForm(res);
        }
      }
    });
  }

  // mount, update id
  useEffect(() => {
    getData(1);
    setPageCurrent(1);
  }, [pageId]);

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  // onEditForm
  const onEditForm = (obj) => {
    // set tmp data
    let newTmpData = {
      albums: (obj.data_list) ? (obj.data_list.map((elem) => {
        return { ...elem };
      })) : []
    };
    let tmpAlbumSelectList = (obj.data_list) ? (obj.data_list.map((elem) => {
      if (elem.id) {
        return ([{
          id: elem.album_id,
          album_name_zh: elem.album_name_zh,
          album_code: elem.album_code,
          release_country: (elem.country && elem.country.country_name_zh) ? (elem.country.country_name_zh) : (''),
          type_id: elem.type_id,
        }]);
      }

      return ([]);
    })) : ([]);

    setAlbumSelectList(tmpAlbumSelectList);
    setTmpData(newTmpData);
    setIsEdit(true);
  }

  // onCancelForm
  const onCancelForm = () => {
    getData(1);
    setPageCurrent(1);
    setIsEdit(false);
  }

  // onSaveForm
  const onSaveForm = (saveObj) => {
    dispatch({
      type: 'contractAuthorList/fetchEditSpecifiedAlbumForm',
      payload: saveObj,
      callback: res => {
        if (res && res != 'error') {
          getData(1);
          setPageCurrent(1);
          setIsEdit(false);
        }
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingEditSpecifiedAlbumForm || loading}
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <span className={styles.colorBdCardTitle} style={{ color: color }}>
            限定專輯
          </span>
        }
        cover={cover}
        extra={
          (!isEdit)
            ? (
              <EditOutlined
                className={styles.om_icon_style}
                onClick={() => {
                  getData(null, true);
                }}
              />
            )
            : (null)
        }
      >
        {
          (!isEdit)
            ? (
              <ComSpecifiedAlbumInfo
                pageSize={pageSize}
                pageCurrent={pageCurrent}
                getData={getData}
              />
            )
            : (
              <ComSpecifiedAlbumEdit
                isEdit={isEdit}
                isData={tmpData}
                onCancelForm={onCancelForm}
                albumSelectList={albumSelectList}
                setAlbumSelectList={setAlbumSelectList}
                pageId={pageId}
                onSaveForm={onSaveForm}
              />
            )
        }
      </Card>
    </Spin>
  );
}

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
  loading: loading.effects['contractAuthorList/fetchGetSpecifiedAlbum'],
  loadingEditSpecifiedAlbumForm: loading.effects['contractAuthorList/fetchEditSpecifiedAlbumForm'],
}))(ComSpecifiedAlbum);