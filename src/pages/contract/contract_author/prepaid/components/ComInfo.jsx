import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';

export const ComInfo = props => {
  const {
    contractAuthorList: { info },
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
                  <p>合約編號：<span>{(info.basic_info && info.basic_info.contract_code) ? (info.basic_info.contract_code) : ('')}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>
                    簽約對象：
                    <span>
                      {
                        (info.basic_info)
                          ? (
                            (info.basic_info.party_b_object_author && info.basic_info.party_b_object_author.name)
                              ? (info.basic_info.party_b_object_author.name)
                              : (
                                (info.basic_info.party_b_object_company && info.basic_info.party_b_object_company.name)
                                  ? (info.basic_info.party_b_object_company.name)
                                  : ('')
                              )
                          )
                          : (null)
                      }
                    </span>
                  </p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>
                    簽約單位：
                    <span>
                      {
                        (info.basic_info && info.basic_info.party_b_company && info.basic_info.party_b_company.name)
                          ? (info.basic_info.party_b_company.name)
                          : ('')
                      }
                    </span>
                  </p>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>
                    合約開始日：
                    <span>
                      {
                        (info.basic_info && info.basic_info.contract_start_date)
                          ? (info.basic_info.contract_start_date)
                          : ('')
                      }
                    </span>
                  </p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>
                    合約到期日：
                    <span>
                      {
                        (info.basic_info && info.basic_info.contract_end_date)
                          ? (info.basic_info.contract_end_date)
                          : ('')
                      }
                    </span>
                  </p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>
                    合約有效日：
                    <span>
                      {
                        (info.basic_info && info.basic_info.contract_expiry_date)
                          ? (info.basic_info.contract_expiry_date)
                          : ('')
                      }
                    </span>
                  </p>
                </Col>
              </Row>
            </Fragment>
          )
          : (null)
      }
    </Card>
  );
}

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
}))(ComInfo);