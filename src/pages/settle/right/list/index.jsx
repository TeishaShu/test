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
import Step4 from './components/Step4';

const { Step } = Steps;
const { Option } = Select;

const right = props => {
  const {
    loadingSettlePhaseList,
    loadingAlbumList,
    loadingMediaList,
    loadingSettleReportList,
    dispatch,
    enterpriseList,
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const [selectSettlePhaseId, setSelectSettlePhaseId] = useState('');
  const [selectNewmediaRighPhaseId, setSelectNewmediaRighPhaseId] = useState('');
  const [settlePhaseIdOpt, setSettlePhaseIdOpt] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepComponent, setStepComponent] = useState(null);
  const divStyle = { maxWidth: '1000px', margin: '0 auto', padding: '30px 0 0 0' };

  // api -----
  const getData = () => {
    dispatch({
      type: 'settleAlbumList/fetchGetRightPhaseLists',
      payload: { type: '1', agent_eid: enterpriseList.agent_eid, },
      callback: (result, resultNewMediaRigh) => {
        let tmpSelectNewmediaRighPhaseId = '';

        if (result != '' && result != 'error') {
          if (result && result.length > 0) {
            // console.log('result', result)
            setSettlePhaseIdOpt(result.map((elem) => ({ value: elem.id, label: elem.phase })));
            setSelectSettlePhaseId(result[0].id);

            if (resultNewMediaRigh && resultNewMediaRigh.current && resultNewMediaRigh.current.id) {
              tmpSelectNewmediaRighPhaseId = resultNewMediaRigh.current.id;
              setSelectNewmediaRighPhaseId(tmpSelectNewmediaRighPhaseId);
            }

            changeStep(0, result[0].id, true, tmpSelectNewmediaRighPhaseId);
          }
        }
      }
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);
  // ui -----
  const getCurrentComponent = (current, phaseId, newMeidaRighPhaseId) => {
    switch (current) {
      case 1:
        return <Step2 selectSettlePhaseId={phaseId} selectNewmediaRighPhaseId={newMeidaRighPhaseId} />;
      case 2:
        return <Step3 selectSettlePhaseId={phaseId} selectNewmediaRighPhaseId={newMeidaRighPhaseId} setViewLoading={setViewLoading} />;
      case 3:
        return <Step4 selectSettlePhaseId={phaseId} parentGetData={getData} selectNewmediaRighPhaseId={newMeidaRighPhaseId} setViewLoading={setViewLoading} />;
      case 0:
        return <Step1 selectSettlePhaseId={phaseId} selectNewmediaRighPhaseId={newMeidaRighPhaseId} />;
      default:
        return null;
    }
  };

  const changeStep = (current, phaseId, isInit, newMeidaRighPhaseId) => {
    let currentNum = current;

    if (!isInit && (settlePhaseIdOpt.length == 0 || settlePhaseIdOpt[0].value != phaseId)) {
      currentNum = 3;
    }

    setStepComponent(getCurrentComponent(currentNum, phaseId, newMeidaRighPhaseId));
    setCurrentStep(currentNum);
  }

  const changeSettlePhase = (val) => {
    setSelectSettlePhaseId(val);
    changeStep(currentStep, val, false, selectNewmediaRighPhaseId);
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingSettlePhaseList || loadingAlbumList || loadingMediaList || loadingSettleReportList || viewLoading}
    >
      <PageHeaderWrapper
        title="詞曲結算"
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
                    changeStep(current, selectSettlePhaseId, false, selectNewmediaRighPhaseId);
                  }}
                >
                  <Step title="匯入銷售量" />
                  <Step title="檢查預付" />
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

export default connect(({ settleAlbumList, enterpriseList, loading }) => ({
  settleAlbumList,
  enterpriseList,
  loadingSettlePhaseList: loading.models.settlePhaseList,
  loadingAlbumList: loading.models.settleAlbumList,
  loadingMediaList: loading.models.settleMediaList,
  loadingSettleReportList: loading.models.settleReportList,
}))(right);