import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  InputNumber,
  Input,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  Checkbox,
  Result,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import ComInfo from '../components/ComInfo';

const basic = props => {
  const {
    dispatch,
    loadingMultiGetPrepaidInfo,
    match,
  } = props;

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'contractSongList/fetchMultiGetPrepaidInfo',
      payload: {
        isEdit: false,
        contract_song_id: match.params.contract_id,
      }
    });
  }

  useEffect(() => {
    getData();
  }, [match.params.contract_id]);

  return (
    <Spin
      tip="Loading..."
      spinning={loadingMultiGetPrepaidInfo}
    >
      <PageHeaderWrapper
        title={'詞曲發行合約 - 修改預付'}
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push(`/contract/contract_song/prepaid/update/contract_id/${match.params.contract_id}/prepaid_id/${match.params.prepaid_id}`);
            }}
          >修改</Button>
        }
      >
        <ComInfo />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loadingMultiGetPrepaidInfo: loading.effects['contractSongList/fetchMultiGetPrepaidInfo'],
}))(basic);