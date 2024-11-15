
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
import commFn from '@/fn/comm';

const ComContractAuthor = props => {
  const {
    loading,
    dispatch,
    pageId,  // is author_id
    contractAuthorList: { changeId, list },
  } = props;
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchGetList',
      payload: {
        column: 'author_id',
        keyword: pageId,
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
  }, [pageId]);

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
        return {
          children: (row.contract_code) ? (<Link to={`/contract/contract_author/adv/${row.id}`}>{text}</Link>) : (row.subcontract_code),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      },
    },
    {
      title: '簽約對象',
      dataIndex: 'party_b_object_company',
      key: 'party_b_object_company',
      render: (text, row, index) => {
        return {
          children: (row.party_b_object_company)
            ? (row.party_b_object_company.name)
            : (
              (row.party_b_object_author)
                ? (row.party_b_object_author.name)
                : ('')
            ),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      }
    },
    {
      title: '簽約單位',
      dataIndex: 'party_b_company',
      key: 'party_b_company',
      render: (text, row, index) => {
        return {
          children: text,
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      }
    },
    {
      title: '合約開始日',
      dataIndex: 'contract_start_date',
      key: 'contract_start_date',
      render: (text, row, index) => {
        return {
          children: text,
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      }
    },
    {
      title: '合約到期日',
      dataIndex: 'contract_end_date',
      key: 'contract_end_date',
      render: (text, row, index) => {
        return {
          children: !commFn.convertToBool(row.is_permanent) ? (text) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      }
    },
    {
      title: '合約有效日',
      dataIndex: 'contract_expiry_date',
      key: 'contract_expiry_date',
      render: (text, row, index) => {
        return {
          children: !commFn.convertToBool(row.is_permanent) ? (text) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      }
    },
    {
      title: '續約年限',
      dataIndex: 'renewal_period',
      key: 'renewal_period',
      render: (text, row, index) => {
        return {
          children: !commFn.convertToBool(row.is_permanent) ? (text) : (''),
          props: (checkIsContractTermination(row) ? isContractTerminationColor : '')
        };
      }
    },
  ];

  // checkIsContractTermination
  const checkIsContractTermination = (data) => {
    if (!data) {
      return false;
    }

    // !永久 && (('合約提前終止' && ('合約提前終止' - 當天日期) < 0) || (!'合約提前終止' && '合約有效日' ('合約有效日' - 當天日期) < 0)) 則顯示 Alert 及隱藏相關按鈕
    if (data.is_permanent != '1' && ((data.contract_termination_date && (((new Date(data.contract_termination_date) - new Date()) / 1000 / 60 / 60 / 24) < -1)) || (!data.contract_termination_date && !data.contract_expiry_date && (((new Date(data.contract_expiry_date) - new Date()) / 1000 / 60 / 60 / 24) < -1)))) {
      return true;
    } else {
      return false;
    }
  }

  // isContractTerminationColor
  const isContractTerminationColor = { style: { backgroundColor: '#DBDBDB' } };

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

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
  loading: loading.models.contractAuthorList,
}))(ComContractAuthor);