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
import ComSpecifiedSongEdit from './ComSpecifiedSongEdit';
import ComSpecifiedSongInfo from './ComSpecifiedSongInfo';

export const ComSpecifiedSong = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    loadingEditSpecifiedSongForm,
  } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [tmpData, setTmpData] = useState({});
  // 準備刪除
  const [albumSelectList, setAlbumSelectList] = useState([]);
  // 準備新增
  const [songSelectList, setSongSelectList] = useState([]);
  // info
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getData
  const getData = (page, editForm) => {
    dispatch({
      type: 'contractAuthorList/fetchGetSpecifiedSongAndIsrcType',
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
      songs: (obj.data_list) ? (obj.data_list.map((elem) => {
        return { ...elem };
      })) : []
    };

    let tmpSongSelectList = (obj.data_list) ? (obj.data_list.map((elem) => {
      if (elem.id) {
        return ([{
          id: elem.id,
          song_code: elem.song_code,
          song_name: elem.song_name,
        }]);
      }

      return ([]);
    })) : ([]);

    setSongSelectList(tmpSongSelectList);
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
      type: 'contractAuthorList/fetchEditSpecifiedSongForm',
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
      spinning={loadingEditSpecifiedSongForm || loading}
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <span className={styles.colorBdCardTitle} style={{ color: color }}>
            包含歌曲
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
              <ComSpecifiedSongInfo
                pageSize={pageSize}
                pageCurrent={pageCurrent}
                getData={getData}
              />
            )
            : (
              <ComSpecifiedSongEdit
                isEdit={isEdit}
                setViewLoading={setViewLoading}
                isData={tmpData}
                onCancelForm={onCancelForm}
                albumSelectList={albumSelectList}
                setAlbumSelectList={setAlbumSelectList}
                songSelectList={songSelectList}
                setSongSelectList={setSongSelectList}
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
  loading: loading.effects['contractAuthorList/fetchGetSpecifiedSongAndIsrcType'],
  loadingEditSpecifiedSongForm: loading.effects['contractAuthorList/fetchEditSpecifiedSongForm'],
}))(ComSpecifiedSong);