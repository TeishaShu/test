import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Steps,
  Row,
  Col,
  Spin,
  Select,
} from 'antd';
import styles from '@/style/style.less';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

const { Step } = Steps;
const { Option } = Select;

export const reco = props => {
  const {
    loadingSettlePhaseList,
    loadingAlbumList,
    loadingSettleReportList,
    loadingSettleSouvenirList,
    loadingSettleMediaList,
    settlePhaseList,
    settleAlbumList: { changeId, list },
    enterpriseList,
    dispatch,
    match,
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const [selectSettlePhaseId, setSelectSettlePhaseId] = useState('');
  const [selectSouvSettlePhaseId, setSelectSouvSettlePhaseId] = useState('');
  const [selectNewmediaRecPhaseId, setSelectNewmediaRecPhaseId] = useState('');
  const [settlePhaseIdOpt, setSettlePhaseIdOpt] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepComponent, setStepComponent] = useState(null);
  const divStyle = { maxWidth: '1000px', margin: '0 auto', padding: '30px 0 0 0' };

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'settleAlbumList/fetchGetRecordPhaseLists',
      payload: { type: '2', agent_eid: enterpriseList.agent_eid, },
      callback: (result, resultSouv, resultNewMediaRec) => {
        let tmpSouvPhaseId = '';
        let tmpNewMediaRecPhaseId = '';

        if (result != '' && result != 'error') {
          if (result && result.length > 0) {
            setSettlePhaseIdOpt(result.map((elem) => ({ value: elem.id, label: elem.phase })));
            setSelectSettlePhaseId(result[0].id);

            if (resultSouv && resultSouv.current && resultSouv.current.id) {
              tmpSouvPhaseId = resultSouv.current.id;
              setSelectSouvSettlePhaseId(tmpSouvPhaseId);
            }

            if (resultNewMediaRec && resultNewMediaRec.current && resultNewMediaRec.current.id) {
              tmpNewMediaRecPhaseId = resultNewMediaRec.current.id;
              setSelectNewmediaRecPhaseId(tmpNewMediaRecPhaseId);
            }

            changeStep(0, result[0].id, tmpSouvPhaseId, true, tmpNewMediaRecPhaseId);
          }
        } else {
          setSelectSouvSettlePhaseId('');
          setSelectSettlePhaseId('');
          changeStep();
        }
      }
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // ui -----
  const getCurrentComponent = (current, phaseId, souvPhaseId, newMediaRedPhaseId) => {
    switch (current) {
      case 1:
        return <Step2 selectSettlePhaseId={phaseId} selectSouvSettlePhaseId={souvPhaseId} selectNewmediaRecPhaseId={newMediaRedPhaseId} setViewLoading={setViewLoading} />;
      case 2:
        return <Step3 selectSettlePhaseId={phaseId} parentGetData={getData} selectNewmediaRecPhaseId={newMediaRedPhaseId} setViewLoading={setViewLoading} />;
      case 0:
        return <Step1 selectSettlePhaseId={phaseId} selectSouvSettlePhaseId={souvPhaseId} selectNewmediaRecPhaseId={newMediaRedPhaseId} />;
      default:
        return null;
    }
  };

  const changeStep = (current, phaseId, souvPhaseId, isInit, newMediaRecPhaseId) => {
    let currentNum = current;

    if (!isInit && (settlePhaseIdOpt.length == 0 || settlePhaseIdOpt[0].value != phaseId)) {
      currentNum = 2;
    }

    setStepComponent(getCurrentComponent(currentNum, phaseId, souvPhaseId, newMediaRecPhaseId));
    setCurrentStep(currentNum);
  }

  const changeSettlePhase = (val) => {
    setSelectSettlePhaseId(val);
    changeStep(currentStep, val, selectSouvSettlePhaseId, false, selectNewmediaRecPhaseId);
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingSettlePhaseList || loadingAlbumList || loadingSettleReportList || loadingSettleSouvenirList || loadingSettleMediaList || viewLoading}
    >
      <PageHeaderWrapper
        title="錄音結算"
        content={
          <Select
            style={{ width: '400px' }}
            value={selectSettlePhaseId}
            onChange={(val) => {
              changeSettlePhase(val);
            }}
            options={settlePhaseIdOpt}
          />
        }
      >
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd}`}
        >
          <Row gutter={[8, 40]}>
            <Col xs={24}>
              <div style={divStyle}>
                <Steps
                  current={currentStep}
                  onChange={(current) => {
                    changeStep(current, selectSettlePhaseId, selectSouvSettlePhaseId, false, selectNewmediaRecPhaseId);
                  }}
                >
                  <Step title="匯入銷售量" />
                  <Step title="計算/調整" />
                  <Step title="匯出報表" />
                </Steps>
              </div>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <div style={divStyle}>
                {stepComponent}
              </div>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ settlePhaseList, settleAlbumList, enterpriseList, loading }) => ({
  settlePhaseList,
  settleAlbumList,
  enterpriseList,
  loadingSettlePhaseList: loading.models.settlePhaseList,
  loadingAlbumList: loading.models.settleAlbumList,
  loadingSettleReportList: loading.models.settleReportList,
  loadingSettleSouvenirList: loading.models.settleSouvenirList,
  loadingSettleMediaList: loading.models.settleMediaList,
}))(reco);