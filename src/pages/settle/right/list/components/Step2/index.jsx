import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { RightOutlined, DownOutlined, DollarOutlined, ToolOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import ComAlbumList from './ComAlbumList';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const Step2 = props => {
  const {
    selectSettlePhaseId,
    enterpriseList: { agent_eid },
    settleAlbumList: { prepaidList },
    dispatch,
  } = props;
  const [viewLoading, setViewLoading] = useState(false);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'settleAlbumList/fetchGetPrepaidList',
      payload: {
        agent_eid: agent_eid,
        settle_phase_id: selectSettlePhaseId
      },
    });
  }

  // change settle phase
  useEffect(() => {
    getData();
  }, [selectSettlePhaseId]);

  // mount
  useEffect(() => {
    getData();
  }, []);

  return (
    <Card bordered={false}>
      <Row>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <p>2-1. 檢查<Link to='/settle/right/get_album_prepaid' style={{ paddingLeft: '10px' }}>前期扣抵餘額</Link></p>
          <p>2-2. 檢查本期發行<Link to='/settle/right/get_now_album_prepaid' style={{ paddingLeft: '10px' }}>專輯預付</Link></p>
          <ComAlbumList
            albumType="tw"
            getData={getData}
          />
          <ComAlbumList
            albumType="ext"
            getData={getData}
          />
        </Col>
      </Row>
    </Card >
  );
}

export default connect(({ enterpriseList, settleAlbumList, loading }) => ({
  enterpriseList,
  settleAlbumList,
}))(Step2);