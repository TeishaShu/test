import React, { useState, useEffect, Fragment } from 'react';
import { StarOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
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

export const ComAlbumInfo = props => {
  const {
    songList,
    albumList: { belongAlbumInfo },
  } = props;

  // ui -----
  const columns = [
    {
      title: '專輯編號',
      dataIndex: 'album_code',
      key: 'album_code',
      render: (text, row, index) => {
        return (
          <Link
            to={`/album/adv/${row.id}`}
            target="_blank"
          >
            {text}
          </Link>
        );
      }
    },
    {
      title: '',
      dataIndex: 'is_debut',
      key: 'is_debut',
      align: 'right',
      width: '52px',
      render: (text, row) => {
        return row.is_debut === '1' ? <StarOutlined className={styles.om_icon_style} /> : null;
      },
    },
    {
      title: '專輯名稱',
      dataIndex: 'album_name_zh',
      key: 'album_name_zh',
    },
    {
      title: '發行日期',
      dataIndex: 'release_date',
      key: 'release_date',
    },
  ];

  return (
    <Table
      pagination={false}
      loading={false}
      columns={columns}
      dataSource={(songList.info.song_code) ? (belongAlbumInfo) : ([])}
      rowKey="id"
    />
  );
}

export default connect(({ songList, albumList, loading }) => ({
  songList,
  albumList,
}))(ComAlbumInfo);