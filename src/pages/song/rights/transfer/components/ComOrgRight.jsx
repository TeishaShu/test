import React, { Fragment, useState } from 'react';
import { EditOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const ComOrgRight = props => {
  const {
    history,
    rightData,
    agencyData,
  } = props;

  return (
    <Card
      type="inner"
      title={
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p className={styles.om_r_0}>{rightData.contract_song_code}</p>
          </Col>
        </Row>
      }
      style={{ marginBottom: '24px' }}
    >
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>權利：<span>{rightData.rights_type}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>比例：<span>{rightData.rights_ratio}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>作者本名：<span>{rightData.name}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>權利起始日：<span>{rightData.rights_start}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>OP：<span>{rightData.op_company_nickname}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>作者筆名：<span>{rightData.pen_name}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>權利到期日：<span>{rightData.rights_end}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>SP：<span>{rightData.sp_company_nickname}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>代理地區：<span>{agencyData}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>
            代理到期日：
                      <span className={(!history && rightData.agency_end && commFn.compareDateExpired(rightData.agency_end)) ? (styles.om_color_red) : ''}>
              {rightData.agency_end}
            </span>
          </p>
        </Col>
        <Col md={8} xs={24}>
          <p>結算對象：<span>{rightData.settle_company_name}</span></p>
        </Col>
      </Row>
    </Card>
  );
}

export default ComOrgRight;