import React, { useState, Fragment, useEffect } from 'react';
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
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;


const Adv = props => {
  const {
    loading,
    dispatch,
    enterpriseAccountList: { info },
    match,
  } = props;

  const getData = () => {
    dispatch({
      type: 'enterpriseAccountList/fetchGetInfo',
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
          type: 'enterpriseAccountList/fetchDeleteForm',
          payload: {
            id: match.params.id,
          },
          callback: res => {
            if (res && res.data === '刪除企業帳號成功。') {
              message.success('刪除企業帳號成功');
              history.push(`/enterprise/account/`);
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

  const accountFreezeAction = (data) => {
    confirm({
      title: '',
      icon: '',
      content: `確定要${data.is_frozen === '0' ? '凍結' : '解凍'}嗎?`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        const freezeType = data.is_frozen === '0' ? '1' : '0';
        dispatch({
          type: 'enterpriseAccountList/fetchFreezeAction',
          payload: {
            id: data.id,
            is_frozen: freezeType,
          },
          callback: res => {
            if (res && (res.data === '凍結 帳號成功' || res.data === '解凍 帳號成功')) {
              message.success(res.data);
            }
            getData();
          },
        });
      },
      onCancel() {
      },
    });
  };

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title={info ? `${info.user_name}(${info.account})` : undefined}
        content={
          [
            <span>加入時間: {info.created_at}</span>,
            <Select
              style={info.is_frozen === '0' ? { color: '#70DE5F' } : { color: '#A5A5A5' }}
              bordered={false}
              value={info.is_frozen}
              onChange={() => accountFreezeAction(info)}
            >
              <Option value="0"><CheckCircleFilled/> 啟用</Option>
              <Option value="1"><CloseCircleFilled/> 凍結</Option>
            </Select>,
          ]}
        extraContent={[
          <Button
            key={`edit-button-${info.id}`}
            className={styles.om_m_r_12}
            onClick={() => {
              history.push(`/enterprise/account/update/${info.id}`);
            }}>修改資料</Button>,
          <Button key={`delete-button-${info.id}`} className={styles.om_m_r_12} onClick={() => {
            deleteEnterPrise();
          }}>刪除帳號</Button>,
        ]}
        className={styles.infoBanners}
      >
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd}`}
          style={{ marginBottom: '0' }}
        >
          <Row gutter={[8, 0]}>
            <Col xs={24}>
              <p>暱稱：<span>{info.user_name}</span></p>
              <p>帳號：<span>{info.account}</span></p>
              <p>電子信箱：<span>{info.email}</span></p>
              <p>電話：<span>{info.phone}</span></p>
              <p>所屬企業：<span>{info.enterprise_name}</span></p>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ enterpriseAccountList, loading }) => ({
  enterpriseAccountList,
  loading: loading.models.enterpriseAccountList,
}))(Adv);

