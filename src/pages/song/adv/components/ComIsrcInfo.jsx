import React, { useState, useEffect, Fragment } from 'react';
import { AudioOutlined, DesktopOutlined } from '@ant-design/icons';
import {
  Table,
  Tooltip,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComIsrcInfo = props => {
  const {
    songList: { info, iSRCListBySong },
  } = props;

  // ui -----
  const columns = [
    {
      title: 'ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
      render: (text, row, index) => {
        return (
          <Link
            to={`/isrc/adv/${row.id}`}
            target="_blank"
          >
            {text}
          </Link>
        );
      }
    },
    {
      title: '演唱人',
      dataIndex: 'singer',
      key: 'singer',
    },
    {
      title: '',
      dataIndex: 'data_type',
      key: 'data_type',
      render: (text, row, index) => {
        if (text == '1') {
          return (<Tooltip title="Vocal"><AudioOutlined className={styles.om_icon_style} /></Tooltip>);
        } else {
          return (<Tooltip title="Video"><DesktopOutlined className={styles.om_icon_style} /></Tooltip>);
        }
      },
    },
    {
      title: '出版型態',
      dataIndex: 'isrc_type',
      key: 'isrc_type',
    },
    {
      title: '母帶歸屬',
      dataIndex: 'tape_company',
      key: 'tape_company',
      render: (text, row, index) => {
        let renHtml = [];

        if (text) {
          for (let i = 0; i < text.length; i++) {
            if (i == text.length - 1) {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}</span>);
            } else {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}< br /></span>);
            }
          }
        }

        return renHtml;
      }
    },
    {
      title: '授權地區',
      dataIndex: 'release_area_name',
      key: 'release_area_name',
    },
  ];

  return (
    <Table
      pagination={false}
      loading={false}
      columns={columns}
      dataSource={(info.song_code) ? (iSRCListBySong && iSRCListBySong.data_list) : ([])}
      rowKey="id"
    />
  );
}

export default connect(({ songList, albumList, loading }) => ({
  songList,
  albumList,
}))(ComIsrcInfo);