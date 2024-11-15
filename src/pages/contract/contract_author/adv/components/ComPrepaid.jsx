import React, { useState, useEffect, Fragment } from 'react';
import { EditOutlined } from '@ant-design/icons';

import {
  Row,
  Col,
  Card,
  Spin,
  Table,
  Button,
} from 'antd';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComPrepaid = props => {
  const {
    pageId,
    color,
    dispatch,
    loading,
    contractAuthorList: { prepaid },
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'contractAuthorList/fetchGetPrepaid',
      payload: {
        contract_author_id: pageId,
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
      title: '應支付日期',
      dataIndex: 'payable_date',
      key: 'payable_date',
      render: (text, row, index) => {
        if (text) {
          return `${text}前`;
        }

        return '';
      }
    },
    {
      title: '實際支付日期',
      dataIndex: 'payment_date',
      key: 'payment_date',
    },
    {
      title: '可扣抵區間',
      dataIndex: 'debited_start_date',
      key: 'debited_start_date',
      render: (text, row, index) => {
        return `${(row.debited_start_date) ? (row.debited_start_date) : ''} - ${(row.debited_end_date) ? (row.debited_end_date) : ('')}`;
      }
    },
    {
      title: '台幣金額 (未稅)',
      dataIndex: 'before_tax',
      key: 'before_tax',
    },
    {
      title: '餘額',
      dataIndex: 'balance',
      key: 'balance',
      render: (text) => {
        return (text) ? (text) : ('-');
      }
    },
    {
      title: '適用專輯',
      dataIndex: 'album_coverage',
      key: 'album_coverage',
      render: (text, row, index) => {
        if (text == '2') {
          let renHtml = [];

          if (text) {
            for (let i = 0; i < row.specified_albums.length; i++) {
              let sItem = row.specified_albums;
              if (i == sItem.length - 1) {
                renHtml.push(<span key={`spAlbum_${index}_${i}`}>{sItem[i].album_name_zh} ({sItem[i].album_code})</span>);
              } else {
                renHtml.push(<span key={`spAlbum_${index}_${i}`}>{sItem[i].album_name_zh} ({sItem[i].album_code})< br /></span>);
              }
            }
          }

          return renHtml;
        } else if (text == '1') {
          return '全部';
        } else {
          return '無';
        }
      }
    },
    {
      title: '適用單曲/ISRC',
      dataIndex: 'song_coverage',
      key: 'song_coverage',
      render: (text, row, index) => {
        if (text == '2') {
          let renHtml = [];

          if (text) {
            for (let i = 0; i < row.specified_songs.length; i++) {
              let sItem = row.specified_songs;
              if (i == sItem.length - 1) {
                renHtml.push(<span key={`spSong_${index}_${i}`}>{`${sItem[i].song_name} (${sItem[i].isrc})`}</span>);
              } else {
                renHtml.push(<span key={`spSong_${index}_${i}`}>{`${sItem[i].song_name} (${sItem[i].isrc})`}< br /></span>);
              }
            }
          }

          return renHtml;
        } else if (text == '1') {
          return '全部';
        } else {
          return '無';
        }
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {

        return (
          (row.balance)
            ? ('')
            : (
              <Link to={`/contract/contract_author/prepaid/contract_id/${row.contract_id}/prepaid_id/${text}`}>
                <EditOutlined className={styles.om_icon_style} />
              </Link>
            )
        );
      }
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
          <Fragment>
            <span className={styles.colorBdCardTitle} style={{ color: color }}>預付</span>
            <span className={styles.colorBdCardTitle2}>&nbsp;{`共${(prepaid && prepaid.data_list) ? (prepaid.data_list.length) : '0'}筆`}</span>
          </Fragment>
        }
        cover={cover}
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push(`/contract/contract_author/prepaid/contract_id/${pageId}`);
            }}
          >
            新增預付
          </Button>
        }
      >
        <Table
          pagination={false}
          loading={false}
          columns={columns}
          dataSource={(prepaid.data_list) ? (prepaid.data_list) : ([])}
          rowKey="id"
        />
      </Card>
    </Spin>
  );
}

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
  loading: loading.effects['contractAuthorList/fetchGetPrepaid'],
}))(ComPrepaid);