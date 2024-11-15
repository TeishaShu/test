import React, { Fragment } from 'react';
import {
  Descriptions,
} from 'antd';
import { connect, history } from 'umi';
import cusStyles from './index.less';
import commFn from '@/fn/comm';

const pageHeaderDescription = props => {
  const {
    changeAcountStyle,  // (optional)  changeAcountStyle: true
    createdAt,
    updatedAt,
    authList,
    createdBy,  // (optional) changeAcountStyle is true
    updatedBy,  // (optional) changeAcountStyle is true
  } = props;
  return (
    <Fragment>
      {
        (changeAcountStyle)
          ? (
            <Descriptions column={1} className={cusStyles.headerList}>
              <Descriptions.Item label="建立者">{(createdBy) ? (createdBy) : ('')}</Descriptions.Item>
              <Descriptions.Item label="建立時間">{createdAt}</Descriptions.Item>
              <Descriptions.Item label="最後修改">{`${(updatedAt && updatedAt != '0000-00-00 00:00:00') ? (updatedAt) : (createdAt)} by ${(updatedBy) ? (updatedBy) : ((createdBy) ? (createdBy) : (''))}`}</Descriptions.Item>
            </Descriptions>
          )
          : (
            <Descriptions column={1} className={cusStyles.headerList}>
              <Descriptions.Item label="建立者">{(authList.createdUser) ? (commFn.convertAccountInfo(authList.createdUser)) : ('')}</Descriptions.Item>
              <Descriptions.Item label="建立時間">{createdAt}</Descriptions.Item>
              <Descriptions.Item label="最後修改">{`${(updatedAt && updatedAt != '0000-00-00 00:00:00') ? (updatedAt) : (createdAt)} by ${(authList.updatedUser && authList.updatedUser.account) ? (commFn.convertAccountInfo(authList.updatedUser)) : ((authList.createdUser) ? (commFn.convertAccountInfo(authList.createdUser)) : (''))}`}</Descriptions.Item>
            </Descriptions>
          )
      }
    </Fragment>
  );
}

export default connect(({ authList }) => ({
  authList
}))(pageHeaderDescription);