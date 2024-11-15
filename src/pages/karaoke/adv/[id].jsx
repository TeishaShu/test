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
import InfoBanner from '@/components/InfoBanner';
import ComInfo from './components/ComInfo';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const adv = props => {
  const {
    loading,
    removeLoading,
    dispatch,
    karaokeList: { multiChangeId, info },
    authorizedCountryList,
    match
  } = props;
  const { confirm } = Modal;
  // areaCountryText
  const [areaCountryText, setAreaCountryText] = useState('');

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'karaokeList/fetchMultiGetAdvInfo',
      payload: {
        id: match.params.id,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let tmpAreaCountryText = commFn.convertAreaContryText(info.release_area_type, info.release_area_name, (info.release_country ? info.release_country.map(elem => elem.country_id) : []), authorizedCountryList.countryList);

    setAreaCountryText(tmpAreaCountryText);
  }, [multiChangeId]);

  // removeData
  const removeData = () => {
    dispatch({
      type: 'karaokeList/fetchRemoveData',
      payload: {
        id: match.params.id,
      },
      callback: (result) => {
        if (result == 'ok') {
          history.push('/karaoke');
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
      {
        (info.end_date && (new Date(info.end_date) - new Date()) / 1000 / 60 / 60 / 24 < 90)
          ? (
            <Button
              className={styles.om_sp_m_lb}
              href={`${REACT_APP_PUBLIC_PATH}/#/karaoke/update/copy/${match.params.id}`}
              target="_blank"
            >續約</Button>
          )
          : (null)
      }
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/karaoke/update/${match.params.id}`);
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
      spinning={removeLoading || loading}
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
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ karaokeList, authorizedCountryList, loading }) => ({
  karaokeList,
  authorizedCountryList,
  loading: loading.effects['karaokeList/fetchMultiGetAdvInfo'],
  removeLoading: loading.effects['karaokeList/fetchRemoveData'],
}))(adv);