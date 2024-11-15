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

export const ComRecordSplitInfo = props => {
  const {
    albumList: { recordSplit },
  } = props;

  // ui -----
  const columns = [
    {
      title: '結算人',
      dataIndex: 'author_name',
      key: 'author_name',
    },
    {
      title: '比例',
      dataIndex: 'fraction',
      key: 'fraction',
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
      dataSource={recordSplit}
      rowKey="ui_id"
    />
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loading: loading.effects['albumList/fetchGetRecordSplit'],
}))(ComRecordSplitInfo);