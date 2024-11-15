import React from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { Link } from 'umi';
import styles from '@/style/style.less';
import {
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ComInfo = props => {
  const {
    info,
  } = props;

  const getOp = () => {
    if (info.op) {
      return info.op.select_type === '1' ? info.op.nickname : info.op.name;
    }
    return undefined
  }

  return (
    <Card
      bordered={false}
      className={`${styles.card} ${styles.titleNoBBd} ${styles.cardBodyNoBPd}`}
      title="基本資料"
    >
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>簽約日期：<span>{info.contract_signing_date ?? undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>簽約對象：
            <span>
              {(info && info.party_b_object && info.party_b_object.length > 0) && (info.party_b_object.map((item, idx) => {
                return item.name + ((info.party_b_object.length - 1 > idx) ? '，' : '')
              }))}
            </span>
          </p>
        </Col>
        <Col md={8} xs={24}>
          <p>OP：<span>{getOp()}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>我方簽約單位：<span>{info.party_a_company ? info.party_a_company.name : undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>簽約單位：<span>{info.party_b_company ? info.party_b_company.name : undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>SP：<span>{info.sp ? info.sp.nickname : undefined}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          {info.contract_group ? info.contract_group.map((elem, index) => {
            if (index === 0) {
              return <Row key={elem.id}> 關聯合約：<Link
                to={`/contract/contract_song/adv/id/${elem.id}`}><span>{elem.contract_code}</span></Link></Row>;
            }
            return <Row key={elem.id} style={{ marginLeft: '70px' }}><Link
              to={`/contract/contract_song/adv/id/${elem.id}`}><span>{elem.contract_code}</span></Link></Row>;
          }) : undefined}
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <div className={styles.contentBBd} />
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>合約開始日：<span>{info.contract_start_date ?? undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>代理到期日：<span>{info.contract_agency_end ?? undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p><span style={{ color: 'red' }}>合約提前終止：</span><span>{info.contract_termination_date ?? <CloseOutlined style={{ color: "#EE655F" }} />}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>合約到期日：<span>{info.contract_end_date ?? undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>延約同時展期代理到期日：{info.agency_renew === "1" ? <CheckOutlined style={{ color: '#7BC583' }} /> : <CloseOutlined style={{ color: "#EE655F" }} />}</p>
        </Col>
        <Col md={8} xs={24}>
          <p><span style={{ color: 'red' }}>代理到期日提前終止：</span><span>{info.is_early_terminate === '1' ? info.early_terminate_date : <CloseOutlined style={{ color: "#EE655F" }} />}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>合約有效日：<span>{info.contract_expiry_date ?? undefined}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>代理年限：<span>{info.agency_year ? parseFloat(info.agency_year) : '無'}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>永久：<span>{info.is_permanent === '1' ? '是' : '否'}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col md={8} xs={24}>
          <p>續約年限：<span>{info.renewal_period ? parseFloat(info.renewal_period) : '無'}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>授權地區：<span>{info.authorized_area_name}</span></p>
        </Col>
        <Col md={8} xs={24}>
          <p>轉讓：<span>{info.is_transfer === '1' ? '是' : '否'}</span></p>
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <div className={styles.contentBBd} />
        </Col>
      </Row>
      <Row gutter={[8, 16]}>
        <Col xs={1.5}>
          <span>備註：</span>
        </Col>
        <Col xs={22.5}>
          <span style={{ whiteSpace: 'pre-line' }}>{info.notes ?? undefined}</span>
        </Col>
      </Row>
    </Card>
  );
};

export default ComInfo;
