import React, { useState, useEffect, Fragment } from 'react';
import {
  Alert,
} from 'antd';
import styles from '@/style/style.less';
import cusStyles from './index.less';
import commFn from '@/fn/comm';

const PageHint = props => {
  const {
    data,
    selectTotal,
    changeId,
    isApple,
  } = props;
  const [hintText, setHintText] = useState('');
  const updateText = () => {
    let reportTotal = 0;
    let settleTotal = 0;
    let outStr = '';

    if (data && selectTotal && selectTotal.length > 0) {
      if (!isApple) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i];

          if (selectTotal.includes(item.file_list_id)) {
            reportTotal = commFn.calAdd(reportTotal, ((item.report_total) ? item.report_total : 0));
            settleTotal = commFn.calAdd(settleTotal, ((item.settle_total) ? item.settle_total : 0));
          }
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          let item = data[i];

          if (item.detail) {
            for (let j = 0; j < item.detail.length; j++) {
              if (selectTotal.includes(item.detail[j].settle_file_id)) {
                reportTotal = commFn.calAdd(reportTotal, ((item.detail[j].report_total) ? item.detail[j].report_total : 0));
                settleTotal = commFn.calAdd(settleTotal, ((item.detail[j].settle_total) ? item.detail[j].settle_total : 0));
              }
            }
          }
        }
      }

      reportTotal = commFn.trimZero(reportTotal.toFixed(3));
      settleTotal = commFn.trimZero(settleTotal.toFixed(3));
    }

    outStr = (
      <Fragment>
        已選擇 <span className={styles.om_color_link_blue}>{(selectTotal) ? (selectTotal.length) : ('0')}</span> 筆資料，報表金額統計 <span className={styles.om_color_link_blue}>{reportTotal}</span>，計算金額統計 <span className={styles.om_color_link_blue}>{settleTotal}</span>
      </Fragment>
    );

    setHintText(outStr);
  }

  // changeSelect
  useEffect(() => {
    updateText();
  }, [selectTotal]);

  // changeId
  useEffect(() => {
    updateText();
  }, [changeId]);

  return (
    <div className={cusStyles.hintMargin}>
      <Alert
        message={hintText}
        type="info"
      />
    </div>
  );
}

export default PageHint;