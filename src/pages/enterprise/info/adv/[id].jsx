import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Spin,
  Select,
  message,
  Modal,
  Button,
} from 'antd';
import styles from '@/style/style.less';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PageHeaderDescription from '@/components/PageHeaderDescription';

const { confirm } = Modal;

const Adv = props => {
  const {
    loading,
    dispatch,
    enterpriseInfoList: { info },
    match,
  } = props;

  const getData = () => {
    dispatch({
      type: 'enterpriseInfoList/fetchGetInfo',
      payload: {
        id: match.params.id,
      },
    });
  };

  const deleteEnterPrise = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除帳號嗎?',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'enterpriseInfoList/fetchDeleteForm',
          payload: {
            id: match.params.id,
          },
          callback: res => {
            if (res && res.data === '刪除企業資料成功') {
              message.success('刪除企業資料成功');
              history.push(`/enterprise/info/`);
            }
          },
        });
      },
    });
  };

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title={info ? `${info.name}(${info.tax_id_number})` : undefined}
        content={
          <PageHeaderDescription
            changeAcountStyle
            createdAt={info.created_at}
            updatedAt={info.updated_at}
            createdBy={info.created_by}
            updatedBy={info.updated_by}
          />
        }
        extraContent={[
          <Button
            key={`edit-button-${info.id}`}
            className={styles.om_m_r_12}
            onClick={() => {
              history.push(`/enterprise/info/update/${info.id}`);
            }}>修改資料</Button>,
          <Button key={`delete-button-${info.id}`} className={styles.om_m_r_12} onClick={() => {
            deleteEnterPrise();
          }}>刪除帳號</Button>,
        ]}
        className={styles.infoBanners}
      >
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd} ${styles.cardBodyNoBPd}`}
          title="基本資料"
        >
          <Row gutter={[8, 0]}>
            <Col md={8} xs={24}>
              <p>統一編號：<span>{info.tax_id_number ?? undefined}</span></p>
            </Col>
            <Col md={8} xs={24}>
              <p>企業名稱：<span>{info.name ?? undefined}</span>
              </p>
            </Col>
            <Col md={8} xs={24}>
              <p>企業名稱(中)：<span>{info.name_zh ?? undefined}</span></p>
            </Col>
          </Row>
          <Row gutter={[8, 0]}>
            <Col md={8} xs={24}>
              <p>企業名稱(英)：<span>{info.name_en ?? undefined}</span></p>
            </Col>
            <Col md={8} xs={24}>
              <p>負責人：<span>{info.admin ?? undefined}</span></p>
            </Col>
          </Row>
          <Row gutter={[8, 0]}>
            <Col md={8} xs={24}>
              <p>郵遞區號：<span>{info.zip_code ?? undefined}</span></p>
            </Col>
            <Col md={16} xs={24}>
              <p>地址(中)：<span>{info.address_zh ?? undefined}</span></p>
            </Col>
          </Row>
          <Row gutter={[8, 0]}>
            <Col md={8} xs={24}>
              <p>電話：<span>{info.phone ?? undefined}</span></p>
            </Col>
            <Col md={8} xs={24}>
              <p>傳真：<span>{info.fax ?? undefined}</span></p>
            </Col>
          </Row>
          <Row gutter={[8, 0]}>
            <Col md={13} xs={24}>
              <p>Email：<span>{info.email ?? undefined}</span></p>
            </Col>
          </Row>
          <Row gutter={[8, 0]}>
            <Col md={13} xs={24}>
              <p>網站：<span>{info.website ?? undefined}</span></p>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ enterpriseInfoList, loading }) => ({
  enterpriseInfoList,
  loading: loading.models.enterpriseInfoList,
}))(Adv);

