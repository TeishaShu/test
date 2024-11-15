import React, { useState, useEffect } from 'react';
import {
  Button,
  Descriptions,
  Modal,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import PageHeaderDescription from '@/components/PageHeaderDescription';
import ComInfo from './components/ComInfo';
import ComContent from './components/ComContent';
import ComSplitCaluate from './components/ComSplitCaluate';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const adv = props => {
  const {
    loading,
    // removeLoading,
    dispatch,
    miscList: { multiChangeId, info },
    authorizedCountryList,
    match
  } = props;
  const { confirm } = Modal;
  const [viewLoading, setViewLoading] = useState(false);
  // areaCountryText
  const [areaCountryText, setAreaCountryText] = useState('');

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'miscList/fetchMultiGetInfo',
      payload: {
        cm_id: match.params.id,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let tmpAreaCountryText = commFn.convertAreaContryText(info.authorized_area_type, info.area_name, (info.authorized_country_id ? info.authorized_country_id.map(elem => elem.country_id) : []), authorizedCountryList.countryList);

    setAreaCountryText(tmpAreaCountryText);
  }, [multiChangeId]);

  // removeData
  const removeData = () => {
    dispatch({
      type: 'miscList/fetchRemoveData',
      payload: {
        cm_id: match.params.id,
      },
      callback: (result) => {
        if (result == 'ok') {
          history.push('/misc');
        }
      }
    });
  }

  // ui -----
  // alert (remove)
  const showRemoveConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeData();
      },
      onCancel() { },
    });
  }

  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={showRemoveConfirm}>刪除</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/misc/update/${match.params.id}`);
        }}
      >修改</Button>
    </div>
  );

  // PageHeaderWrapper(content) - description
  const description = (
    <PageHeaderDescription
      createdAt={info.created_at}
      updatedAt={info.updated_at}
    />
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${(info.contract_code) ? (info.contract_code) : ('')} - ${(info.name) ? (info.name) : ('')}`}
        extra={buttonsList}
        content={description}
      >
        <ComInfo
          areaCountryText={areaCountryText}
        />
        <ComContent
          pageId={match.params.id}
          getData={getData}
          setViewLoading={setViewLoading}
        />
        < ComSplitCaluate />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ miscList, authorizedCountryList, loading }) => ({
  miscList,
  authorizedCountryList,
  // loadingMultiGetInfo: loading.effects['miscList/fetchMultiGetInfo'],
  loading: loading.models.miscList,
  // removeLoading: loading.effects['karaokeList/fetchRemoveData'],
}))(adv);