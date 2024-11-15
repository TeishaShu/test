import React, { useState, useEffect } from 'react';
import {
  Alert,
} from 'antd';
import styles from './index.less';

const PageHint = props => {
  const { totalItems, pageSize, changeId } = props;
  const [hintText, setHintText] = useState('');

  // hint
  useEffect(() => {
    let outStr = '';
    let pageNum = 1;

    if (totalItems != undefined) {
      pageNum = Math.ceil(parseInt(totalItems) / pageSize);
      if (pageNum == 0) { pageNum = 1; }
      outStr = `共 ${totalItems} 筆，分為 ${pageNum} 頁`;
      setHintText(outStr);
    }
  }, [changeId]);

  return (
    <div className={styles.hintMargin}>
      <Alert
        message={hintText}
        type="info"
      />
    </div>
  );
}

export default PageHint;