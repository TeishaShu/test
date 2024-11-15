import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Descriptions,
  Modal,
  Spin,
  Tooltip,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { AppstoreOutlined, DownloadOutlined } from "@ant-design/icons";
import PageHeaderDescription from '@/components/PageHeaderDescription';
import InfoBanner from '@/components/InfoBanner';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComInfo from './components/ComInfo';
import ComContent from './components/ComContent';

export const adv = props => {
  const {
    loading,
    loadingGetContent,
    loadingRemoveAlbum,
    dispatch,
    authorizedCountryList,
    albumList: { multiChangeId, info, content },
    match
  } = props;
  const { confirm } = Modal;
  const [isSongCalc, setIsSongCalc] = useState(0);
  // areaCountryText
  const [areaCountryText, setAreaCountryText] = useState('');

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'albumList/fetchMultiGetAdvInfo',
      payload: {
        album_id: match.params.id,
      },
    });
  }

  // removeAlbum
  const removeAlbum = () => {
    dispatch({
      type: 'albumList/fetchRemoveAlbum',
      payload: {
        album_id: match.params.id,
      },
      callback: (result) => {
        if (result == 'ok') {
          history.push('/album');
        }
      }
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  // if content change (for '收錄曲數')
  useEffect(() => {
    let tmpSongCalc = 0;
    if (content && content.disc) {
      for (let i = 0; i < content.disc.length; i++) {
        if (content.disc[i].content) {
          tmpSongCalc += content.disc[i].content.length;
        }
      }
    }

    setIsSongCalc(tmpSongCalc);
  }, [content]);

  // update data
  useEffect(() => {
    let tmpAreaCountryText = commFn.convertAreaContryText(info.authorize_area_type, info.authorize_area, (info.authorized_country_id ? info.authorized_country_id.map(elem => elem.country_id) : []), authorizedCountryList.countryList);

    setAreaCountryText(tmpAreaCountryText);
  }, [multiChangeId]);

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
        removeAlbum();
      },
      onCancel() { },
    });
  }

  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={showRemoveConfirm}>刪除</Button>
      <Button
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/album/update/copy/${match.params.id}`);
        }}
      >專輯改版</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/album/update/${match.params.id}`);
        }}
      >修改</Button>
    </div>
  );

  // PageHeaderWrapper(content) - description
  const description = (
    <Fragment>
      <PageHeaderDescription
        createdAt={info.created_at}
        updatedAt={info.updated_at}
      />
      <br />
      {
        (info.type_id == '10' || info.type_id == '11')
          ? ('')
          : (
            <Tooltip title="權利分配">
              <AppstoreOutlined
                style={{ fontSize: '30px', marginRight: '15px', color: '#54A767' }}
                onClick={() => {
                  history.push(`/album/rights/${match.params.id}`);
                }}
              />
            </Tooltip>
          )
      }
      <a
        href={`${window.FRONTEND_WEB}/album/label_copy?album_id=${match.params.id}`}
        target="_blank"
      >
        <Tooltip title="下載 Label Copy">
          <DownloadOutlined
            style={{ fontSize: '30px', marginRight: '15px', color: '#1890ff' }}
          />
        </Tooltip>
      </a>
    </Fragment>
  );

  // PageHeaderWrapper(extraContent) - infoBanners
  const infoBanners = (
    <div>
      <InfoBanner
        desc="詞曲應結"
        title1={content.is_song_right_calc}
        title2=""
        first={true}
        cusTitle2Color={false}
      />
      <InfoBanner
        desc="錄音應結"
        title1={content.is_record_right_calc}
        title2=""
        cusTitle2Color={false}
      />
      <InfoBanner
        desc="收錄曲數"
        title1={isSongCalc}
        title2=""
        cusTitle2Color={false}
      />
    </div >
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loadingGetContent || loadingRemoveAlbum || loading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${info.album_code} - ${info.album_name_zh}`}
        extra={buttonsList}
        content={description}
        extraContent={infoBanners}
        className={styles.infoBanners}
      >
        <ComInfo
          areaCountryText={areaCountryText}
        />
        <ComContent
          pageId={match.params.id}
        />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ authorizedCountryList, albumList, loading }) => ({
  authorizedCountryList,
  albumList,
  loading: loading.effects['albumList/fetchMultiGetAdvInfo'],
  loadingGetContent: loading.effects['albumList/fetchGetContent'],
  loadingRemoveAlbum: loading.effects['albumList/fetchRemoveAlbum'],
}))(adv);