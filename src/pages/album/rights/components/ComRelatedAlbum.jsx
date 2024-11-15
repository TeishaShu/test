import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Spin,
  Table,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComRelatedAlbum = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    albumList: { relatedAlbum },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchGetRelatedAlbum',
      payload: {
        album_id: pageId,
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

  const columns = [
    {
      title: '專輯編號',
      dataIndex: 'album_code',
      key: 'album_code',
      render: (text, row, index) => {
        return (<Link to={`/album/adv/${row.id}`}>{text}</Link>);
      }
    },
    {
      title: '專輯名稱',
      dataIndex: 'album_name',
      key: 'album_name',
    },
    {
      title: '發行地區',
      dataIndex: 'release_country',
      key: 'release_country',
    },
    {
      title: '曲數',
      dataIndex: 'song_count',
      key: 'song_count',
    },
  ];

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <Card
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title={
          <span className={styles.colorBdCardTitle} style={{ color: color }}>
            相關專輯
          </span>
        }
        cover={cover}
        extra={''}
      >
        <Table
          pagination={false}
          loading={false}
          columns={columns}
          dataSource={relatedAlbum}
          rowKey="album_code"
        />
      </Card>
    </Spin>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loading: loading.effects['albumList/fetchGetRelatedAlbum'],
}))(ComRelatedAlbum);