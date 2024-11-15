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
    isrcList,
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
      title: '發行公司',
      dataIndex: 'company_nickname',
      key: 'company_nickname',
    },
    {
      title: '發行日期',
      dataIndex: 'release_date',
      key: 'release_date',
    },
    {
      title: '發行地區',
      dataIndex: 'release_country',
      key: 'release_country',
    },
    {
      title: '新媒體 - 錄音曲數計算',
      dataIndex: 'is_nm_record_calc',
      key: 'is_nm_record_calc',
      render: (text, row) => {
        return (
          (text == '1')
            ? (<CheckOutlined className={`${styles.om_icon_style} ${styles.om_color_green2}`} />)
            : (<CloseOutlined className={`${styles.om_icon_style} ${styles.om_color_red}`} />)
        );
      }
    },
  ];

  return (
    <Table
      pagination={false}
      loading={false}
      columns={columns}
      dataSource={(isrcList.info.isrc) ? (belongAlbumInfo) : ([])}
      rowKey="id"
    />
  );
}

export default connect(({ isrcList, albumList, loading }) => ({
  isrcList,
  albumList,
}))(ComAlbumInfo);