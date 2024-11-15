import React, { useState, useEffect, Fragment } from 'react';
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
import ComAlbumInfo from './ComAlbumInfo';

export const ComAlbum = props => {
  const {
    color,
    dispatch,
    isrcList,
    albumList: { belongAlbumInfo },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetBelongAlbumInfo',
      payload: {
        search_type: 'isrc',
        keyword: isrcList.info.isrc,
      },
    });
  }

  // mount
  useEffect(() => {
    if (isrcList.info.isrc) {
      getData();
    }
  }, [isrcList.multiChangeId]);

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  return (
    <Card
      bordered={false}
      className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      title={
        <Fragment>
          <span className={styles.colorBdCardTitle} style={{ color: color }}>收錄專輯</span>
          <span className={styles.colorBdCardTitle2}>
            &nbsp;
            {`共${(isrcList.info.isrc && belongAlbumInfo)
              ? (belongAlbumInfo.length)
              : (0)
              }筆`}
          </span>
        </Fragment>
      }
      cover={cover}
    >
      <ComAlbumInfo />
    </Card>
  );
}

export default connect(({ isrcList, albumList, loading }) => ({
  isrcList,
  albumList,
}))(ComAlbum);