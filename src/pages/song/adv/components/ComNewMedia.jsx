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
import ComNewMediaInfo from './ComNewMediaInfo';

export const ComRecordSplit = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    songList: { multiChangeId, info, songMediaListBySong },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'songList/fetchGetSongMediaListBySong',
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
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <Fragment>
            <span className={styles.colorBdCardTitle} style={{ color: color }}>
              新媒體歌編
            </span>
            <span className={styles.colorBdCardTitle2}>
              &nbsp;
            {`共${(info.song_code && songMediaListBySong)
                ? (songMediaListBySong.length)
                : (0)
                }筆`}
            </span>
          </Fragment>
        }
        cover={cover}
      >
        <ComNewMediaInfo />
      </Card>
    </Spin>
  );
}

export default connect(({ songList, loading }) => ({
  songList,
  loading: loading.effects['songList/fetchGetSongMediaListBySong'],
}))(ComRecordSplit);