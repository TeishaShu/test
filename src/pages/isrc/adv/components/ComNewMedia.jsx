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
// import ComSplitEdit from './ComSplitEdit';

export const ComRecordSplit = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    isrcList: { multiChangeId, info, songMedia },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'isrcList/fetchGetSongMedia',
      payload: {
        isrc: info.isrc,
      },
    });
  }

  // mount
  useEffect(() => {
    if (info.isrc) {
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
            {`共${(info.isrc && songMedia && songMedia.data_list)
                ? (songMedia.data_list.length)
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

export default connect(({ isrcList, loading }) => ({
  isrcList,
  loading: loading.effects['isrcList/fetchGetSongMedia'],
}))(ComRecordSplit);