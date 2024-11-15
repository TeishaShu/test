
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Pagination,
  Table,
} from 'antd';
import { Link, connect } from 'umi';
import globalSettings from '@/fn/globalsettings';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';

const ComContractSong = props => {
  const {
    loading,
    dispatch,
    paramId,  // is company_id
    contractSongList: { changeId, list },
  } = props;
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'contractSongList/fetchGetList',
      payload: {
        type: 'party_b_company_id',
        keyword: paramId,
        precise: 1,
        page_current: (obj && obj.pageCurrent) ? obj.pageCurrent.toString() : pageCurrent.toString(),
      },
    });
  }

  // updateData
  useEffect(() => {
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
    });
  }, [paramId]);

  // ui -----
  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table columns
  const columns = [
    {
      title: '合約編號',
      dataIndex: 'contract_code',
      key: 'contract_code',
      render: (text, row, index) => {
        return (<Link to={`/contract/contract_song/adv/id/${row.id}`}>{text}</Link>);
      },
    },
    {
      title: '簽約對象',
      dataIndex: 'party_b_object_name',
      key: 'party_b_object_name',
    },
    {
      title: '簽約單位',
      dataIndex: 'party_b_company_name',
      key: 'party_b_company_name',
    },
    {
      title: '合約開始日',
      dataIndex: 'contract_start_date',
      key: 'contract_start_date',
    },
    {
      title: '合約到期日',
      dataIndex: 'contract_end_date',
      key: 'contract_end_date',
    },
    {
      title: '合約有效日',
      dataIndex: 'contract_expiry_date',
      key: 'contract_expiry_date',
    },
    {
      title: '代理到期日',
      dataIndex: 'contract_agency_end',
      key: 'contract_agency_end',
    },
  ];

  return (
    <Fragment>
      <Card bordered={false}>
        <Row>
          <Col xs={24}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={list.total_items}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={list.total_items}
              pageSize={pageSize}
              changeId={changeId}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
    </Fragment>

  );
};

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loading: loading.models.contractSongList,
}))(ComContractSong);