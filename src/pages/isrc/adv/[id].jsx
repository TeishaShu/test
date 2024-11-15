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
import ComSplit from './components/ComSplit';
import ComAlbum from './components/ComAlbum';
import ComNewMedia from './components/ComNewMedia';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const adv = props => {
  const {
    loading,
    dispatch,
    albumList,
    isrcList: { multiChangeId, info },
    authorizedCountryList,
    match
  } = props;
  const { confirm } = Modal;
  const [isAlbumCalc, setIsAlbumCalc] = useState(0);
  // areaCountryText
  const [areaCountryText, setAreaCountryText] = useState('');

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'isrcList/fetchMultiGetISRCInfo',
      payload: {
        id: match.params.id,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  // if content change (for '收錄專輯')
  useEffect(() => {
    setIsAlbumCalc((albumList.belongAlbumInfo) ? (albumList.belongAlbumInfo.length) : 0);
  }, [albumList.belongAlbumInfo]);

  // updateData
  useEffect(() => {
    let tmpAreaCountryText = commFn.convertAreaContryText(info.release_area_type, info.release_area_name, (info.release_country ? info.release_country.map(elem => elem.country_id) : []), authorizedCountryList.countryList);

    setAreaCountryText(tmpAreaCountryText);
  }, [multiChangeId]);

  // removeData
  const removeData = () => {
    dispatch({
      type: 'isrcList/fetchRemoveIsrcData',
      payload: {
        id: match.params.id,
      },
      callback: (result) => {
        if (result == 'ok') {
          history.push('/isrc');
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
          history.push(`/isrc/update/id/${match.params.id}`);
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

  // PageHeaderWrapper(extraContent) - infoBanners
  const infoBanners = (
    <div>
      <InfoBanner
        desc="收錄專輯"
        title1={isAlbumCalc}
        title2=""
        first={true}
        cusTitle2Color={false}
      />
    </div >
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${commFn.strToISRC(info.isrc)} - ${info.song_name}`}
        extra={buttonsList}
        extraContent={infoBanners}
        content={description}
      >
        <ComInfo
          areaCountryText={areaCountryText}
        />
        <ComSplit
          pageId={match.params.id}
          color="#FFAA20"
        />
        <ComAlbum
          color="#006DB6"
        />
        <ComNewMedia
          color="#9200FF"
        />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ albumList, isrcList, authorizedCountryList, loading }) => ({
  albumList,
  isrcList,
  authorizedCountryList,
  loading: loading.effects['isrcList/fetchMultiGetISRCInfo'],
}))(adv);