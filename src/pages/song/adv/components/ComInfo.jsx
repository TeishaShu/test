import copy from 'copy-to-clipboard';
import { CheckOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  message,
  Tooltip,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComInfo = props => {
  const {
    songList: { multiChangeId, optLanguage, optSongType, info },
  } = props;
  const [isISWC, setIsISWC] = useState('');
  const [isLanguage, setIsLanguage] = useState('');
  const [isSongType, setIsSongType] = useState('');

  // api -----
  useEffect(() => {
    // iswc
    setIsISWC(commFn.strToISWC(info.iswc));

    // song_language_id
    if (info.song_language_id) {
      for (let i = 0; i < optLanguage.length; i++) {
        if (info.song_language_id == optLanguage[i].value) {
          setIsLanguage(optLanguage[i].label);
          break;
        }
      }
    } else {
      setIsLanguage('');
    }

    // song_type_custom
    if (info.song_type_custom) {
      setIsSongType(`自訂(${info.song_type_custom})`);
    } else {
      for (let i = 0; i < optSongType.length; i++) {
        if (info.song_type_id == optSongType[i].value) {
          setIsSongType(optSongType[i].label);
          break;
        }
      }
    }
  }, [multiChangeId]);

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd} ${styles.cardBodyNoBPd}`}
        title="歌曲資料"
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>系統顯示：<span>{info.song_name}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>原始歌名：<span>{info.song_name_original}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>中文歌名：<span>{info.song_name_zh}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>英文歌名：<span>{info.song_name_en}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>拼音歌名：<span>{info.song_name_pingyin}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              ISWC：<span>{isISWC}</span>&nbsp;&nbsp;
              {
                (isISWC)
                  ? (
                    <Tooltip title="複製 ISWC">
                      <CopyOutlined
                        className={styles.om_icon_style}
                        onClick={() => {
                          copy(info.iswc);
                          message.success('複製成功');
                        }}
                      />
                    </Tooltip>
                  )
                  : ('')
              }
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>語言：<span>{isLanguage}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>型態：<span>{isSongType}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>版別：<span>{info.song_version}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>新媒體結算 - 詞曲：
              <span>
                {
                  (info.is_settle == '1')
                    ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                    : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                }
              </span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>備註：<br />{
              (info.notes)
                ? (
                  info.notes.split('\n').map((elem, idx, arr) => (
                    <span key={idx}>
                      {elem}
                      <br />
                    </span>
                  )))
                : ('')
            }</p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
        title="OT/組曲/節錄"
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p style={{ display: 'inline-block', verticalAlign: 'top' }}>
              來源({info.origin_list.length})：
            </p>
            <p style={{ display: 'inline-block' }}>
              <span>
                {
                  info.origin_list.map((elem, idx, arr) => (
                    <Fragment key={`origin_list_${idx}`}>
                      <Link
                        to={`/song/adv/id/${elem.song_id}`}
                        target="_blank"
                      >
                        {elem.song_name}
                      </Link>
                      <br />
                    </Fragment>
                  ))
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p style={{ display: 'inline-block', verticalAlign: 'top' }}>
              去處({info.used_list.length})：
            </p>
            <p style={{ display: 'inline-block' }}>
              <span>
                {
                  info.used_list.map((elem, idx, arr) => (
                    <Fragment key={`used_list_${idx}`}>
                      <Link
                        to={`/song/adv/id/${elem.song_id}`}
                        target="_blank"
                      >
                        {elem.song_name}
                      </Link>
                      <br />
                    </Fragment>
                  ))
                }
              </span>
            </p>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default connect(({ songList, loading }) => ({
  songList,
  loadingMultiGetInfo: loading.effects['songList/fetchMultiGetInfo'],
}))(ComInfo);
