import globalSettings from '@/fn/globalsettings';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
} from 'antd';
import { connect, history } from 'umi';
import styles from '@/style/style.less';

const { TextArea } = Input;

export const ComImportSongMedia = props => {
  const {
    loading,
    dispatch,
    pageId,
    setPageTitle,
    enterpriseList,
    songMediaList: { changeId, songMediaList },
  } = props;
  const [mediaText, setMediaText] = useState('');

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'songMediaList/fetchGetSongMediaList',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        company_media_id: pageId,
        keyword: undefined,
        precise: '0',
        page_size: globalSettings.pageSize.toString(),
        page_current: '1',
      },
    });
  }

  // setData
  const setData = () => {
    function mediaData(media_song_code, media_song_name, song_code, isrc) {
      this.media_song_code = (media_song_code && media_song_code != '-') ? (media_song_code) : '';
      this.media_song_name = (media_song_name && media_song_name != '-') ? (media_song_name) : '';
      this.song_code = (song_code && song_code != '-') ? (song_code) : '';
      this.isrc = (isrc && isrc != '-') ? (isrc) : '';
    };
    let outputList = {
      agent_eid: enterpriseList.agent_eid,
      company_media_id: pageId,
      data: [],
    };
    let rowArr = mediaText.split(/\r\n|\n/g);

    // convert data
    if (rowArr && rowArr.length > 0) {
      for (let i = 0; i < rowArr.length; i++) {
        let orgItem = rowArr[i].split(/\t/g);
        let item = new mediaData(orgItem[0], orgItem[1], orgItem[2], orgItem[3]);

        if (orgItem[0] || orgItem[1] || orgItem[2] || orgItem[3]) {
          outputList.data.push(item);
        }
      }
    }

    dispatch({
      type: 'songMediaList/fetchImportSongMedia',
      payload: outputList,
      callback: (result) => {
        // console.log(result);
        if (result == 'ok') {
          history.push(`/new_media/${pageId}/song_media`);
        }
      },
    });
  }

  // mount (if pageId change)
  useEffect(() => {
    getData();
  }, [pageId]);

  // updateData
  useEffect(() => {
    setPageTitle(`${songMediaList.company_name}-貼入新增媒體歌編`);
  }, [changeId]);

  // ui -----
  const changeMediaText = (e) => {
    setMediaText(e.target.value);
  }

  const resetMediaText = () => {
    setMediaText('');
  }

  return (
    <Card
      loading={loading}
    >
      <Row>
        <Col xs={24} lg={20}>
          <table className={styles.formTable}>
            <thead>
              <tr>
                <th>平台歌編</th>
                <th>平台歌名</th>
                <th>歌編</th>
                <th>ISRC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4">
                  <TextArea
                    autoSize={{ minRows: 15, maxRows: 15 }}
                    value={mediaText}
                    onChange={changeMediaText}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col
          xs={24}
          className={styles.om_txt_align_r}
        >
          <Button
            className={styles.om_sp_m_lt}
            onClick={resetMediaText}
          >
            清除
          </Button>
          <Button
            className={styles.om_sp_m_lt}
            type="primary"
            onClick={setData}
          >
            送出
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default connect(({ enterpriseList, songMediaList, loading }) => ({
  enterpriseList,
  songMediaList,
  loading: loading.models.songMediaList,
}))(ComImportSongMedia);