import React, { useState, useEffect, Fragment } from 'react';
import { PageHeaderWrapper, } from '@ant-design/pro-layout';
import {
  Spin,
  Card,
  Alert,
  Table, Tag, Space, Row, Col
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';

export const ComMisc = props => {
  const {
    dispatch,
    miscList,
    settleMediaList,
    loadingTable,
    loadingDate,
    enterpriseList,
    pageId,
    phase_type_state,
  } = props;

  useEffect(() => {
    // 結算期別 api
    dispatch({
      type: 'settleMediaList/fetchGetPhaseList',
      payload: {
        type: phase_type_state,
        routerId: pageId, // 到 reducers 判斷的
        agent_eid: enterpriseList.agent_eid,
      }
    });

    // table api
    dispatch({
      type: 'miscList/fetchGetSettleView',
      payload: {
        phase_type: phase_type_state,
        phase_id: pageId,
        agent_eid: enterpriseList.agent_eid,
      }
    });
  }, [])

  const columns = [
    {
      title: '產品編號',
      dataIndex: 'product_code',
      key: 'product_code'
    },
    {
      title: '產品名稱',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: '發行日期',
      dataIndex: 'product_date',
      key: 'product_date',
    },
    {
      title: '使用者',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: '產品型態',
      dataIndex: 'use_type_name',
      key: 'use_type_name',
      render: (text) => {
        const optType = { 1: '營業用單曲', 2: 'MIDI' };
        if (text === '1' || text === '2') {
          return optType[text]
        } else {
          return text
        }
      }
    },
    {
      title: 'ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
      className: (phase_type_state === '1') ? 'hideColumn' : '', //1.不用
    },
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      className: (phase_type_state === '2') ? 'hideColumn' : '', //2.不用
    },
    {
      title: '歌名',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: '使用方式',
      dataIndex: 'type',
      key: 'type',
      className: (phase_type_state === '2') ? 'hideColumn' : '', //2.不用
      render: text => (
        <span style={{ textTransform: "capitalize" }}>{text.split("_").join(" ")}</span>
      )
    },
    {
      title: '版稅收入(未稅)',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '',
      dataIndex: 'total',
      key: 'total',
      render: (text, row) => {
        const number = Number(text);
        if (text !== 0) {
          // 加入 style
          if (row.other_type === "general") {
            return {
              children: text,
              props: { className: styles.om_bg_green }
            }
          } else {
            return {
              children: text,
              props: { className: styles.om_bg_yellow }
            }
          }
        }
      },
    }
  ];

  return (
    <Spin
      tip="Loading..."
      spinning={loadingTable || loadingDate}
    >
      <PageHeaderWrapper
        title="其他授權清單"
        content={`計算期別：${(settleMediaList.phaseList && settleMediaList.phaseList.id) ? (settleMediaList.phaseList.phase) : ""}`}
      >
        <Card bordered={false}>
          <Row gutter={[0, 24]}>
            <Col xs={24}>
              {(miscList.settleView && miscList.settleView.data) && (
                <Alert message={`報表資料共 ${miscList.settleView.data.length} 筆，金額：$${miscList.settleView.total}`} type="info" showIcon />
              )}

            </Col>
            <Col xs={24}
              className={styles.om_overflow_auto}
            >
              {(miscList.settleView && miscList.settleView.data) && (
                <Table
                  columns={columns}
                  dataSource={miscList.settleView.data}
                  pagination={false}
                  rowKey="ui_id"
                  className={styles.mainTable}
                />
              )}
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
}

// export default ComMisc;
export default connect(({ miscList, settleMediaList, loading, enterpriseList }) => ({
  miscList,
  settleMediaList,
  loadingTable: loading.models.miscList,
  loadingDate: loading.models.settleMediaList,
  enterpriseList
}))(ComMisc);