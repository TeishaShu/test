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
    memberList: { info },
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
        <p>子帳號已開通！成員可用以下帳號登入企業管理平台</p>
        <p>帳號:{info.account}</p>
        <Button type='link' onClick={() => history.push(`/setting/member/adv/id/${info.id}`)}>查看帳號細節</Button>
      </div>
    </Spin>
  );
};

export default connect(({ memberList, loading }) => ({
  memberList,
  loading: loading.models.memberList,
}))(AddFinish);
