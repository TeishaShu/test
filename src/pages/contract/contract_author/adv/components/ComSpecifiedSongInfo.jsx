import React, { useState, useEffect, Fragment } from 'react';
import { CalculatorOutlined, EditOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
  Table,
  Pagination,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComSpecifiedSongInfo = props => {
  const {
    pageSize,
    pageCurrent,
    getData,
    isrcTypeList,
    contractAuthorList: { specifiedSong },
  } = props;

  // ui -----
  const columns = [
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      render: (text, row, index) => {
        return (<Link to={`/album/adv/${row.song_id}`} target="_blank">{text}</Link>)
      }
    },
    {
      title: '歌曲名稱',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: 'ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
    },
    {
      title: '演唱人',
      dataIndex: 'singer',
      key: 'singer',
    },
    {
      title: '型態',
      dataIndex: 'isrc_type_id',
      key: 'isrc_type_id',
      render: (text, row, index) => {
        let filterData = isrcTypeList.listAutoList.filter((elem) => elem.id == text);

        return (filterData.length > 0) ? (filterData[0]['type']) : (text);
      }
    },
  ];

  return (
    <Fragment>
      <Row>
        <Col xs={24}>
          <Table
            pagination={false}
            loading={false}
            columns={columns}
            dataSource={(specifiedSong.data_list) ? (specifiedSong.data_list) : ([])}
            rowKey="id"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Pagination
            className={styles.om_sp_m_lt}
            style={{ textAlign: 'right' }}
            current={pageCurrent}
            pageSize={pageSize}
            total={specifiedSong.total_items}
            onChange={(newPage) => {
              getData(newPage);
            }}
            showSizeChanger={false}
          />
        </Col>
      </Row>

    </Fragment>
  );
}

export default connect(({ isrcTypeList, contractAuthorList, loading }) => ({
  isrcTypeList,
  contractAuthorList,
  loading: loading.effects['contractAuthorList/fetchGetSpecifiedSong'],
}))(ComSpecifiedSongInfo);