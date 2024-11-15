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
    memberList: { info, role },
    match,
  } = props;

  const getData = () => {
    dispatch({
      type: 'memberList/fetchGetInfo',
      payload: {
        id: match.params.id,
      },
    });
  };

  const getRole = () => {
    dispatch({
      type: 'memberList/fetchGetRole',
    });
  }

  const deleteEnterPrise = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除成員嗎?',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'memberList/fetchDeleteMember',
          payload: {
            id: match.params.id,
          },
          callback: res => {
            if (res === '刪除帳號成功。') {
              message.success('刪除成功');
              history.push(`/setting/member`);
            }
          },
        });
      },
    });
  };

  // mount, update id
  useEffect(() => {
    getData();
    getRole();
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
          type: 'memberList/fetchFreezeMember',
          payload: {
            id: data.id,
            is_frozen: freezeType,
          },
          callback: res => {
            if (res && (res === '凍結 帳號成功' || res === '解凍 帳號成功')) {
              message.success(res);
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
              history.push(`/setting/member/update/${info.id}`);
            }}>修改資料</Button>,
          <Button key={`delete-button-${info.id}`} className={styles.om_m_r_12} onClick={() => {
            deleteEnterPrise();
          }}>刪除成員</Button>,
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
              <p>角色：<span>{role.map(data=>{
                if (data.id === info.role_id){
                  return data.name;
                }
                return '';
              })}</span></p>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ memberList, loading }) => ({
  memberList,
  loading: loading.models.memberList,
}))(Adv);

