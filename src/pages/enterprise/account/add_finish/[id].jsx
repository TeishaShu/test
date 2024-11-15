import React, { useEffect } from 'react';
import {
  Button, Spin,
} from 'antd';
import { connect, history } from 'umi';
import { CheckCircleFilled } from '@ant-design/icons';

const AddFinish = props => {
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
  useEffect(() => {
    getData();
  }, [match.params.id]);

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <div style={{ textAlign: 'center' }}>
        <CheckCircleFilled style={{ color: '#46c739', fontSize: '64px' }}/>
        <p>企業帳號已開通！</p>
        <p>可用帳號 {info.account} 登入企業帳號管理平台，設定團隊成員權限</p>
        <Button type='link' onClick={() => history.push('/enterprise/account')}>返回企業帳號管理</Button>
      </div>
    </Spin>
  );
};

export default connect(({ enterpriseAccountList, loading }) => ({
  enterpriseAccountList,
  loading: loading.models.enterpriseAccountList,
}))(AddFinish);
