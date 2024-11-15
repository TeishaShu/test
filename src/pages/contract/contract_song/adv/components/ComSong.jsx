import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Pagination,
} from 'antd';
import { connect, Link, history } from 'umi';
import styles from '@/style/style.less';

const ComSong = props => {
  const {
    loading,
    contractSongList: { info, rightSongs },
    pageCurrent,
    setPageCurrent,
    getSong,
  } = props;

  // table
  const columns = [
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      render: (text, raw) => {
        return <Link to={`/song/adv/id/${raw.id}`}>
          <span>{text}</span>
        </Link>;
      },
    },
    {
      title: '歌曲名稱',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: 'OT/組曲/節錄',
      dataIndex: 'ot',
      key: 'ot',
    },
    {
      title: '作者筆名',
      dataIndex: 'pen_name',
      key: 'pen_name',
    },
    {
      title: '權利',
      dataIndex: 'song_rights',
      key: 'song_rights',
    },
    {
      title: 'Ctrl%',
      dataIndex: 'rights_ratio',
      key: 'rights_ratio',
    },
  ];

  return (
    (rightSongs && rightSongs.total_items !== 0)
      ? (
        <Card
          bordered={false}
          className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
          title={
            <Fragment>
              <span className={styles.colorBdCardTitle} style={{ color: '#C40000' }}>
                合約相關歌曲</span><span className={styles.colorBdCardTitle2}>&nbsp;共{rightSongs.total_items ? rightSongs.total_items : '0'}筆</span>
            </Fragment>
          }
          // extra={<DownloadOutlined style={{ fontSize: '32px', color: '#0b0b0b' }} />}
          cover={<div style={{ backgroundColor: '#C40000' }} />}
        >
          <Row>
            <Col xs={24}>
              <Table
                pagination={false}
                loading={loading}
                columns={columns}
                dataSource={rightSongs.list}
                rowKey="song_rights_id"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Pagination
                className={styles.om_sp_m_lt}
                style={{ textAlign: 'right' }}
                current={pageCurrent}
                pageSize={5}
                total={rightSongs.total_items ? rightSongs.total_items : 0}
                onChange={
                  (page) => {
                    const nowPage = parseInt(page, 10);
                    setPageCurrent(nowPage);
                    getSong(nowPage);
                  }}
                showSizeChanger={false}
              />
            </Col>
          </Row>
        </Card>
      )
      : (null)
  );
}

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loading: loading.models.contractSongList,
}))(ComSong);