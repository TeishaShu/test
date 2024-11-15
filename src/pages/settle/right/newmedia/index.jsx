import React, { useState, useEffect, Fragment } from 'react';
import ComList from './components/ComList';
import ComSongMatch from '../../components/ComSongMatch';
import ComCheckReport from '../../components/ComCheckReport';

const newMedia = props => {
  const {
  } = props;
  const [currentStep, setCurrentStep] = useState({ step: 0, list: {} });  // 0: list, 1: 歌曲, 2: 檢核

  return (
    <Fragment>
      {
        (currentStep.step == 0) && <ComList currentStep={currentStep} setCurrentStep={setCurrentStep} />
      }
      {
        (currentStep.step == 1) && <ComSongMatch uiType="righ" currentStep={currentStep} setCurrentStep={setCurrentStep} />
      }
      {
        (currentStep.step == 2) && <ComCheckReport uiType="righ" currentStep={currentStep} setCurrentStep={setCurrentStep} />
      }
    </Fragment>
  );
}

export default newMedia;