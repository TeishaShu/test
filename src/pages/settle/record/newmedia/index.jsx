import React, { useState, useEffect, Fragment } from 'react';
import {
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import ComUniversalList from './components/ComUniversalList';
import ComAppleList from './components/ComAppleList';
import ComSongMatch from '../../components/ComSongMatch';
import ComCheckReport from '../../components/ComCheckReport';

const newmedia = props => {
  const {
    loading
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState({ step: 'u0', list: {} });

  // changeStep
  const changeStep = (newStep) => {
    setCurrentStep((prev) => ({ ...prev, step: newStep }));
  };

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      {
        (currentStep.step == 'u0' || currentStep.step == 'a0')
          ? (
            <PageHeaderWrapper
              tabList={[
                {
                  key: 'u0',
                  tab: '一般平台',
                }, {
                  key: 'a0',
                  tab: 'Apple',
                },
              ]}
              tabActiveKey={currentStep.step}
              onTabChange={changeStep}
            >
              {(currentStep.step == 'u0') && (<ComUniversalList currentStep={currentStep} setCurrentStep={setCurrentStep} setViewLoading={setViewLoading} />)}
              {(currentStep.step == 'a0') && (<ComAppleList currentStep={currentStep} setCurrentStep={setCurrentStep} setViewLoading={setViewLoading} />)}
            </PageHeaderWrapper>
          )
          : (
            <Fragment>
              {(currentStep.step == 'u1') && <ComSongMatch uiType="reco" currentStep={currentStep} setCurrentStep={setCurrentStep} />}
              {(currentStep.step == 'u2') && <ComCheckReport uiType="reco" currentStep={currentStep} setCurrentStep={setCurrentStep} />}
              {(currentStep.step == 'a1') && <ComSongMatch uiType="reco" currentStep={currentStep} setCurrentStep={setCurrentStep} />}
              {(currentStep.step == 'a2') && <ComCheckReport uiType="reco" uiIsApple={true} currentStep={currentStep} setCurrentStep={setCurrentStep} />}
            </Fragment>
          )
      }
    </Spin>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.settleMediaList,
}))(newmedia);