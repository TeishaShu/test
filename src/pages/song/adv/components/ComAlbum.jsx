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
    songList,
    albumList: { belongAlbumInfo },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetBelongAlbumInfo',
      payload: {
        search_type: 'song_code',
        keyword: songList.info.song_code,
      },
    });
  }

  // mount
  useEffect(() => {
    if (songList.info.song_code) {
      getData();
    }
  }, [songList.multiChangeId]);

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
            {`共${(songList.info.song_code && belongAlbumInfo)
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

export default connect(({ songList, albumList, loading }) => ({
  songList,
  albumList,
}))(ComAlbum);