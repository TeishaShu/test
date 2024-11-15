import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import styles from '@/style/style.less';

export const ComInfo = props => {
  const {
    loading,
    info,
  } = props;



  return (
    <Card
      bordered={false}
      title="基本資料"
      className={styles.card}
      loading={loading}
    >
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>公司編號：<span>{(info.is_internal === '1') ? info.tax_id_number : info.company_code}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>公司名稱：<span>{info.name}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>公司名稱(中)：<span>{info.name_zh}</span></p>
        </Col>
      </Row>
    </Card>
  )

}

// export default connect(({ companyList, loading }) => ({
//   companyList,
//   loading: loading.effects['companyList/fetchGetInfo'],
// }))(ComInfo);

export default ComInfo;
