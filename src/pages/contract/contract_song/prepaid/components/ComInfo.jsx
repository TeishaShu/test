import React, { Fragment, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';

export const ComInfo = props => {
  const {
    contractSongList: { info },
  } = props;

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="基本資料"
    >
      {
        (info)
          ? (
            <Fragment>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>合約編號：<span>{(info.contract_code) ? (info.contract_code) : ('')}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>簽約對象：<span>{(info.party_b_object && info.party_b_object.name) ? (info.party_b_object.name) : ('')}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>簽約單位：<span>{(info.party_b_company && info.party_b_company.name) ? (info.party_b_company.name) : ('')}</span></p>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>合約開始日：<span>{(info.contract_start_date) ? (info.contract_start_date) : ('')}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>合約到期日：<span>{(info.contract_agency_end) ? (info.contract_agency_end) : ('')}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>合約有效日：<span>{(info.contract_expiry_date) ? (info.contract_expiry_date) : ('')}</span></p>
                </Col>
              </Row>
            </Fragment>
          )
          : (null)
      }
    </Card>
  );
}

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
}))(ComInfo);