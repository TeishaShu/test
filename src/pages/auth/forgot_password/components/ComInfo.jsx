import React, { Fragment } from 'react';
import {
  Button,
} from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { history } from 'umi';

const ComInfo = props => {
  const {
    email,
  } = props;
  const uiStyle = {
    icon: {
      fontSize: '64px',
      color: '#51C513',
      marginTop: '15px',
    },
    mainText: {
      margin: '30px 0 15px 0',
      fontSize: '20px',
      fontWeight: '700',
    },
    descText: {
      color: '#999999',
      marginBottom: '16px',
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Fragment>
        <CheckCircleFilled style={uiStyle.icon} />
        <p style={uiStyle.mainText}>{`已發送一組新密碼至 ${email}`}</p>
        <p style={uiStyle.descText}>建議您立即至會員專區重新設定密碼</p>
        <Button onClick={() => {
          history.push('/auth/login');
        }}>返回登入頁</Button>
      </Fragment>
    </div>
  );
}

export default ComInfo;