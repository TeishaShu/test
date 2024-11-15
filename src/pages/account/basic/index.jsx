import React, { useState, useEffect, Fragment } from 'react';
import {
  Spin,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Divider,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const account = props => {
  const {
    loading,
    dispatch,
    authList: { initUserData },
  } = props;

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'authList/fetchGetInitUserData'
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // ui -----
  const buttonsList = (
    <Fragment>
      <Button onClick={() => {
        history.push('/account/update');
      }}>修改資料</Button>
      <Button onClick={() => {
        history.push('/authaccess/change_password');
      }}>修改密碼</Button>
    </Fragment>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title="會員專區"
        extra={buttonsList}
      >
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd}`}
          style={{ marginBottom: '0' }}
        >
          <Row gutter={[8, 0]}>
            <Col xs={24}>
              {
                (initUserData.type == '3' || initUserData.type == '4')
                  ? (
                    <Fragment>
                      <p style={{ color: '#F99561', fontWeight: '700', fontSize: '16px', marginBottom: '5px' }}>{initUserData.enterprise_name}</p>
                      <p>你是企業帳號{(initUserData.type == '3') ? '擁有者' : '成員'}</p>
                      <Divider />
                    </Fragment>
                  )
                  : (<p>你是後台帳號成員</p>)
              }
              <p>暱稱：<span>{initUserData.user_name}</span></p>
              <p>帳號：<span>{initUserData.account}</span></p>
              <p>電子信箱：<span>{initUserData.email}</span></p>
              <p>聯絡電話：<span>{initUserData.phone}</span></p>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ authList, loading }) => ({
  authList,
  loading: loading.models.authList,
}))(account);