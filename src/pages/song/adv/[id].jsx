import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Modal,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import PageHeaderDescription from '@/components/PageHeaderDescription';
import InfoBanner from '@/components/InfoBanner';
import ComInfo from './components/ComInfo';
import ComRights from './components/ComRights';
import ComAlbum from './components/ComAlbum';
import ComIsrc from './components/ComIsrc';
import ComNewMedia from './components/ComNewMedia';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const adv = props => {
  const {
    loadingMultiGetInfo,
    dispatch,
    authorizedCountryList,
    albumList,
    songList: { multiChangeId, info, removeDataResult, detail_rights, iSRCListBySong },
    match,
  } = props;
  const { confirm } = Modal;
  const [paraType, setParaType] = useState('id');
  const [getId, setGetId] = useState('');
  const [showAgencyLists, setShowAgencyLists] = useState([]);
  const [showHistoryAgencyLists, setShowHistoryAgencyLists] = useState([]);

  // api -----
  // getData
  const getData = (paraType) => {
    let paraId;
    let paraSongCode;

    if (paraType == 'id') {
      paraId = match.params.id;
    } else {
      paraSongCode = match.params.id;
    }

    dispatch({
      type: 'songList/fetchMultiGetInfo',
      payload: {
        id: paraId,
        song_code: paraSongCode,
      },
    });
  }

  // getTab
  const getTab = () => {
    let url = match.url.split('/');
    let getParaType = url[url.length - 2];

    // set paraType
    setParaType(getParaType);
    getData(getParaType);
  }

  // mount, update id
  useEffect(() => {
    getTab();
  }, [match.params.id]);

  // updateDate
  useEffect(() => {
    // convert agency function
    const convertAgencyFn = (isRights) => {
      // rights_list or history_list
      let listKey = (isRights) ? 'rights_list' : 'history_list';
      let tmpArr = [];

      if (detail_rights[listKey]) {
        for (let i = 0; i < detail_rights[listKey].length; i++) {
          let item = detail_rights[listKey][i];
          let showText = '';

          if (item.agency_area_type == '2' || item.agency_area_type == '3' || item.agency_area_type == '4') {
            showText += (item.area_name ? item.area_name : '');
          }

          if (item.agency_area_type == '3') {
            showText += '，包含';
          }

          if (item.agency_area_type == '4') {
            showText += '，除了';
          }

          if (item.agency_area_type == '1' || item.agency_area_type == '3' || item.agency_area_type == '4') {
            for (let j = 0; j < detail_rights[listKey][i].agency_country_id.length; j++) {
              let countryItem = detail_rights[listKey][i].agency_country_id[j];

              showText += commFn.searchToString(authorizedCountryList.countryList, 'id', 'country_name_zh', countryItem);

              if (j < detail_rights[listKey][i].agency_country_id.length - 1) {
                showText += '、';
              }
            }
          }

          tmpArr.push(showText);
        }
      }

      if (isRights) {
        setShowAgencyLists(tmpArr);
      } else {
        setShowHistoryAgencyLists(tmpArr);
      }
    }

    if (paraType == 'id') {
      setGetId(match.params.id);
    } else {
      setGetId(info.id);
    }

    // convert to showAgencyLists
    convertAgencyFn(true);

    // convert to showHistoryAgencyLists
    convertAgencyFn(false);
  }, [multiChangeId]);

  const removeData = () => {
    dispatch({
      type: 'songList/fetchRemoveData',
      payload: {
        id: getId,
      }
    });
  }
  useEffect(() => {
    if (removeDataResult != '') {
      history.push('/song');
    }
  }, [removeDataResult]);

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
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/song/rights/update/song_code/${info.song_code}`);
        }}
      >設定合約</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/song/update/${getId}`);
        }}
      >修改</Button>
    </div>
  );

  // PageHeaderWrapper(content) - description
  const description = (
    <PageHeaderDescription
      changeAcountStyle={true}
      createdAt={info.created_at}
      updatedAt={info.updated_at}
      createdBy={info.created_by}
      updatedBy={info.updated_by}
    />
  );

  // PageHeaderWrapper(extraContent) - infoBanners
  const infoBanners = (
    <div>
      <InfoBanner
        first={true}
        desc="權利數"
        title1={(detail_rights && detail_rights.rights && detail_rights.rights.rights_num) ? (detail_rights.rights.rights_num) : (0)}
        title2={
          <Fragment>
            <span
              style={{
                color: (detail_rights && detail_rights.rights && detail_rights.rights.total_ratio && detail_rights.rights.total_ratio.entity && parseFloat((detail_rights.rights.total_ratio.entity).replace('%', '')) > 100) ? ('#E75757') : ('#c2c2c2')
              }}
            >
              {
                (detail_rights && detail_rights.rights && detail_rights.rights.total_ratio && detail_rights.rights.total_ratio.entity)
                  ? (`${detail_rights.rights.total_ratio.entity}(實)`)
                  : ''
              }
            </span>
            <br />
            <span
              style={{
                color: (detail_rights && detail_rights.rights && detail_rights.rights.total_ratio && detail_rights.rights.total_ratio.digital && parseFloat((detail_rights.rights.total_ratio.digital).replace('%', '')) > 100) ? ('#E75757') : ('#c2c2c2')
              }}
            >
              {
                (detail_rights && detail_rights.rights && detail_rights.rights.total_ratio && detail_rights.rights.total_ratio.digital)
                  ? (`${detail_rights.rights.total_ratio.digital}(數)`)
                  : ''
              }
            </span>
          </Fragment>
        }
      />
      <InfoBanner
        desc="我方-詞"
        title1={(detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.lyrics_rights_num) ? (detail_rights.rights.default_company_rights.lyrics_rights_num) : ('0')}
        title2={
          <Fragment>
            <span
              style={{
                color: (detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.lyrics_ratio && detail_rights.rights.default_company_rights.lyrics_ratio.entity && parseFloat((detail_rights.rights.default_company_rights.lyrics_ratio.entity).replace('%', '')) > 100) ? ('#E75757') : ('#c2c2c2')
              }}
            >
              {
                (detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.lyrics_ratio && detail_rights.rights.default_company_rights.lyrics_ratio.entity)
                  ? (`${detail_rights.rights.default_company_rights.lyrics_ratio.entity}(實)`)
                  : ''
              }
            </span>
            <br />
            <span
              style={{
                color: (detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.lyrics_ratio && detail_rights.rights.default_company_rights.lyrics_ratio.digital && parseFloat((detail_rights.rights.default_company_rights.lyrics_ratio.digital).replace('%', '')) > 100) ? ('#E75757') : ('#c2c2c2')
              }}
            >
              {
                (detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.lyrics_ratio && detail_rights.rights.default_company_rights.lyrics_ratio.digital)
                  ? (`${detail_rights.rights.default_company_rights.lyrics_ratio.digital}(數)`)
                  : ''
              }
            </span>
          </Fragment>
        }
      />
      <InfoBanner
        desc="我方-曲"
        title1={(detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.tune_rights_num) ? (detail_rights.rights.default_company_rights.tune_rights_num) : ('0')}
        title2={
          <Fragment>
            <span
              style={{
                color: (detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.tune_ratio && detail_rights.rights.default_company_rights.tune_ratio.entity && parseFloat((detail_rights.rights.default_company_rights.tune_ratio.entity).replace('%', '')) > 100) ? ('#E75757') : ('#c2c2c2')
              }}
            >
              {(detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.tune_ratio && detail_rights.rights.default_company_rights.tune_ratio.entity) ? (`${detail_rights.rights.default_company_rights.tune_ratio.entity}(實)`) : ''}
            </span>
            <br />
            <span
              style={{
                color: (detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.tune_ratio && detail_rights.rights.default_company_rights.tune_ratio.digital && parseFloat((detail_rights.rights.default_company_rights.tune_ratio.digital).replace('%', '')) > 100) ? ('#E75757') : ('#c2c2c2')
              }}

            >
              {(detail_rights && detail_rights.rights && detail_rights.rights.default_company_rights && detail_rights.rights.default_company_rights.tune_ratio && detail_rights.rights.default_company_rights.tune_ratio.digital) ? (`${detail_rights.rights.default_company_rights.tune_ratio.digital}(數)`) : ''}
            </span>
          </Fragment>
        }
      />
      <InfoBanner
        desc="收錄專輯"
        title1={(info && info.song_code && albumList.belongAlbumInfo) ? (albumList.belongAlbumInfo.length) : (0)}
      />
      <InfoBanner
        desc="錄音資料"
        title1={(info.song_code && iSRCListBySong && iSRCListBySong.data_list) ? (iSRCListBySong.data_list.length) : (0)}
      />
    </div >
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loadingMultiGetInfo}
    >
      <PageHeaderWrapper
        title={`${info.song_code} - ${info.song_name}`}
        extra={buttonsList}
        content={description}
        extraContent={infoBanners}
        className={styles.infoBanners}
      >
        <ComInfo />
        <ComRights
          text="合約/權利"
          color="#FF7E22"
          history={false}
          showAgencyLists={showAgencyLists}
          songCode={info.song_code}
        />
        <ComRights
          text="歷史合約"
          color="#B3B3B4"
          history={true}
          showHistoryAgencyLists={showHistoryAgencyLists}
        />
        <ComAlbum
          color="#006DB6"
        />
        <ComIsrc
          color="#358B4A"
        />
        <ComNewMedia
          color="#9200FF"
        />
      </PageHeaderWrapper>
    </Spin >
  );
}

export default connect(({ authorizedCountryList, albumList, songList, loading }) => ({
  authorizedCountryList,
  albumList,
  songList,
  loadingMultiGetInfo: loading.effects['songList/fetchMultiGetInfo'],
}))(adv);