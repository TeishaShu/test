import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Empty,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComContentInfo from './ComContentInfo';
import ComUpload from './ComUpload';

export const ComContent = props => {
  const {
    getData,
    setViewLoading,
    miscList: { info },
  } = props;

  return (
    <Card
      bordered={false}
      className={`${styles.card} ${styles.titleNoBBd}`}
      title="授權內容"
      extra={
        <ComUpload
          setViewLoading={setViewLoading}
          getData={getData}
        />
      }
    >
      {
        (info.content && info.content.length > 0)
          ? (
            info.content.map((elem, idx) => (
              <ComContentInfo
                key={`ComContentInfo_${idx}`}
                parentElem={elem}
                parentIdx={idx}
                getData={getData}
              />
            ))
          )
          : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
      }
    </Card>
  );
}

export default connect(({ miscList, loading }) => ({
  miscList,
}))(ComContent);