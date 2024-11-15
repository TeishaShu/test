import React, { useState, useEffect, Fragment } from 'react';
import { CalculatorOutlined, EditOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
  Table,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComSplitInfo = props => {
  const {
    isrcList: { splitInfo },
  } = props;


  // ui -----
  const columns = [
    {
      title: '演唱人',
      dataIndex: 'author_name',
      key: 'author_name',
    },
    {
      title: '比例',
      dataIndex: 'numerator',
      key: 'numerator',
      render: (text, row, index) => {
        if (row.numerator || row.denominator) {
          return `${row.numerator}/${row.denominator}`;
        }

        return '';
      }
    },
    {
      title: '合約',
      dataIndex: 'contract_code',
      key: 'contract_code',
      render: (text, row, index) => {
        if (row.subcontract_id) {
          return `${text} (子約)`
        }

        return text;
      }
    },
    {
      title: '結算對象',
      dataIndex: 'company_name',
      key: 'company_name',
    },
  ];

  return (
    <Table
      pagination={false}
      loading={false}
      columns={columns}
      dataSource={splitInfo}
      rowKey="id"
    />
  );
}

export default connect(({ isrcList, loading }) => ({
  isrcList,
  loading: loading.effects['isrcList/fetchGetSplitInfo'],
}))(ComSplitInfo);