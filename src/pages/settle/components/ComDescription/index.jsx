import React, { useEffect, Fragment } from 'react';
import {
  Descriptions,
} from 'antd';
import { connect, history } from 'umi';
import cusStyles from './index.less';
import commFn from '@/fn/comm';

export const ComDescription = props => {
  const {
    data,
    phaseList,
    isAdvInfo,  // optional
    uiIsApple,  // optional
    settleMediaList,
  } = props;

  return (
    <Descriptions column={(isAdvInfo) ? 2 : 1} className={cusStyles.headerList}>
      <Descriptions.Item label="檔名">{(uiIsApple) ? ('-') : ((data.file_name) ? (data.file_name) : ('-'))}</Descriptions.Item>
      {(isAdvInfo) && <Descriptions.Item label="幣別">{(data.currency_code) ? (data.currency_code) : ('-')}{(settleMediaList.checkReport && settleMediaList.checkReport[0] && settleMediaList.checkReport[0].exchange_rate) && (` (${settleMediaList.checkReport[0].exchange_rate})`)}</Descriptions.Item>}
      <Descriptions.Item label="資料期別">{(data.data_phase) ? (data.data_phase) : ('-')}</Descriptions.Item>
      {(isAdvInfo) && <Descriptions.Item label="地區">{(data.country) ? (data.country) : ('-')}</Descriptions.Item>}
      <Descriptions.Item label="計算期別">{(phaseList && phaseList.phase) && (phaseList.phase)}</Descriptions.Item>
      {(isAdvInfo) && <Descriptions.Item label="稅率">{(data.tax_rate) ? (data.tax_rate) : ('-')}</Descriptions.Item>}
    </Descriptions>
  );
}

export default connect(({ settleMediaList, loading }) => ({
  settleMediaList,
}))(ComDescription);