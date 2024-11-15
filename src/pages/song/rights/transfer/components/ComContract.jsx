import React, { Fragment, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const ComContract = props => {
  const {
    history,
    rightData,
    agencyData,
  } = props;

  return (
    <Card
      type="inner"
      style={{ marginBottom: '24px' }}
    >
      {
        (rightData)
          ? (
            <Fragment>
              <Row gutter={[8, 0]}>
                <Col md={8} xs={24}>
                  <p>簽約對象：<span>{rightData.party_b_object_name}</span></p>
                </Col>
                <Col md={8} xs={24}>
                  <p>合約有效日：<span>{rightData.contract_expiry_date}</span></p>
                </Col>
                <Col md={8} xs={24}>
                  <p>永久：<span>{
                    (commFn.convertToBool(rightData.is_permanent))
                      ? ('是')
                      : ('否')
                  }</span></p>
                </Col>
              </Row>
              <Row gutter={[8, 0]}>
                <Col md={8} xs={24}>
                  <p>簽約單位：<span>{rightData.party_b_company_name}</span></p>
                </Col>
                <Col md={8} xs={24}>
                  <p>續約年限：<span>{rightData.renewal_period}</span></p>
                </Col>
                <Col md={8} xs={24}>
                  <p>轉讓：<span>{
                    (commFn.convertToBool(rightData.is_transfer))
                      ? ('是')
                      : ('否')
                  }</span></p>
                </Col>
              </Row>
              <Row gutter={[8, 0]}>
                <Col md={8} xs={24}>
                  <p>合約開始日：<span>{rightData.contract_start_date}</span></p>
                </Col>
                <Col md={8} xs={24}>
                  <p>合約終止：<span>
                    {
                      (rightData.contract_termination_date)
                        ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                        : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                    }&nbsp;&nbsp;{rightData.contract_termination_date}</span></p>
                </Col>
              </Row>
              <Row gutter={[8, 0]}>
                <Col md={8} xs={24}>
                  <p>
                    合約到期日：
                    <span>{rightData.contract_end_date}</span>
                  </p>
                </Col>
                <Col md={8} xs={24}>
                  <p>授權地區：<span>{agencyData}</span></p>
                </Col>
              </Row>
            </Fragment>
          )
          : (null)
      }
    </Card>
  );
}

export default ComContract;