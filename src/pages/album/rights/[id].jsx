import React, { useState, useEffect, Fragment } from 'react';
import {
  Modal,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComRelatedAlbum from './components/ComRelatedAlbum';
import ComRecordSplit from './components/ComRecordSplit';
import ComSongSplit from './components/ComSongSplit';
import ComDisc from './components/ComDisc';

export const rights = props => {
  const {
    loading,
    dispatch,
    albumList: { info },
    match
  } = props;
  const { confirm } = Modal;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetInfo',
      payload: {
        album_id: match.params.id,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${info.album_code} - ${info.album_name_zh}`}
      >
        <ComRelatedAlbum
          pageId={match.params.id}
          color="#006DB8"
        />
        <ComRecordSplit
          pageId={match.params.id}
          color="#FF7D27"
        />
        <ComSongSplit
          pageId={match.params.id}
          color="#4F4F4F"
        />
        <ComDisc
          pageId={match.params.id}
        />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loading: loading.effects['albumList/fetchGetInfo'],
}))(rights);