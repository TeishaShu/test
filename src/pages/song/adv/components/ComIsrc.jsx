import React, { useState, useEffect, Fragment } from 'react';
import {
  Card,
  Button,
} from 'antd';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComIsrcInfo from './ComIsrcInfo';

export const ComIsrc = props => {
  const {
    color,
    dispatch,
    songList: { multiChangeId, info, iSRCListBySong },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'songList/fetchGetISRCListBySong',
      payload: {
        song_code: info.song_code,
      },
    });
  }

  // mount
  useEffect(() => {
    if (info.song_code) {
      getData();
    }
  }, [multiChangeId]);

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  return (
    <Card
      bordered={false}
      className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      title={
        <Fragment>
          <span className={styles.colorBdCardTitle} style={{ color: color }}>錄音資料</span>
          <span className={styles.colorBdCardTitle2}>
            &nbsp;
            {`共${(info.song_code && iSRCListBySong && iSRCListBySong.data_list)
              ? (iSRCListBySong.data_list.length)
              : (0)
              }筆`}
          </span>
        </Fragment>
      }
      cover={cover}
      extra={
        <Button
          type="primary"
          className={styles.om_sp_m_lb}
          onClick={() => {
            history.push(`/isrc/update/song_code/${info.song_code}`);
          }}
        >新增 ISRC</Button>
      }
    >
      <ComIsrcInfo />
    </Card>
  );
}

export default connect(({ songList, albumList, loading }) => ({
  songList,
  albumList,
}))(ComIsrc);