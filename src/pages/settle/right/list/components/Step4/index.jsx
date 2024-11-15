import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { Link, connect, history } from 'umi';
import ComExportTable from '../../../../components/ComExportTable';

const Step4 = props => {
  const {
    settlePhaseList,
    enterpriseList: { agent_eid },
    settleReportList: { reportList },
    dispatch,
    selectSettlePhaseId,
    parentGetData,
    setViewLoading,
  } = props;
  const uiType = 'righ';

  // getData
  const getData = () => {
    let tmpSettlePhaseList = (settlePhaseList.phaseList) ? (settlePhaseList.phaseList.filter((elem) => elem.id == selectSettlePhaseId)) : ([]);
    let tmpSettlePhaseStart = '';
    let tmpSettlePhaseEnd = '';

    if (tmpSettlePhaseList.length > 0) {
      tmpSettlePhaseStart = tmpSettlePhaseList[0]['phase_start'];
      tmpSettlePhaseEnd = tmpSettlePhaseList[0]['phase_end'];
    }

    dispatch({
      type: 'settleReportList/fetchGetReportList',
      payload: {
        agent_eid: agent_eid,
        settle_type: 'righ',
        settle_phase_start: tmpSettlePhaseStart,
        settle_phase_end: tmpSettlePhaseEnd,
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
        >
          <p>4-1. 匯出報表</p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <ComExportTable
          uiType={uiType}
          settleType="op_company"
          data={reportList}
          selectSettlePhaseId={selectSettlePhaseId}
          setViewLoading={setViewLoading}
        />
        <ComExportTable
          uiType={uiType}
          settleType="op_author"
          data={reportList}
          selectSettlePhaseId={selectSettlePhaseId}
          setViewLoading={setViewLoading}
        />
      </Row>
    </Card>
  );
}

export default connect(({ settlePhaseList, enterpriseList, settleAlbumList, settleReportList, loading }) => ({
  settlePhaseList,
  enterpriseList,
  settleAlbumList,
  settleReportList,
}))(Step4);