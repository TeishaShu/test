import { PlusCircleOutlined, MinusCircleOutlined, DollarOutlined, CustomerServiceOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  message,
  Tooltip,
  Table,
} from 'antd';
import { Link, connect, history } from 'umi';
import ComPoint from '../../components/ComPoint';
import ComTextIcon from '../../components/ComTextIcon';
import ComLineIcon from './ComLineIcon';
import ComSongSettingModal from './ComSongSettingModal';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComContentTable = props => {
  const {
    isIdx,
    pageId,
    dispatch,
    loadingGetPrepaid,
    albumList: { info },
    discNum,
    data,
    // getData,
  } = props;
  const [songList, setSongList] = useState([]);
  const [sumFormatLength, setSumFormatLength] = useState('00\'00\"');
  const [sumIsDebut, setSumIsDebut] = useState(0);
  const [sumIsSongCalc, setSumIsSongCalc] = useState(0);
  const [sumIsSongRightCalc, setSumIsSongRightCalc] = useState(0);
  const [sumIsRecordCalc, setSumIsRecordCalc] = useState(0);
  const [sumIsRecordRightCalc, setSumIsRecordRightCalc] = useState(0);
  const [sumIsNmSongCalc, setSumIsNmSongCalc] = useState(0);
  const [sumIsNmRecordCalc, setSumIsNmRecordCalc] = useState(0);

  // songSettingModal
  const [songSettingModalVisible, setSongSettingModalVisible] = useState(false);
  const [editSongSettingModallItem, setEditSongSettingModalItem] = useState(undefined);
  // cusStyles
  const cusStyles = {
    noBorder: { border: 'none' },
    noBorderBlueBg: { border: 'none', backgroundColor: '#e6f7ff' }
  };

  // content -----
  useEffect(() => {
    const tmpData = [];

    if (data.content && data.content.length > 0) {
      for (let i = 0; i < data.content.length; i++) {
        tmpData.push({
          status: false,
          data: [],
        });
      }
    }
    setSongList(tmpData);
  }, [pageId]);

  useEffect(() => {
    let tmpSumFormatLength = '00\'00\"';
    let tmpSumFormatNum = 0;
    let tmpSumIsDebut = 0;
    let tmpSumIsSongCalc = 0;
    let tmpSumIsSongRightCalc = 0;
    let tmpSumIsRecordCalc = 0;
    let tmpSumIsRecordRightCalc = 0;
    let tmpSumIsNmSongCalc = 0;
    let tmpSumIsNmRecordCalc = 0;

    if (data.content && data.content.length > 0) {
      data.content.forEach((elem) => {
        // 秒數 format_length
        if (elem.format_length) {
          let secList = elem.format_length.replace('\"', '').split('\'');

          if (secList[0] && !isNaN(parseInt(secList[0]))) {
            tmpSumFormatNum += parseInt(secList[0]) * 60;
          }

          if (secList[1] && !isNaN(parseInt(secList[1]))) {
            tmpSumFormatNum += parseInt(secList[1]);
          }
        }

        // 首發 is_debut
        if (elem.is_debut == '1') {
          tmpSumIsDebut++;
        }

        // 詞曲曲數 is_song_calc
        if (elem.is_song_calc == '1') {
          tmpSumIsSongCalc++;
        }

        // 詞曲應結 is_song_right_calc
        if (elem.is_song_right_calc == '1') {
          tmpSumIsSongRightCalc++;
        }

        // 錄音曲數 is_record_calc
        if (elem.is_record_calc == '1') {
          tmpSumIsRecordCalc++;
        }

        // 錄音應結 is_record_right_calc 
        if (elem.is_record_right_calc == '1') {
          tmpSumIsRecordRightCalc++;
        }

        // 新媒體詞曲曲數 is_nm_song_calc
        if (elem.is_nm_song_calc == '1') {
          tmpSumIsNmSongCalc++;
        }

        // 新媒體錄音曲數 is_nm_record_calc
        if (elem.is_nm_record_calc == '1') {
          tmpSumIsNmRecordCalc++;
        }
      });

      // convert sec to Min"sec'
      let convertMin = Math.floor(tmpSumFormatNum / 60).toString();
      let convertSec = (tmpSumFormatNum % 60).toString();
      tmpSumFormatLength = `${convertMin.length < 2 ? '0' : ''}${convertMin}'${convertSec.length < 2 ? '0' : ''}${convertSec}"`;

      setSumFormatLength(tmpSumFormatLength);
      setSumIsDebut(tmpSumIsDebut);
      setSumIsSongCalc(tmpSumIsSongCalc);
      setSumIsSongRightCalc(tmpSumIsSongRightCalc);
      setSumIsRecordCalc(tmpSumIsRecordCalc);
      setSumIsRecordRightCalc(tmpSumIsRecordRightCalc);
      setSumIsNmSongCalc(tmpSumIsNmSongCalc);
      setSumIsNmRecordCalc(tmpSumIsNmRecordCalc);
    }
  }, [data.content]);

  const getPrepaidData = (idx, discContentId) => {
    dispatch({
      type: 'albumPrepaidList/fetchGetDiscContent',
      payload: {
        album_disc_content_id: discContentId
      },
      callback: (result) => {
        let tmpData = songList.slice();

        tmpData[idx].status = true;
        if (result && result.length > 0) {
          tmpData[idx].data = result;
        } else {
          tmpData[idx].data = [];
        }
        setSongList(tmpData);
      }
    });
  }

  // songSettingModal -----
  const updateData = () => {
    dispatch({
      type: 'albumList/fetchGetContent',
      payload: {
        album_id: pageId,
      },
    });
  }

  // showSongSettingModal
  const showSongSettingModal = (item) => {
    // TODO: 缺少 isrc 下發參數，需跟後端確認
    let newItem = {
      disc_content_id: item.album_disc_content_id,
      album_code: info.album_code,
      album_name_zh: info.album_name_zh,
      song_name: item.song_name,
      song_name_ext: item.song_name_ext,
      song_code: item.song_code,
      isrc: item.isrc,
      is_debut: commFn.convertToBool(item.is_debut),
      is_song_calc: commFn.convertToBool(item.is_song_calc),
      is_song_right_calc: commFn.convertToBool(item.is_song_right_calc),
      is_record_calc: commFn.convertToBool(item.is_record_calc),
      is_record_right_calc: commFn.convertToBool(item.is_record_right_calc),
      is_nm_song_calc: commFn.convertToBool(item.is_nm_song_calc),
      is_nm_record_calc: commFn.convertToBool(item.is_nm_record_calc),
      ui_info_type_id: info.type_id,
    };

    setSongSettingModalVisible(true);
    setEditSongSettingModalItem(newItem);
  }

  // hideSongSettingModal
  const hideSongSettingModal = () => {
    setSongSettingModalVisible(false);
  }

  // handleSongSettingModalSubmit
  const handleSongSettingModalSubmit = (obj) => {
    let setObj = { ...obj };

    setObj.is_debut = commFn.convertBoolToNumStr(setObj.is_debut);
    setObj.is_song_calc = commFn.convertBoolToNumStr(setObj.is_song_calc);
    setObj.is_song_right_calc = commFn.convertBoolToNumStr(setObj.is_song_right_calc);
    setObj.is_record_calc = commFn.convertBoolToNumStr(setObj.is_record_calc);
    setObj.is_record_right_calc = commFn.convertBoolToNumStr(setObj.is_record_right_calc);
    setObj.is_nm_song_calc = commFn.convertBoolToNumStr(setObj.is_nm_song_calc);
    setObj.is_nm_record_calc = commFn.convertBoolToNumStr(setObj.is_nm_record_calc);
    delete setObj.album_code;

    dispatch({
      type: 'albumList/fetchSetSongSetting',
      payload: setObj,
      callback: res => {
        if (res && res != 'error') {
          hideSongSettingModal();
          // getData();
          updateData();
        }
      }
    });
  }

  return (
    <Fragment>
      <Card
        type="inner"
        title={`Disc ${discNum} ${(data.disc_type) ? (`- ${data.disc_type}`) : ''}`}
        bordered={false}
        className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        bodyStyle={{ padding: '15px 0' }}
        loading={loadingGetPrepaid}
        extra={
          <EditOutlined
            className={styles.om_icon_style}
            onClick={() => {
              history.push(`/album/song_seq/id/${pageId}/disc_id/${data.disc_id}`);
            }}
          />
        }
      >
        <Row gutter={[0, 0]}>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>曲序</th>
                  <th>歌名</th>
                  <th>ISRC</th>
                  <th>演唱人</th>
                  <th style={{ width: '4%' }}> 秒數</th>
                  <th style={{ width: '2%' }}>&nbsp;</th>
                  <th style={{ width: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('11%') : ('4%') }}>首發</th>
                  <th
                    style={{
                      width: '5%',
                      display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                    }}
                  >
                    詞曲曲數
                  </th>
                  <th
                    style={{
                      width: '5%',
                      display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                    }}
                  >
                    詞曲應結
                  </th>
                  <th
                    style={{
                      width: '5%',
                      display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                    }}
                  >
                    錄音曲數
                  </th>
                  <th
                    style={{
                      width: '5%',
                      display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                    }}
                  >
                    錄音應結
                  </th>
                  <th style={{ width: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('11%') : ('6%') }}>新媒體詞曲曲數</th>
                  <th style={{ width: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('11%') : ('6%') }}>新媒體錄音曲數</th>
                  <th style={{ width: '2%' }}>&nbsp;</th>
                  <th style={{ width: '2%' }}>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  (data && data.content && data.content.length > 0)
                    ? (
                      <Fragment>
                        {
                          data.content.map((elem, idx) => (
                            <Fragment key={`tr_${idx}`}>
                              <tr>
                                <td><p>{elem.song_seq ? elem.song_seq : ''}</p></td>
                                <td>
                                  <Link
                                    to={`/song/adv/song_code/${elem.song_code}`}
                                    target="_blank"
                                    style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                                  >
                                    {elem.song_name ? elem.song_name : ''}
                                  </Link>
                                </td>
                                <td>
                                  <Link
                                    to={`/isrc/adv/${elem.isrc_id}`}
                                    target="_blank"
                                    style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                                  >
                                    {elem.isrc ? elem.isrc : ''}
                                  </Link>
                                </td>
                                <td><p>{elem.singer ? elem.singer : ''}</p></td>
                                <td><p>{elem.format_length ? elem.format_length : ''}</p></td>
                                <td>
                                  {
                                    (elem.prepaid_count && parseInt(elem.prepaid_count, 10) > 0)
                                      ? (
                                        (songList && songList[idx] && songList[idx].status)
                                          ? (
                                            <MinusCircleOutlined
                                              style={{ fontSize: '20px' }}
                                              onClick={e => {
                                                let tmpData = songList.slice();
                                                tmpData[idx].status = !tmpData[idx].status;
                                                setSongList(tmpData);
                                              }}
                                            />
                                          )
                                          : (
                                            <PlusCircleOutlined
                                              style={{ fontSize: '20px' }}
                                              onClick={e => {
                                                getPrepaidData(idx, elem.album_disc_content_id);
                                              }}
                                            />
                                          )
                                      )
                                      : ('')
                                  }
                                </td>
                                <td><ComPoint isVal={elem.is_debut} cusColor="green" /></td>
                                <td
                                  style={{
                                    display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                                  }}
                                >
                                  <ComPoint isVal={elem.is_song_calc} />
                                </td>
                                <td
                                  style={{
                                    display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                                  }}
                                >
                                  <ComPoint isVal={elem.is_song_right_calc} />
                                </td>
                                <td
                                  style={{
                                    display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                                  }}
                                >
                                  <ComPoint isVal={elem.is_record_calc} />
                                </td>
                                <td
                                  style={{
                                    display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                                  }}
                                >
                                  <ComPoint isVal={elem.is_record_right_calc} />
                                </td>
                                <td><ComPoint isVal={elem.is_nm_song_calc} cusColor="blue" /></td>
                                <td><ComPoint isVal={elem.is_nm_record_calc} cusColor="blue" /></td>
                                <td>
                                  <Tooltip title="歌曲設定">
                                    <CustomerServiceOutlined
                                      className={styles.om_icon_btn_style}
                                      onClick={() => {
                                        showSongSettingModal(elem);
                                      }}
                                    />
                                  </Tooltip>
                                </td>
                                <td>
                                  <Tooltip title="預付">
                                    <DollarOutlined
                                      className={styles.om_icon_btn_style}
                                      style={{
                                        color: (elem.prepaid_count && parseInt(elem.prepaid_count, 10) > 0) ? ('#F19D43') : ('#A6A4A0')
                                      }}
                                      onClick={() => {
                                        history.push(`/album/prepaid/album_id/${data.album_id}/disc_content_id/${elem.album_disc_content_id}`);
                                      }}
                                    />
                                  </Tooltip>
                                </td>
                              </tr>
                              <tr
                                style={{
                                  display: (songList && songList[idx] && songList[idx].status) ? ('table-row') : ('none')
                                }}
                              >
                                <td colSpan="6">&nbsp;</td>
                                <td colSpan="9" style={{ paddingRight: '0' }}>
                                  {
                                    (songList && songList[idx] && songList[idx].status && songList[idx].data && songList[idx].data.length > 0)
                                      ? (
                                        <table style={{ width: '100%' }}>
                                          <tbody>
                                            {
                                              songList[idx].data.map((pElem, pIdx) => {
                                                return (
                                                  (pElem.song_right)
                                                    ? (
                                                      <tr key={`pData_${pIdx}`}>
                                                        <td style={{ width: '85px' }}>
                                                          <p>
                                                            {<ComTextIcon text="實" isChecked={pElem.is_entity == '1' ? true : false} />}
                                                            {<ComTextIcon text="數" isChecked={pElem.is_digital == '1' ? true : false} />}
                                                          </p>
                                                        </td>
                                                        <td>
                                                          <p>{pElem.contract_song_code}</p>
                                                        </td>
                                                        <td>
                                                          <p>{pElem.song_right}</p>
                                                        </td>
                                                        <td>
                                                          <p>{pElem.author_name}</p>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>
                                                          <p>{pElem.value}</p>
                                                        </td>
                                                        <td style={{ textAlign: 'right', width: '45px' }}>
                                                          <ComLineIcon isChecked={pElem.is_paid == '1' ? true : false} />
                                                          <ComLineIcon isChecked={pElem.is_no_commission == '1' ? true : false} />
                                                          <ComLineIcon isChecked={pElem.merge_rights && pElem.merge_rights.length > 0 ? true : false} />
                                                        </td>
                                                      </tr>
                                                    )
                                                    : (null)
                                                )
                                              })
                                            }
                                          </tbody>
                                        </table>
                                      )
                                      : (' ')
                                  }
                                </td>
                              </tr>
                            </Fragment>
                          ))
                        }
                        <tr>
                          <td style={{ ...cusStyles.noBorder }}>&nbsp;</td>
                          <td style={{ ...cusStyles.noBorder }}>&nbsp;</td>
                          <td style={{ ...cusStyles.noBorder }}>&nbsp;</td>
                          <td style={{ ...cusStyles.noBorder }}>&nbsp;</td>
                          <td colSpan="2" style={{ ...cusStyles.noBorderBlueBg }}>
                            <p>{sumFormatLength}</p>
                          </td>
                          <td style={{ ...cusStyles.noBorderBlueBg, textAlign: 'center' }}>
                            <p>{sumIsDebut}</p>
                          </td>
                          <td style={{ ...cusStyles.noBorderBlueBg, textAlign: 'center' }}>
                            <p>{sumIsSongCalc}</p>
                          </td>
                          <td
                            style={{
                              ...cusStyles.noBorderBlueBg,
                              textAlign: 'center',
                              display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                            }}
                          >
                            <p>{sumIsSongRightCalc}</p>
                          </td>
                          <td
                            style={{
                              ...cusStyles.noBorderBlueBg,
                              textAlign: 'center',
                              display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                            }}
                          >
                            <p>{sumIsRecordCalc}</p>
                          </td>
                          <td
                            style={{
                              ...cusStyles.noBorderBlueBg,
                              textAlign: 'center',
                              display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                            }}
                          >
                            <p>{sumIsRecordRightCalc}</p>
                          </td>
                          <td
                            style={{
                              ...cusStyles.noBorderBlueBg,
                              textAlign: 'center',
                              display: (info.type_id && (info.type_id == '10' || info.type_id == '11')) ? ('none') : ('table-cell')
                            }}
                          >
                            <p>{sumIsNmSongCalc}</p>
                          </td>
                          <td style={{
                            ...cusStyles.noBorderBlueBg,
                            textAlign: 'center',
                          }}>
                            <p>{sumIsNmRecordCalc}</p>
                          </td>
                          <td colSpan="2" style={{ ...cusStyles.noBorderBlueBg }}>
                            <p>&nbsp;</p>
                          </td>
                        </tr>
                      </Fragment>
                    )
                    : (null)
                }
              </tbody>
            </table>
          </Col>
        </Row>
      </Card >
      <ComSongSettingModal
        editItem={editSongSettingModallItem}
        visible={songSettingModalVisible}
        onCancel={hideSongSettingModal}
        onSubmit={handleSongSettingModalSubmit}
      />
    </Fragment>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
  loadingGetPrepaid: loading.effects['albumPrepaidList/fetchGetDiscContent'],
  loadingSetSongSetting: loading.effects['albumList/fetchSetSongSetting'],
}))(ComContentTable);


