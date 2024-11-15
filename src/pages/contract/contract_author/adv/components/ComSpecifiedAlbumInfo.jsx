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

export const ComSpecifiedAlbumInfo = props => {
  const {
    pageSize,
    pageCurrent,
    getData,
    albumList,
    contractAuthorList: { specifiedAlbum },
  } = props;

  // ui -----
  const columns = [
    {
      title: '專輯編號',
      dataIndex: 'album_code',
      key: 'album_code',
      render: (text, row, index) => {
        return (<Link to={`/album/adv/${row.album_id}`} target="_blank">{text}</Link>)
      }
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
    {
      title: '發行地區',
      dataIndex: 'company',
      key: 'company',
      render: (text, row, index) => {
        return (row.country && row.country.country_name_zh) ? (row.country.country_name_zh) : ('');
      }
    },
    {
      title: '專輯型態',
      dataIndex: 'type_id',
      key: 'type_id',
      render: (text, row, index) => {
        let filterData = albumList.optAlbumType.filter((elem) => elem.value == text);

        return (filterData.length > 0) ? (filterData[0]['label']) : ('');
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
            dataSource={(specifiedAlbum.data_list) ? (specifiedAlbum.data_list) : ([])}
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
            total={specifiedAlbum.total_items}
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

export default connect(({ albumList, contractAuthorList, loading }) => ({
  albumList,
  contractAuthorList,
  loading: loading.effects['contractAuthorList/fetchGetSpecifiedAlbum'],
}))(ComSpecifiedAlbumInfo);