import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Form,
  Select,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';
import FormAlbumNameAPI from '@/components/FormAlbumNameAPI';

const { Option } = Select;

export const ComInfo = props => {
  const {
    form,
    isParams,
    setIsEdit,
    getPrepaidData,
    setShowRightList,
    dispatch,
    albumList: { multiChangeId, content },
  } = props;
  // album_id
  const [albumIdList, setAlbumIdList] = useState([]);
  const [albumIdCode, setAlbumIdCode] = useState('');
  // ui_disc
  const [uiDiscList, setUiDiscList] = useState([]);
  // ui_song
  const [uiSongList, setUiSongList] = useState([]);

  // api -----
  const converOptAndCheckData = (isInit, obj) => {
    if (obj && obj.info && obj.content) {
      let infoRes = obj.content;
      let tmpList = [];
      let iIdx = -1;
      let jIdx = -1;

      if (infoRes.disc && infoRes.disc.length > 0) {
        for (let i = 0; i < infoRes.disc.length; i++) {
          let tmpDiscItem = {
            idx: i,
            album_id: infoRes.disc[i].album_id,
            value: infoRes.disc[i].disc_id,
            label: `Disc${(i + 1).toString()}(${infoRes.disc[i].disc_type})`,
            content: [],
          };

          if (infoRes.disc[i].content && infoRes.disc[i].content.length > 0) {
            for (let j = 0; j < infoRes.disc[i].content.length; j++) {
              if (isInit && isParams.disc_content_id && isParams.disc_content_id == infoRes.disc[i].content[j].album_disc_content_id) {
                iIdx = i;
                jIdx = j;
              }

              let tmpContentItem = {
                idx: j,
                value: infoRes.disc[i].content[j].album_disc_content_id,
                label: `${infoRes.disc[i].content[j].song_name} (${infoRes.disc[i].content[j].song_code})`,
              }

              tmpDiscItem.content.push(tmpContentItem);
            }
          }
          tmpList.push(tmpDiscItem);
        }
      }

      // check option, value -----
      setAlbumIdList([{ id: obj.info.id, album_name_zh: obj.info.album_name_zh, album_code: obj.info.album_code }]);
      setAlbumIdCode(obj.info.album_code);
      form.setFieldsValue({ ui_album: obj.info.id });
      setUiDiscList(tmpList);
      if (iIdx != -1) {
        form.setFieldsValue({ ui_disc: tmpList[iIdx].value });
        setUiSongList(tmpList[iIdx].content);
      } else {
        form.setFieldsValue({ ui_disc: (tmpList && tmpList[0] && tmpList[0].value) ? (tmpList[0].value) : '' });
        setUiSongList((tmpList && tmpList[0] && tmpList[0].content) ? (tmpList[0].content) : []);
      }
      if (jIdx != -1) {
        form.setFieldsValue({ ui_song: tmpList[iIdx].content[jIdx].value });
      } else {
        form.setFieldsValue({ ui_song: (tmpList && tmpList[0] && tmpList[0].content && tmpList[0].content[0] && tmpList[0].content[0].value) ? (tmpList[0].content[0].value) : '' });
      }

      form.setFieldsValue({ ui_release_country: obj.info.release_country });
      form.setFieldsValue({ ui_release_date: obj.info.release_date });
    } else {
      form.setFieldsValue({
        ui_album: '',
        ui_disc: '',
        ui_song: '',
        ui_release_country: '',
        ui_release_date: '',
      });

      setAlbumIdList([]);
      setAlbumIdCode('');
      setUiDiscList([]);
      setUiSongList([]);
    }
  }

  // getAlbumData
  const getAlbumData = (idVal, isInit) => {
    if (typeof isInit == 'object') {
      isInit = false;
    }

    if (!isInit && !form.getFieldsValue().ui_album) {
      converOptAndCheckData(false, null);
      changeDiscOrSong('ui_album');
    } else {
      dispatch({
        type: 'albumList/fetchMultiGetSongSeq',
        payload: {
          album_id: (isInit) ? (isParams.id) : (idVal),
        },
        callback: res => {
          converOptAndCheckData(isInit, res);
          changeDiscOrSong();
        }
      });
    }
  }

  // mount
  useEffect(() => {
    form.setFieldsValue({
      ui_album: '',
      ui_disc: '',
      ui_song: '',
      ui_release_country: '',
      ui_release_date: '',
      prepaid: [],
    });
    setShowRightList([]);

    getAlbumData(null, true);
  }, []);

  // changeDiscOrSong
  const changeDiscOrSong = (elemName, option) => {
    // change ui_disc, trigger ui_song option
    if (elemName == 'ui_disc' && option) {
      let tmpSongOpt = (uiDiscList[option.idx].content) ? (uiDiscList[option.idx].content.slice()) : [];

      form.setFieldsValue({ ui_song: (tmpSongOpt && tmpSongOpt.length > 0) ? (uiDiscList[option.idx].content[0].value) : ('') });
      setUiSongList(tmpSongOpt);
    }

    // check value, get prepaid
    if (form.getFieldsValue().ui_album && form.getFieldsValue().ui_disc && form.getFieldsValue().ui_song) {
      getPrepaidData(form.getFieldsValue().ui_song);
    } else {
      // clear prepaid
      form.setFieldsValue({ prepaid: [] });
      setShowRightList([]);
    }

    setIsEdit(false);
  }

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="指定歌曲"
    >
      <Row gutter={[64, 0]}>
        <Col xs={24} lg={8}>
          <FormAlbumNameAPI
            form={form}
            isLabel="專輯名稱"
            isName="ui_album"
            isSelectText="album_name_zh"
            isList={albumIdList}
            setIsList={setAlbumIdList}
            changeFn={getAlbumData}
            isRules={[
              { required: true, message: '此欄位為必填' }
            ]}
            isCode={albumIdCode}
            setIsCode={setAlbumIdCode}
            hideCode={true}
          />
          <label
            style={{ position: 'relative', top: '-20px', display: 'block', textAlign: 'right' }}
          >{(albumIdCode) ? `(${albumIdCode})` : ''}</label>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item
            name="ui_release_country"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="發行地區"
            shouldUpdate
          >
            {() => {
              return form.getFieldsValue().ui_release_country;
            }}
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item
            name="ui_release_date"
            style={{ display: 'none' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="發行日期"
            shouldUpdate
          >
            {() => {
              return form.getFieldsValue().ui_release_date;
            }}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[64, 0]}>
        <Col xs={24} lg={8}>
          <Form.Item
            name="ui_disc"
            label="Disc"
            rules={[
              {
                required: true,
                message: '此欄位為必填'
              }
            ]}
          >
            <Select
              options={uiDiscList}
              onChange={(value, option) => {
                changeDiscOrSong('ui_disc', option);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item
            name="ui_song"
            label="歌曲"
            rules={[
              {
                required: true,
                message: '此欄位為必填'
              }
            ]}
          >
            <Select
              options={uiSongList}
              onChange={(value, option) => {
                changeDiscOrSong('ui_song', option);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
}))(ComInfo);